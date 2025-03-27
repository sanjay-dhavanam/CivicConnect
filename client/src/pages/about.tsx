import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TabNavigation />
      
      <main className="flex-1 flex justify-center bg-gray-50 p-4">
        <div className="container max-w-4xl my-8">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <Info className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-bold">About CIVICAMP</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose max-w-none">
                <h2>Our Mission</h2>
                <p>
                  CIVICAMP is a transparent governance platform connecting citizens with local authorities. 
                  Our mission is to bridge the communication gap between citizens and government, 
                  fostering transparency, accountability, and collaborative problem-solving in communities.
                </p>
                
                <h2>What We Do</h2>
                <p>
                  The platform enables real-time issue reporting through videos and photos, community voting, 
                  fact-checking, and provides open access to financial plans and investment data. 
                </p>
                
                <h2>Key Features</h2>
                <ul>
                  <li>Location-based issue reporting and tracking</li>
                  <li>Transparent budget allocation and spending visualization</li>
                  <li>Parliamentary speech translations and updates</li>
                  <li>Secure Aadhaar-based authentication with OTP verification</li>
                  <li>Representative profiles and activity tracking</li>
                </ul>
                
                <h2>Our Vision</h2>
                <p>
                  We envision a future where citizens actively participate in governance, where 
                  public decision-making is transparent, and where communities collaborate with 
                  authorities to create positive change.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}