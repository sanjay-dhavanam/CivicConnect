import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIssues } from "@/hooks/useIssues";
import { getGoogleMaps } from "@/lib/maps";

interface MapMarker {
  id: number;
  type: string;
  title: string;
  status: string;
  position: google.maps.LatLngLiteral;
  map?: google.maps.Map;
  infoWindow?: google.maps.InfoWindow;
}

export function IssueMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const { data: issues, isLoading } = useIssues();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        const google = await getGoogleMaps();
        
        // Default center (India)
        const center = { lat: 20.5937, lng: 78.9629 };
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom: 5,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: false,
        });

        setMap(mapInstance);
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initMap();
  }, []);

  // Add markers when issues data is loaded and map is ready
  useEffect(() => {
    if (!map || !issues || issues.length === 0) return;

    const addMarkers = async () => {
      const google = await getGoogleMaps();
      
      // Clear existing markers
      markers.forEach(marker => {
        if (marker.map) {
          // @ts-ignore - Google Maps types issue
          marker.setMap(null);
        }
      });

      // Create new markers
      const newMarkers: MapMarker[] = issues.map(issue => {
        // Extract location coordinates
        const location = issue.location as any;
        const position = {
          lat: location.lat || 0,
          lng: location.lng || 0
        };

        // Create marker
        const marker = new google.maps.Marker({
          position,
          map,
          title: issue.title,
          // Set icon based on status
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: getStatusColor(issue.status),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        // Create info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-medium">${issue.title}</h3>
              <p class="text-sm">${issue.description.substring(0, 100)}${issue.description.length > 100 ? '...' : ''}</p>
              <p class="text-xs mt-1">Status: ${formatStatus(issue.status)}</p>
              <a href="/issues/${issue.id}" class="text-xs text-blue-600 hover:underline">View Details</a>
            </div>
          `,
        });

        // Add click listener
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        return {
          id: issue.id,
          type: issue.type,
          title: issue.title,
          status: issue.status,
          position,
          map,
          infoWindow,
        };
      });

      setMarkers(newMarkers);
    };

    addMarkers();
  }, [map, issues]);

  // Helper function to get color based on status
  function getStatusColor(status: string): string {
    switch (status) {
      case 'resolved':
        return '#10b981'; // success/green
      case 'in_progress':
        return '#fbbf24'; // warning/yellow
      case 'pending':
      default:
        return '#ef4444'; // error/red
    }
  }

  // Helper function to format status
  function formatStatus(status: string): string {
    switch (status) {
      case 'resolved':
        return 'Resolved';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
      default:
        return 'Pending';
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 border-b border-gray-200">
        <CardTitle className="text-lg font-medium font-poppins text-gray-800">Issues Map</CardTitle>
        <p className="text-gray-600 text-sm">View issues by location</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96 relative">
          {isLoading ? (
            <div className="h-full w-full bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-gray-400">Loading map...</span>
            </div>
          ) : (
            <div ref={mapRef} className="h-full w-full" />
          )}
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
            <button onClick={() => map?.setZoom((map.getZoom() || 0) + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
            <button onClick={() => map?.setZoom((map.getZoom() || 0) - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
            <button onClick={() => {
              // Get user location
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  position => {
                    const userLocation = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                    };
                    map?.setCenter(userLocation);
                    map?.setZoom(14);
                  },
                  error => console.error("Error getting location:", error)
                );
              }
            }} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </button>
          </div>
          
          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-2">
            <div className="flex items-center space-x-2 text-sm px-2">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span> Pending
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></span> In Progress
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span> Resolved
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
