import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueCard } from "@/components/issues/IssueCard";
import { Button } from "@/components/ui/button";
import { useIssues } from "@/hooks/useIssues";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useLocation } from "wouter";

export function RecentIssues() {
  const { data: issues, isLoading } = useIssues();
  const [showCount, setShowCount] = useState(6); // Increased the initial count to 6 since we have more width
  const [, navigate] = useLocation();
  
  // Sort issues by recency 
  const sortedIssues = issues?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Display only the most recent issues based on showCount
  const recentIssues = sortedIssues?.slice(0, showCount);
  
  const loadMore = () => {
    setShowCount(prev => prev + 6); // Increased to load 6 at a time
  };

  return (
    <Card>
      <CardHeader className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <CardTitle className="text-lg font-medium font-poppins text-gray-800">Recent Issues</CardTitle>
          <p className="text-gray-600 text-sm">Latest reported issues in your area</p>
        </div>
        <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium" onClick={() => navigate("/issues")}>
          View All
        </Button>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            // Loading placeholders
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start">
                  <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="ml-3 flex-1">
                    <Skeleton className="h-5 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-1" />
                    <div className="flex justify-between mt-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : recentIssues && recentIssues.length > 0 ? (
            recentIssues.map(issue => (
              <div key={issue.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <IssueCard issue={issue} />
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 col-span-full">
              No issues reported yet. Be the first to report an issue!
            </div>
          )}
        </div>
        
        {issues && issues.length > showCount && (
          <div className="p-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition text-sm font-medium"
              onClick={loadMore}
            >
              Load More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
