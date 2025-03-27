import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, Landmark, Award, BarChart4, Bookmark } from "lucide-react";

export default function GovtPortals() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TabNavigation />
      
      <main className="flex-1 bg-gray-50 p-4">
        <div className="container mx-auto py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-2">
              <Landmark className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Government Portals</h1>
            </div>
            <p className="text-gray-600 mb-8">
              Direct links to official government services and resources
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>Digital India</CardTitle>
                  </div>
                  <CardDescription>Government's flagship program</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 text-sm">
                    Digital India is a campaign launched by the Government of India to ensure the government's services are made available to citizens electronically.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">DigiLocker</span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Visit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">MyGov Portal</span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Visit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Umang App</span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Visit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <CardTitle>Citizen Services</CardTitle>
                  </div>
                  <CardDescription>Essential government services</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 text-sm">
                    Access essential government services for citizens, including identity documents, certificates, and permissions.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Aadhaar Portal</span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Visit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Passport Seva</span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Visit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">e-Courts Services</span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Visit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <BarChart4 className="h-5 w-5 text-purple-600" />
                    </div>
                    <CardTitle>Open Government Data</CardTitle>
                  </div>
                  <CardDescription>Data portals and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 text-sm">
                    Access public government data, statistics, and visualizations for research, development, and analysis.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Data.gov.in</span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Visit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Open Budgets India</span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Visit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Census Data Portal</span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Visit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <Bookmark className="h-5 w-5 text-amber-600" />
                    </div>
                    <CardTitle>Government Schemes</CardTitle>
                  </div>
                  <CardDescription>Welfare and development programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 text-sm">
                    Find information about various government welfare schemes, subsidies, and development programs.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">PM Kisan</span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Visit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Ayushman Bharat</span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Visit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Skill India</span>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Visit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Ministry Websites</CardTitle>
                <CardDescription>
                  Official websites of key government ministries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start h-auto py-2">
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">Ministry of Home Affairs</span>
                      <span className="text-xs text-gray-500">mha.gov.in</span>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto py-2">
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">Ministry of Finance</span>
                      <span className="text-xs text-gray-500">finmin.nic.in</span>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto py-2">
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">Ministry of Education</span>
                      <span className="text-xs text-gray-500">education.gov.in</span>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto py-2">
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">Ministry of Health</span>
                      <span className="text-xs text-gray-500">mohfw.gov.in</span>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto py-2">
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">Ministry of Agriculture</span>
                      <span className="text-xs text-gray-500">agriculture.gov.in</span>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto py-2">
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">Ministry of IT</span>
                      <span className="text-xs text-gray-500">meity.gov.in</span>
                    </div>
                  </Button>
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