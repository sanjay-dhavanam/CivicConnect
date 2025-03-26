import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRepresentatives } from "@/hooks/useRepresentatives";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export function RepresentativesList() {
  const { data: representatives, isLoading } = useRepresentatives();
  const [, navigate] = useLocation();
  
  // Limit to first 3 representatives
  const displayedRepresentatives = representatives?.slice(0, 3);

  return (
    <Card>
      <CardHeader className="p-4 border-b border-gray-200">
        <CardTitle className="text-lg font-medium font-poppins text-gray-800">
          Your Representatives
        </CardTitle>
        <p className="text-gray-600 text-sm">Elected officials representing your area</p>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {isLoading ? (
          // Loading placeholders
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="flex items-center p-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="ml-auto">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))
        ) : displayedRepresentatives && displayedRepresentatives.length > 0 ? (
          displayedRepresentatives.map(rep => (
            <div key={rep.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition" onClick={() => navigate(`/representatives/${rep.id}`)}>
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                {rep.avatarUrl ? (
                  <img 
                    src={rep.avatarUrl} 
                    alt={rep.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-lg font-medium">
                    {rep.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-800">{rep.name}</h3>
                <p className="text-gray-600 text-sm">{rep.position}</p>
              </div>
              <div className="ml-auto">
                <button className="text-primary hover:text-primary-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No representatives information available
          </div>
        )}
        
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate("/representatives")}
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            View All Representatives
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
