import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Footer } from "@/components/layout/Footer";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueMap } from "@/components/dashboard/IssueMap";
import { useIssues } from "@/hooks/useIssues";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Issues() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const [viewType, setViewType] = useState<string>("list");
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    priority: "all",
    search: "",
  });

  // Parse URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (params.has("view") && params.get("view") === "map") {
      setViewType("map");
    }
    
    setFilters({
      status: params.get("status") || "all",
      type: params.get("type") || "all",
      priority: params.get("priority") || "all",
      search: params.get("search") || "",
    });
  }, [searchParams]);

  // Fetch issues with filters
  const { data: issues, isLoading } = useIssues();

  // Apply filters to issues
  const filteredIssues = issues?.filter(issue => {
    let matches = true;
    
    if (filters.status && filters.status !== "all" && issue.status !== filters.status) {
      matches = false;
    }
    
    if (filters.type && filters.type !== "all" && issue.type !== filters.type) {
      matches = false;
    }
    
    if (filters.priority && filters.priority !== "all" && issue.priority !== filters.priority) {
      matches = false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatches = issue.title.toLowerCase().includes(searchLower);
      const descMatches = issue.description.toLowerCase().includes(searchLower);
      const addressMatches = issue.address.toLowerCase().includes(searchLower);
      
      if (!titleMatches && !descMatches && !addressMatches) {
        matches = false;
      }
    }
    
    return matches;
  });

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    if (viewType === "map") params.append("view", "map");
    if (newFilters.status && newFilters.status !== "all") params.append("status", newFilters.status);
    if (newFilters.type && newFilters.type !== "all") params.append("type", newFilters.type);
    if (newFilters.priority && newFilters.priority !== "all") params.append("priority", newFilters.priority);
    if (newFilters.search) params.append("search", newFilters.search);
    
    setLocation(`/issues?${params.toString()}`);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange("search", filters.search);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MobileNav />
      <TabNavigation />
      
      <main className="flex-1 py-6 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl font-poppins font-semibold text-gray-800">Issues</h1>
                  <p className="text-gray-600 text-sm">Browse and track issues in your area</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <Tabs defaultValue={viewType} onValueChange={value => {
                    setViewType(value);
                    const params = new URLSearchParams(searchParams);
                    if (value === "map") {
                      params.set("view", "map");
                    } else {
                      params.delete("view");
                    }
                    setLocation(`/issues?${params.toString()}`);
                  }}>
                    <TabsList>
                      <TabsTrigger value="list">List View</TabsTrigger>
                      <TabsTrigger value="map">Map View</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search issues..."
                        className="w-full pl-10"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      />
                      <button
                        type="submit"
                        className="absolute left-3 top-2.5 text-gray-400"
                        aria-label="Search"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
                
                <div>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => handleFilterChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select 
                    value={filters.type} 
                    onValueChange={(value) => handleFilterChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="roads">Roads & Infrastructure</SelectItem>
                      <SelectItem value="water">Water Supply</SelectItem>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="sanitation">Sanitation & Waste</SelectItem>
                      <SelectItem value="public">Public Spaces</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs value={viewType} className="space-y-4">
            <TabsContent value="list" className="space-y-4">
              {isLoading ? (
                // Loading skeleton
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="p-4">
                          <div className="flex items-start">
                            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between items-start">
                                <Skeleton className="h-5 w-2/3 mb-2" />
                                <Skeleton className="h-5 w-16" />
                              </div>
                              <Skeleton className="h-4 w-full mb-2" />
                              <Skeleton className="h-4 w-3/4 mb-2" />
                              <div className="flex justify-between mt-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-1/4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : filteredIssues && filteredIssues.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200">
                      {filteredIssues.map(issue => (
                        <IssueCard key={issue.id} issue={issue} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Issues Found</CardTitle>
                    <CardDescription>
                      No issues match your current filters. Try adjusting your filters or reporting a new issue.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-6">
                    <Button onClick={() => setLocation("/report-issue")}>
                      Report an Issue
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="map">
              <IssueMap />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
