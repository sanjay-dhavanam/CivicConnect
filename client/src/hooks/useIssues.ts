import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Issue } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

interface IssueFilters {
  status?: string;
  type?: string;
  priority?: string;
  locationId?: number;
  search?: string;
}

export function useIssues(filters?: IssueFilters) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useLocation();
  const [queryFilters, setQueryFilters] = useState<Record<string, string>>({});

  // Extract search params
  useEffect(() => {
    if (!searchParams) return;
    
    const params = new URLSearchParams(searchParams);
    const extractedFilters: Record<string, string> = {};
    
    if (params.has("search")) extractedFilters.search = params.get("search")!;
    if (params.has("status")) extractedFilters.status = params.get("status")!;
    if (params.has("type")) extractedFilters.type = params.get("type")!;
    if (params.has("priority")) extractedFilters.priority = params.get("priority")!;
    if (params.has("locationId")) extractedFilters.locationId = params.get("locationId")!;
    
    setQueryFilters(extractedFilters);
  }, [searchParams]);

  // Combine manual filters with URL filters
  const combinedFilters = { ...queryFilters, ...filters };
  
  // Construct query string
  const queryString = Object.entries(combinedFilters)
    .filter(([_, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
    .join("&");

  // Fetch issues
  const { data, isLoading, error, refetch } = useQuery<Issue[]>({
    queryKey: [`/api/issues${queryString ? `?${queryString}` : ""}`],
    refetchOnWindowFocus: false,
  });

  // Update issue mutation
  const updateIssueMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/issues/${id}/status`, { status });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Issue updated",
        description: `Issue status updated to ${data.status}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/issues"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update issue",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Vote on issue mutation
  const voteOnIssueMutation = useMutation({
    mutationFn: async ({ id, vote }: { id: number; vote: boolean }) => {
      const res = await apiRequest("POST", `/api/issues/${id}/vote`, { vote });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Vote recorded",
        description: "Your vote has been recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/issues"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to vote",
        description: error.message || "You may have already voted on this issue",
        variant: "destructive",
      });
    },
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    updateIssue: updateIssueMutation.mutate,
    voteOnIssue: voteOnIssueMutation.mutate,
  };
}
