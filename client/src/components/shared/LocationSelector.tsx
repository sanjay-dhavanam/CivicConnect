import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getGoogleMaps } from "@/lib/maps";

interface Location {
  id: number;
  name: string;
  state: string;
  type: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

export function LocationSelector({ onLocationSelect }: LocationSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // Fetch available locations
  const { data: locations } = useQuery<Location[]>({ 
    queryKey: ["/api/locations"]
  });

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
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        // Allow clicking on map to set location
        mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
          const position = e.latLng?.toJSON();
          if (position) {
            updateMarkerPosition(position, mapInstance, google);
            onLocationSelect(position);
          }
        });

        setMap(mapInstance);
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initMap();
  }, [onLocationSelect]);

  // Update marker position
  const updateMarkerPosition = (
    position: { lat: number; lng: number },
    mapInstance: google.maps.Map,
    google: any
  ) => {
    // Remove existing marker
    if (marker) marker.setMap(null);

    // Create new marker
    const newMarker = new google.maps.Marker({
      position,
      map: mapInstance,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });

    // Handle marker drag end
    newMarker.addListener("dragend", () => {
      const newPosition = newMarker.getPosition()?.toJSON();
      if (newPosition) {
        onLocationSelect(newPosition);
      }
    });

    setMarker(newMarker);
    mapInstance.panTo(position);
  };

  // Handle location selection from dropdown
  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
    const location = locations?.find(loc => loc.id.toString() === locationId);
    
    if (location && map) {
      const position = location.coordinates;
      const google = window.google;
      updateMarkerPosition(position, map, google);
      onLocationSelect(position);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <Select value={selectedLocation} onValueChange={handleLocationChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {locations?.map(location => (
              <SelectItem key={location.id} value={location.id.toString()}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div ref={mapRef} className="h-64 w-full relative">
        {!map && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Loading map...</p>
          </div>
        )}
      </div>
      <div className="p-3 bg-gray-50 text-xs text-gray-600">
        Click on the map to select a specific location or use the dropdown above.
      </div>
    </Card>
  );
}
