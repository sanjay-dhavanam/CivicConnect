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

const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      });
      navigate("/");
    },
    onError: (error: any) => {
      setError(error.message || "Failed to login. Please try again.");
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
        loginMutation.mutate(values);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    },
    onError: (error: any) => {
      setError(error.message || "Failed to verify OTP. Please try again.");
    },
  });

  function onSubmit(data: LoginFormValues) {
    // Reset any previous errors
    setError(null);
    
    if (!otpSent) {
      // First validate the phone number
      if (!data.phone || data.phone.length < 10) {
        setError("Please enter a valid phone number with at least 10 digits");
        return;
      }
      
      // Send OTP
      console.log("Sending OTP to:", data.phone);
      sendOtpMutation.mutate(data.phone);
    } else {
      // Validate OTP
      if (!otpValue || otpValue.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }
      
      // Verify OTP and login
      console.log("Verifying OTP:", otpValue, "for phone:", data.phone);
      verifyOtpMutation.mutate({ phone: data.phone, otp: otpValue });
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Login to CIVICAMP</CardTitle>
        <CardDescription>
          Enter your phone number and password to access your account
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
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
              disabled={loginMutation.isPending || sendOtpMutation.isPending || verifyOtpMutation.isPending}
            >
              {loginMutation.isPending || verifyOtpMutation.isPending ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                  Processing...
                </span>
              ) : otpSent ? (
                "Verify & Login"
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
        <div className="text-sm text-gray-500 mb-4">
          Are you a government official? <a href="/government-login" className="text-primary hover:underline">Login here</a>
        </div>
        <Separator className="my-2" />
        <div className="text-sm text-gray-500">
          Don't have an account? <a href="/register" className="text-primary hover:underline">Register</a>
        </div>
      </CardFooter>
    </Card>
  );
}
