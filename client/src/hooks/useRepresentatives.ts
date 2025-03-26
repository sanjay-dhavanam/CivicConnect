import { useQuery } from "@tanstack/react-query";
import { Representative } from "@shared/schema";

interface RepresentativeFilters {
  position?: string;
  party?: string;
  locationId?: number;
}

export function useRepresentatives(filters?: RepresentativeFilters) {
  // Construct query string from filters
  const queryString = filters
    ? Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join("&")
    : "";

  // Fetch representatives
  const { data, isLoading, error } = useQuery<Representative[]>({
    queryKey: [`/api/representatives${queryString ? `?${queryString}` : ""}`],
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    error,
  };
}
