import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Upload, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "@/lib/fileUpload";
import { useAuth } from "@/hooks/useAuth";
import { LocationSelector } from "@/components/shared/LocationSelector";

// Create schema for issue reporting
const reportIssueSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.string().min(1, "Please select an issue type"),
  priority: z.string().min(1, "Please select a priority level"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type ReportIssueFormValues = z.infer<typeof reportIssueSchema>;

export function ReportIssueForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [uploading, setUploading] = useState(false);

  const form = useForm<ReportIssueFormValues>({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      priority: "medium",
      address: "",
    },
  });

  const reportIssueMutation = useMutation({
    mutationFn: async (data: ReportIssueFormValues & { media: string[]; location: any }) => {
      const res = await apiRequest("POST", "/api/issues", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Issue reported successfully",
        description: "Your issue has been reported and will be reviewed by local authorities.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/issues"] });
      navigate("/");
    },
    onError: (error: any) => {
      setError(error.message || "Failed to report issue. Please try again.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleLocationSelect = (position: { lat: number; lng: number }) => {
    setLocation(position);
  };

  const getLocationFromBrowser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          toast({
            title: "Location detected",
            description: `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`,
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: `Failed to get your location: ${error.message}`,
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
    }
  };

  async function onSubmit(data: ReportIssueFormValues) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to report an issue",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (location.lat === 0 && location.lng === 0) {
      setError("Please select a location for the issue");
      return;
    }

    // Reset any previous errors
    setError(null);
    
    try {
      setUploading(true);
      // Upload files if any
      const mediaUrls: string[] = [];
      if (files.length > 0) {
        for (const file of files) {
          const url = await uploadFile(file);
          mediaUrls.push(url);
        }
      }
      setUploading(false);

      // Submit the issue with uploaded media URLs
      reportIssueMutation.mutate({
        ...data,
        media: mediaUrls,
        location: {
          ...location,
          state: "Delhi", // These would come from LocationSelector in a real app
          city: "New Delhi"
        }
      });
    } catch (err: any) {
      setUploading(false);
      setError(err.message || "Error uploading files");
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Report an Issue</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an issue type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="roads">Roads & Infrastructure</SelectItem>
                      <SelectItem value="water">Water Supply</SelectItem>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="sanitation">Sanitation & Waste</SelectItem>
                      <SelectItem value="public">Public Spaces</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief title of the issue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed description of the issue" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Location</FormLabel>
              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Search or enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={getLocationFromBrowser}
                  className="flex-shrink-0"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Use My Location</span>
                </Button>
              </div>
              
              {/* This would be a map selector component in a real app */}
              <LocationSelector onLocationSelect={handleLocationSelect} />
            </div>

            <div className="space-y-2">
              <FormLabel>Upload Photos/Videos</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">Drag and drop files here or</p>
                <div className="mt-2">
                  <label htmlFor="file-upload" className="text-primary hover:text-primary-dark font-medium text-sm cursor-pointer">
                    Browse Files
                    <Input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept="image/*,video/*" 
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum file size: 50MB</p>
                
                {/* File preview */}
                {files.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {files.map((file, index) => (
                      <div 
                        key={index} 
                        className="relative group bg-gray-100 rounded-md p-1"
                      >
                        <div className="text-xs truncate max-w-[100px]">{file.name}</div>
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hidden group-hover:block"
                          onClick={() => removeFile(index)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
        <Button variant="outline" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          onClick={form.handleSubmit(onSubmit)}
          disabled={reportIssueMutation.isPending || uploading}
        >
          {reportIssueMutation.isPending || uploading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              {uploading ? "Uploading..." : "Submitting..."}
            </span>
          ) : (
            "Submit Report"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
