import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Footer } from "@/components/layout/Footer";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentIssues } from "@/components/dashboard/RecentIssues";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { RepresentativesList } from "@/components/dashboard/RepresentativesList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Location } from "@shared/schema";

export default function Home() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // Fetch locations
  const { data: locations } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  // Handle location change
  const handleLocationChange = async (locationId: string) => {
    setSelectedLocation(locationId);
    try {
      await fetch("/api/set-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId }),
        credentials: "include",
      });
    } catch (error) {
      console.error("Failed to set location:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MobileNav />
      <TabNavigation />

      <main className="flex-1">
        <div id="dashboard" className="py-6 px-4">
          <div className="container mx-auto">
            {/* Location Selector */}
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-1">
                  <h2 className="text-lg font-medium font-poppins text-gray-800">Your Location</h2>
                  <p className="text-gray-600 text-sm">View and report issues in your area</p>
                </div>
                <div className="mt-3 md:mt-0 w-full md:w-auto">
                  <div className="flex items-center space-x-2">
                    <Select value={selectedLocation} onValueChange={handleLocationChange}>
                      <SelectTrigger className="bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-gray-700 w-full md:w-56">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations?.map((location) => (
                          <SelectItem key={location.id} value={location.id.toString()}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition flex items-center"
                      onClick={() => navigate("/issues?view=map")}
                    >
                      <i className="ri-map-pin-line mr-2"></i>
                      <span>Map</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Dashboard Stats */}
            <DashboardStats />

            {/* Recent Issues */}
            <div className="mb-6">
              <RecentIssues />
            </div>

            {/* Budget and Representatives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <BudgetOverview />
              <RepresentativesList />
            </div>
          </div>
        </div>
      </main>

      {/* Quick Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="w-14 h-14 bg-accent hover:bg-accent-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105"
          onClick={() => {
            if (isAuthenticated) {
              navigate("/report-issue");
            } else {
              navigate("/login");
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </Button>
      </div>

      <Footer />
    </div>
  );
}
