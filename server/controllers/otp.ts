import { Request, Response } from 'express';
import { storage } from '../storage';

// Helper to generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    
    if (!phone || typeof phone !== 'string' || phone.length < 10) {
      return res.status(400).json({ message: "Valid phone number is required" });
    }
    
    // Generate OTP
    const otpCode = generateOTP();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10); // OTP valid for 10 minutes
    
    // Log the OTP generation
    console.log(`OTP Controller: Generating OTP ${otpCode} for phone ${phone}, expires at ${expiryTime.toISOString()}`);
    
    const createdOtp = await storage.createOTP({
      phone,
      otp: otpCode,
      expiresAt: expiryTime
    });
    
    console.log(`OTP Controller: Created OTP with ID ${createdOtp.id} successfully`);
    
    // In a real app, we would send SMS here
    console.log(`OTP for ${phone}: ${otpCode}`);
    
    res.json({ message: "OTP sent successfully", expiresAt: expiryTime });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }
    
    console.log(`OTP Controller: Verifying OTP ${otp} for phone ${phone}`);
    const isValid = await storage.verifyOTP(phone, otp);
    
    if (!isValid) {
      console.log(`OTP Controller: Verification failed for phone ${phone}`);
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    
    console.log(`OTP Controller: Verification successful for phone ${phone}`);
    res.json({ message: "OTP verified successfully", verified: true });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};