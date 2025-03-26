import { useQuery } from "@tanstack/react-query";
import { Budget } from "@shared/schema";

interface BudgetFilters {
  category?: string;
  fiscalYear?: string;
  status?: string;
  locationId?: number;
}

export function useBudgetData(filters?: BudgetFilters) {
  // Construct query string from filters
  const queryString = filters
    ? Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join("&")
    : "";

  // Fetch budget data
  const { data, isLoading, error } = useQuery<Budget[]>({
    queryKey: [`/api/budgets${queryString ? `?${queryString}` : ""}`],
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    error,
  };
}
