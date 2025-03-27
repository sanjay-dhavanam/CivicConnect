import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TabNavigation />
      
      <main className="flex-1 bg-gray-50 p-4">
        <div className="container mx-auto py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-gray-600 mb-8">
              Last updated: March 15, 2024
            </p>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  CIVICAMP ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
                <p className="text-gray-700">
                  We take your privacy very seriously and we ask that you read this Privacy Policy carefully as it contains important information about how we will use your personal data.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Personal Information</h3>
                    <p className="text-gray-700">
                      We may collect personal information that you voluntarily provide when using CIVICAMP, including:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2 ml-4">
                      <li>Contact information (name, email address, phone number)</li>
                      <li>Account credentials (username, password)</li>
                      <li>Demographic information (address, city, state)</li>
                      <li>Aadhaar number (for verification purposes only)</li>
                      <li>Content you post (issue reports, comments, votes)</li>
                      <li>Images and videos you upload</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Automatically Collected Information</h3>
                    <p className="text-gray-700">
                      When you access CIVICAMP, our servers may automatically record information including:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2 ml-4">
                      <li>IP address and device identifiers</li>
                      <li>Browser type and settings</li>
                      <li>Date and time of access</li>
                      <li>Location information (if enabled)</li>
                      <li>Usage patterns and interactions with our platform</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2">
                  <li>Providing, operating, and maintaining our platform</li>
                  <li>Verifying your identity through Aadhaar authentication</li>
                  <li>Processing and routing civic issue reports to appropriate authorities</li>
                  <li>Communicating with you about updates, responses to issues, and platform changes</li>
                  <li>Analyzing usage patterns to improve our platform and services</li>
                  <li>Preventing and addressing technical issues, fraud, or illegal activities</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Data Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2">
                  <li><strong>Government Authorities:</strong> Issue reports and related information are shared with relevant government departments and officials for resolution.</li>
                  <li><strong>Public Display:</strong> Issue reports, comments, and certain user profile information may be publicly displayed on the platform.</li>
                  <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our platform.</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests.</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2">
                  <li>Encryption of sensitive data both in transit and at rest</li>
                  <li>Secure authentication mechanisms</li>
                  <li>Regular security assessments and audits</li>
                  <li>Access controls and monitoring</li>
                  <li>Data minimization practices</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  You have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2">
                  <li>Accessing, correcting, or updating your personal information</li>
                  <li>Deleting your account and associated data (subject to legal requirements)</li>
                  <li>Opting out of marketing communications</li>
                  <li>Controlling location tracking and other device permissions</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  To exercise these rights, you can adjust your account settings or contact us directly.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@civicamp.gov.in
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> Data Protection Officer, CIVICAMP<br />
                    Ministry of Electronics & Information Technology<br />
                    Electronics Niketan, 6, CGO Complex<br />
                    New Delhi - 110003, India
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}