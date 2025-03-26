import { useState } from "react";
import { Issue } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface IssueCardProps {
  issue: Issue;
}

export function IssueCard({ issue }: IssueCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "resolved":
        return {
          bg: "bg-green-100",
          text: "text-success",
          label: "Resolved"
        };
      case "in_progress":
        return {
          bg: "bg-amber-100",
          text: "text-warning",
          label: "In Progress"
        };
      case "pending":
      default:
        return {
          bg: "bg-red-100",
          text: "text-error",
          label: "Pending"
        };
    }
  };

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case "roads":
        return "ri-road-map-line";
      case "water":
        return "ri-water-flash-line";
      case "electricity":
        return "ri-flashlight-line";
      case "sanitation":
        return "ri-recycle-line";
      case "public":
        return "ri-community-line";
      default:
        return "ri-error-warning-line";
    }
  };

  const upvoteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/issues/${issue.id}/vote`, { vote: true });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/issues"] });
      toast({
        title: "Upvoted",
        description: "Your vote has been registered",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "You've already voted on this issue",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateStr: string) => {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  };

  const statusStyle = getStatusStyle(issue.status);
  const issueLocation = issue.location as any;
  const address = issueLocation.address || issue.address || `${issueLocation.city}, ${issueLocation.state}`;

  return (
    <div className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start">
        <span className={`w-10 h-10 rounded-full flex items-center justify-center text-${statusStyle.text.split('-')[1]} ${statusStyle.bg} flex-shrink-0`}>
          <i className={`${getIssueTypeIcon(issue.type)} text-lg`}></i>
        </span>
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-800">{issue.title}</h3>
            <span className={`${statusStyle.bg} ${statusStyle.text} text-xs px-2 py-1 rounded`}>
              {statusStyle.label}
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            {expanded 
              ? issue.description 
              : `${issue.description.substring(0, 100)}${issue.description.length > 100 ? '...' : ''}`
            }
          </p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-gray-500 flex items-center">
              <i className="ri-map-pin-line mr-1"></i> {address}
            </span>
            <span className="text-xs text-gray-500">{formatDate(issue.createdAt)}</span>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button 
                className="text-gray-500 hover:text-primary text-sm flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  if (user) {
                    upvoteMutation.mutate();
                  } else {
                    toast({
                      title: "Authentication Required",
                      description: "Please log in to vote on issues",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={upvoteMutation.isPending}
              >
                <i className="ri-thumb-up-line mr-1"></i> {issue.upvotes}
              </button>
              <button 
                className="text-gray-500 hover:text-primary text-sm flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="ri-chat-1-line mr-1"></i> {issue.comments}
              </button>
            </div>
            <button 
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded transition"
              onClick={(e) => {
                e.stopPropagation();
                toast({
                  title: "Following Issue",
                  description: "You will receive updates about this issue",
                });
              }}
            >
              Follow
            </button>
          </div>
          
          {/* Show media attachments if expanded */}
          {expanded && issue.media && issue.media.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {issue.media.map((url, index) => (
                <div key={index} className="w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                  {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                    <img src={url} alt={`Attachment ${index + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500">
                      <i className="ri-file-line text-2xl"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
