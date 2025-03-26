import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBudgetData } from "@/hooks/useBudgetData";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { useLocation } from "wouter";

export function BudgetOverview() {
  const { data: budgets, isLoading } = useBudgetData();
  const [, navigate] = useLocation();
  
  // Process budget data
  const totalBudget = budgets?.reduce((sum, budget) => sum + budget.amount, 0) || 0;
  
  // Group budgets by category and calculate percentage
  const budgetByCategory = budgets?.reduce((acc, budget) => {
    const category = budget.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += budget.amount;
    return acc;
  }, {} as Record<string, number>) || {};
  
  // Sort categories by amount (descending)
  const sortedCategories = Object.entries(budgetByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4); // Show top 4 categories

  return (
    <Card>
      <CardHeader className="p-4 border-b border-gray-200">
        <CardTitle className="text-lg font-medium font-poppins text-gray-800">
          Budget Allocation
        </CardTitle>
        <p className="text-gray-600 text-sm">Recent public funds allocation</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64 flex items-center justify-center">
          {isLoading ? (
            // Skeleton for loading state
            <div className="w-full px-6 space-y-4">
              {Array(4).fill(0).map((_, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : sortedCategories.length > 0 ? (
            <div className="w-full px-6">
              <div className="space-y-4">
                {sortedCategories.map(([category, amount]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <Progress 
                      value={(amount / totalBudget) * 100} 
                      className="h-4 bg-gray-200" 
                      indicatorClassName={getCategoryColor(category)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No budget data available
            </div>
          )}
        </div>
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate("/budget")}
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            View Complete Budget Details
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get color based on category
function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'infrastructure':
      return 'bg-primary';
    case 'healthcare':
      return 'bg-secondary';
    case 'education':
      return 'bg-info';
    case 'water & sanitation':
      return 'bg-accent';
    default:
      return 'bg-gray-500';
  }
}
