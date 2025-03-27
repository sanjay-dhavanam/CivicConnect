import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

// Extend the schema for registration
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  aadhaarNumber: z.string().min(12, "Aadhaar number must be 12 digits").max(12, "Aadhaar number must be 12 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      phone: "",
      aadhaarNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = data;
      const res = await apiRequest("POST", "/api/auth/register", {
        ...registerData,
        userType: "citizen", // Default to citizen
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "You have been registered successfully. Please login.",
      });
      navigate("/login");
    },
    onError: (error: any) => {
      setError(error.message || "Failed to register. Please try again.");
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (phone: string) => {
      const res = await apiRequest("POST", "/api/auth/send-otp", { phone });
      return res.json();
    },
    onSuccess: () => {
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your phone",
      });
    },
    onError: (error: any) => {
      setError(error.message || "Failed to send OTP. Please try again.");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      const res = await apiRequest("POST", "/api/auth/verify-otp", { phone, otp });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.verified) {
        const values = form.getValues();
        registerMutation.mutate(values);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    },
    onError: (error: any) => {
      setError(error.message || "Failed to verify OTP. Please try again.");
    },
  });

  function onSubmit(data: RegisterFormValues) {
    // Reset any previous errors
    setError(null);
    
    if (!otpSent) {
      // Validate phone number
      if (!data.phone || data.phone.length < 10) {
        setError("Please enter a valid phone number with at least 10 digits");
        return;
      }
      
      // Validate Aadhaar number
      if (!data.aadhaarNumber || data.aadhaarNumber.length !== 12) {
        setError("Please enter a valid 12-digit Aadhaar number");
        return;
      }
      
      // Validate password matching
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      
      // First validate form and send OTP
      if (form.formState.isValid) {
        console.log("Sending OTP to:", data.phone);
        sendOtpMutation.mutate(data.phone);
      }
    } else {
      // Validate OTP
      if (!otpValue || otpValue.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }
      
      // Then verify OTP and register
      console.log("Verifying OTP:", otpValue, "for phone:", data.phone);
      verifyOtpMutation.mutate({ phone: data.phone, otp: otpValue });
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Register for CIVICAMP</CardTitle>
        <CardDescription>
          Create an account to report issues and engage with your local government
        </CardDescription>
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aadhaarNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhaar Number</FormLabel>
                  <FormControl>
                    <Input placeholder="12-digit Aadhaar number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Create a password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {otpSent && (
              <FormItem>
                <FormLabel>OTP Verification</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter 6-digit OTP" 
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    maxLength={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={registerMutation.isPending || sendOtpMutation.isPending || verifyOtpMutation.isPending}
            >
              {registerMutation.isPending || verifyOtpMutation.isPending ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                  Processing...
                </span>
              ) : otpSent ? (
                "Verify & Register"
              ) : (
                sendOtpMutation.isPending ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Separator className="my-2" />
        <div className="text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-primary hover:underline">Login</a>
        </div>
      </CardFooter>
    </Card>
  );
}
