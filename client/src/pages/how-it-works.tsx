import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TabNavigation />
      
      <main className="flex-1 flex justify-center bg-gray-50 p-4">
        <div className="container max-w-4xl my-8">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-bold">How CIVICAMP Works</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose max-w-none">
                <h2>For Citizens</h2>
                
                <h3>1. Create an Account</h3>
                <p>
                  Register using your phone number and Aadhaar details. Our secure verification 
                  process ensures that only genuine citizens can access the platform.
                </p>
                
                <h3>2. Report Issues</h3>
                <p>
                  Easily report local issues by uploading photos or videos, adding a description, 
                  and marking the exact location on the map. This helps authorities understand the problem better.
                </p>
                
                <h3>3. Track Progress</h3>
                <p>
                  Follow updates on your reported issues and others in your community. See when officials 
                  acknowledge the problem and track the resolution process from start to finish.
                </p>
                
                <h3>4. Engage with the Community</h3>
                <p>
                  Upvote important issues, comment on reports, and participate in discussions about 
                  local development plans. Your voice matters in shaping community priorities.
                </p>
                
                <h2>For Government Officials</h2>
                
                <h3>1. Access the Government Portal</h3>
                <p>
                  Government representatives can log in through a dedicated portal with secure authentication.
                </p>
                
                <h3>2. Manage Reported Issues</h3>
                <p>
                  View, prioritize, and update the status of reported issues. Communicate directly 
                  with citizens about resolution timelines and progress.
                </p>
                
                <h3>3. Share Budget Allocation</h3>
                <p>
                  Transparently publish budget plans and spending data, allowing citizens to understand 
                  how public funds are being utilized in their area.
                </p>
                
                <h3>4. Post Parliamentary Updates</h3>
                <p>
                  Share summaries of important legislative discussions and decisions that impact local communities.
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