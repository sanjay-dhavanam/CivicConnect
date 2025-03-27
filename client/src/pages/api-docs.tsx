import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from "@/components/ui/code";
import { Button } from "@/components/ui/button";
import { Code as CodeIcon, Database, Users, AlertCircle } from "lucide-react";

export default function ApiDocs() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TabNavigation />
      
      <main className="flex-1 bg-gray-50 p-4">
        <div className="container mx-auto py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-2">
              <CodeIcon className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
            </div>
            <p className="text-gray-600 mb-8">
              Programmatic access to the CIVICAMP platform data and services
            </p>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Basic information to get started with the CIVICAMP API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  The CIVICAMP API allows developers to access and integrate the data and functionality of CIVICAMP into their own applications. Public data is available without authentication, while write operations and access to sensitive data require API keys.
                </p>
                <div className="bg-gray-100 p-4 rounded-md mb-4">
                  <p className="font-mono text-sm">Base URL: <span className="text-blue-600">https://api.civicamp.gov.in/v1</span></p>
                </div>
                <div className="flex items-center px-4 py-3 bg-amber-50 text-amber-800 rounded-md mb-4">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">All API requests must use HTTPS. HTTP requests will be redirected.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Authentication</h3>
                    <p className="text-gray-700 mb-2">
                      Authenticate your API requests by including your API key in the request headers:
                    </p>
                    <Code language="bash">
                      curl -H "Authorization: Bearer YOUR_API_KEY" https://api.civicamp.gov.in/v1/issues
                    </Code>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Rate Limiting</h3>
                    <p className="text-gray-700">
                      API requests are limited to 100 requests per minute. If you exceed this limit, you'll receive a 429 status code response.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="issues" className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="budgets">Budgets</TabsTrigger>
                <TabsTrigger value="representatives">Representatives</TabsTrigger>
              </TabsList>
              
              <TabsContent value="issues">
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                      <CardTitle>Issues API</CardTitle>
                    </div>
                    <CardDescription>
                      Access and manage civic issues reported by citizens
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">GET</span>
                          List Issues
                        </h3>
                        <p className="text-gray-700 mb-2">
                          Retrieve a list of issues, with optional filtering parameters.
                        </p>
                        <Code language="http">
                          GET /issues?status=pending&type=infrastructure&location=123
                        </Code>
                        <div className="mt-3">
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">Parameters:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                            <li><span className="font-mono text-xs">status</span> - Filter by issue status (pending, in-progress, resolved)</li>
                            <li><span className="font-mono text-xs">type</span> - Filter by issue type</li>
                            <li><span className="font-mono text-xs">location</span> - Filter by location ID</li>
                            <li><span className="font-mono text-xs">page</span> - Page number for pagination</li>
                            <li><span className="font-mono text-xs">limit</span> - Number of items per page (max 100)</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">GET</span>
                          Get Issue Details
                        </h3>
                        <p className="text-gray-700 mb-2">
                          Retrieve detailed information about a specific issue.
                        </p>
                        <Code language="http">
                          GET /issues/{"{issueId}"}
                        </Code>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mr-2">POST</span>
                          Report New Issue
                        </h3>
                        <p className="text-gray-700 mb-2">
                          Report a new civic issue. Requires authentication.
                        </p>
                        <Code language="json">
{`POST /issues
Content-Type: application/json

{
  "title": "Broken Street Light",
  "type": "infrastructure",
  "description": "Street light not working for past 3 days",
  "address": "123 Main Street",
  "location": {
    "lat": 28.6129,
    "lng": 77.2295
  },
  "media": ["https://example.com/image1.jpg"]
}`}
                        </Code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users">
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-500 mr-2" />
                      <CardTitle>Users API</CardTitle>
                    </div>
                    <CardDescription>
                      User management and authentication endpoints
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mr-2">POST</span>
                          User Registration
                        </h3>
                        <p className="text-gray-700 mb-2">
                          Register a new user account.
                        </p>
                        <Code language="json">
{`POST /users/register
Content-Type: application/json

{
  "fullName": "Rahul Kumar",
  "username": "rahul123",
  "phone": "+91123456789",
  "password": "secure_password",
  "email": "rahul@example.com",
  "aadhaarNumber": "123456789012"
}`}
                        </Code>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mr-2">POST</span>
                          User Authentication
                        </h3>
                        <p className="text-gray-700 mb-2">
                          Authenticate a user and receive an access token.
                        </p>
                        <Code language="json">
{`POST /users/login
Content-Type: application/json

{
  "username": "rahul123",
  "password": "secure_password"
}`}
                        </Code>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">GET</span>
                          Get Current User
                        </h3>
                        <p className="text-gray-700 mb-2">
                          Retrieve the currently authenticated user's profile. Requires authentication.
                        </p>
                        <Code language="http">
                          GET /users/me
                        </Code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="budgets">
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 text-green-500 mr-2" />
                      <CardTitle>Budgets API</CardTitle>
                    </div>
                    <CardDescription>
                      Access government budget and spending data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">GET</span>
                          List Budget Entries
                        </h3>
                        <p className="text-gray-700 mb-2">
                          Retrieve a list of budget allocations and spending data.
                        </p>
                        <Code language="http">
                          GET /budgets?category=infrastructure&fiscalYear=2023-24
                        </Code>
                        <div className="mt-3">
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">Parameters:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                            <li><span className="font-mono text-xs">category</span> - Filter by budget category</li>
                            <li><span className="font-mono text-xs">fiscalYear</span> - Filter by fiscal year</li>
                            <li><span className="font-mono text-xs">location</span> - Filter by location ID</li>
                            <li><span className="font-mono text-xs">status</span> - Filter by status (proposed, approved, implemented)</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">GET</span>
                          Get Budget Details
                        </h3>
                        <p className="text-gray-700 mb-2">
                          Retrieve detailed information about a specific budget entry.
                        </p>
                        <Code language="http">
                          GET /budgets/{"{budgetId}"}
                        </Code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="representatives">
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-purple-500 mr-2" />
                      <CardTitle>Representatives API</CardTitle>
                    </div>
                    <CardDescription>
                      Access information about government representatives
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">GET</span>
                          List Representatives
                        </h3>
                        <p className="text-gray-700 mb-2">
                          Retrieve a list of government representatives.
                        </p>
                        <Code language="http">
                          GET /representatives?position=MLA&location=123
                        </Code>
                        <div className="mt-3">
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">Parameters:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                            <li><span className="font-mono text-xs">position</span> - Filter by position (MP, MLA, etc.)</li>
                            <li><span className="font-mono text-xs">party</span> - Filter by political party</li>
                            <li><span className="font-mono text-xs">location</span> - Filter by location ID</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">GET</span>
                          Get Representative Details
                        </h3>
                        <p className="text-gray-700 mb-2">
                          Retrieve detailed information about a specific representative.
                        </p>
                        <Code language="http">
                          GET /representatives/{"{representativeId}"}
                        </Code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Card>
              <CardHeader>
                <CardTitle>API Key Registration</CardTitle>
                <CardDescription>
                  Get access to the CIVICAMP API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  To get started with the CIVICAMP API, you'll need to register for an API key. Government agencies, researchers, and developers can apply for API access.
                </p>
                <Button className="mt-2">
                  Apply for API Access
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