import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, LineChart, FileText, Files } from "lucide-react";

export default function OpenData() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TabNavigation />
      
      <main className="flex-1 bg-gray-50 p-4">
        <div className="container mx-auto py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Open Data Portal</h1>
            <p className="text-gray-600 mb-8">
              Access and download public data from CIVICAMP for research, analysis, and development.
            </p>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About Open Data Initiative</CardTitle>
                <CardDescription>
                  Our commitment to transparency and open governance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  CIVICAMP is committed to transparency and citizen engagement. Our Open Data initiative makes government data accessible to everyone, fostering innovation, research, and accountability.
                </p>
                <p className="text-gray-700 mb-4">
                  All datasets are provided under the Open Government License, allowing free use, modification, and sharing for both commercial and non-commercial purposes with appropriate attribution.
                </p>
              </CardContent>
            </Card>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Datasets</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <Database className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Civic Issues</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Comprehensive data on reported issues, statuses, and resolutions across regions
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Files className="h-4 w-4 mr-1" />
                          CSV
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          JSON
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <LineChart className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Budget Allocations</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Detailed breakdown of government spending and budget allocations by category
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Files className="h-4 w-4 mr-1" />
                          CSV
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          JSON
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <Database className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Resolution Timelines</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Statistical data on issue resolution times and government response rates
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Files className="h-4 w-4 mr-1" />
                          CSV
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          JSON
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-3 rounded-full mr-4">
                      <Database className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Parliamentary Records</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Lok Sabha and Rajya Sabha speeches, bills, and voting records
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Files className="h-4 w-4 mr-1" />
                          CSV
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          JSON
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>
                  Programmatic access to CIVICAMP data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Developers can access all CIVICAMP data through our RESTful API. Authentication is required for write operations, but all read operations are publicly accessible.
                </p>
                <Button className="mt-2">
                  View API Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}