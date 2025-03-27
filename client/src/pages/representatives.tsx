import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Footer } from "@/components/layout/Footer";
import { useRepresentatives } from "@/hooks/useRepresentatives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Representatives() {
  const [filters, setFilters] = useState({
    position: "all",
    party: "all",
    search: "",
  });
  
  const { data: representatives, isLoading } = useRepresentatives();
  
  // Filter representatives
  const filteredRepresentatives = representatives?.filter(rep => {
    let matches = true;
    
    if (filters.position && filters.position !== "all" && rep.position !== filters.position) {
      matches = false;
    }
    
    if (filters.party && filters.party !== "all" && rep.party !== filters.party) {
      matches = false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const nameMatches = rep.name.toLowerCase().includes(searchLower);
      const positionMatches = rep.position.toLowerCase().includes(searchLower);
      const partyMatches = rep.party?.toLowerCase().includes(searchLower) || false;
      
      if (!nameMatches && !positionMatches && !partyMatches) {
        matches = false;
      }
    }
    
    return matches;
  });
  
  // Get unique positions and parties for filters
  const positions = representatives 
    ? Array.from(new Set(representatives.map(rep => rep.position)))
    : [];
  
  const parties = representatives 
    ? Array.from(new Set(representatives.map(rep => rep.party).filter(Boolean) as string[]))
    : [];
  
  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MobileNav />
      <TabNavigation />
      
      <main className="flex-1 py-6 px-4 bg-gray-50">
        <div className="container mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-gray-800">
                Your Representatives
              </CardTitle>
              <CardDescription>
                Elected officials and authorities representing your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Search representatives..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
                
                <div>
                  <Select 
                    value={filters.position} 
                    onValueChange={(value) => setFilters({ ...filters, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      {positions.map(position => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select 
                    value={filters.party} 
                    onValueChange={(value) => setFilters({ ...filters, party: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by party" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Parties</SelectItem>
                      {parties.map(party => (
                        <SelectItem key={party} value={party}>
                          {party}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array(6).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredRepresentatives && filteredRepresentatives.length > 0 ? (
              // Representative cards
              filteredRepresentatives.map(rep => (
                <Card key={rep.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={rep.avatarUrl || undefined} alt={rep.name} />
                        <AvatarFallback className="bg-primary text-white text-lg">
                          {getInitials(rep.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-lg text-gray-800">{rep.name}</h3>
                        <p className="text-gray-600">{rep.position}</p>
                        {rep.party && (
                          <Badge variant="outline" className="mt-1">
                            {rep.party}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {rep.bio && (
                      <p className="mt-4 text-sm text-gray-600">
                        {rep.bio}
                      </p>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-sm">
                      {rep.contactEmail && (
                        <div>
                          <p className="text-gray-500">Email</p>
                          <a href={`mailto:${rep.contactEmail}`} className="text-primary hover:underline">
                            {rep.contactEmail}
                          </a>
                        </div>
                      )}
                      
                      {rep.contactPhone && (
                        <div>
                          <p className="text-gray-500">Phone</p>
                          <a href={`tel:${rep.contactPhone}`} className="text-primary hover:underline">
                            {rep.contactPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium text-gray-800">No representatives found</h3>
                <p className="text-gray-600 mt-2">
                  Try adjusting your filters or select a different location.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
