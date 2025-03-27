import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Footer } from "@/components/layout/Footer";
import { useBudgetData } from "@/hooks/useBudgetData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function Budget() {
  const [filters, setFilters] = useState({
    fiscalYear: "all",
    category: "all",
  });
  
  const { data: budgets, isLoading } = useBudgetData();
  
  // Filter budgets
  const filteredBudgets = budgets?.filter(budget => {
    let matches = true;
    
    if (filters.fiscalYear && filters.fiscalYear !== "all" && budget.fiscalYear !== filters.fiscalYear) {
      matches = false;
    }
    
    if (filters.category && filters.category !== "all" && budget.category !== filters.category) {
      matches = false;
    }
    
    return matches;
  });
  
  // Calculate totals
  const totalAllocated = filteredBudgets?.reduce((sum, budget) => sum + budget.amount, 0) || 0;
  
  // Group by category
  const budgetByCategory = filteredBudgets?.reduce((acc, budget) => {
    const category = budget.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += budget.amount;
    return acc;
  }, {} as Record<string, number>) || {};
  
  // Group by status
  const budgetByStatus = filteredBudgets?.reduce((acc, budget) => {
    const status = budget.status;
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status] += budget.amount;
    return acc;
  }, {} as Record<string, number>) || {};
  
  // Get unique fiscal years for filter
  const fiscalYears = budgets
    ? Array.from(new Set(budgets.map(budget => budget.fiscalYear)))
    : [];
  
  // Get unique categories for filter
  const categories = budgets
    ? Array.from(new Set(budgets.map(budget => budget.category)))
    : [];
  
  // Helper function to get category color
  const getCategoryColor = (category: string): string => {
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
                Public Budget Data
              </CardTitle>
              <CardDescription>
                Transparent information about how public funds are allocated and spent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select 
                    value={filters.fiscalYear} 
                    onValueChange={(value) => setFilters({ ...filters, fiscalYear: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fiscal year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fiscal Years</SelectItem>
                      {fiscalYears.map(year => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select 
                    value={filters.category} 
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Total Budget Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-12 w-3/4" />
                ) : (
                  <div className="text-3xl font-bold text-gray-800">
                    {formatCurrency(totalAllocated)}
                  </div>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  Total allocated budget for {filters.fiscalYear || "all years"}
                </p>
              </CardContent>
            </Card>
            
            {/* Allocation by Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Allocation by Status</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : Object.keys(budgetByStatus).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(budgetByStatus).map(([status, amount]) => (
                      <div key={status}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium capitalize">{status.replace("_", " ")}</span>
                          <span className="text-sm font-medium">
                            {formatCurrency(amount)}
                          </span>
                        </div>
                        <Progress
                          value={(amount / totalAllocated) * 100}
                          className="h-2 bg-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No budget data available</p>
                )}
              </CardContent>
            </Card>
            
            {/* Fiscal Year Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Fiscal Information</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Fiscal Year:</span>
                      <span className="text-sm font-medium">
                        {filters.fiscalYear || fiscalYears[0] || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Budget Categories:</span>
                      <span className="text-sm font-medium">
                        {Object.keys(budgetByCategory).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Updated:</span>
                      <span className="text-sm font-medium">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="chart">
            <TabsList className="mb-6">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Budget Allocation by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-80 flex items-center justify-center">
                      <Skeleton className="h-60 w-full" />
                    </div>
                  ) : Object.keys(budgetByCategory).length > 0 ? (
                    <div className="h-80 overflow-y-auto px-6">
                      <div className="space-y-6">
                        {Object.entries(budgetByCategory)
                          .sort(([, a], [, b]) => b - a)
                          .map(([category, amount]) => (
                            <div key={category}>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">{category}</span>
                                <span className="text-sm font-medium">
                                  {formatCurrency(amount)} ({((amount / totalAllocated) * 100).toFixed(1)}%)
                                </span>
                              </div>
                              <Progress
                                value={(amount / totalAllocated) * 100}
                                className={`h-4 bg-gray-200 ${getCategoryColor(category)}`}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-60 flex items-center justify-center">
                      <p className="text-gray-500">No budget data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Budget Allocations</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  ) : filteredBudgets && filteredBudgets.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Title</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Category</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Amount</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Fiscal Year</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBudgets.map(budget => (
                            <tr key={budget.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">{budget.title}</td>
                              <td className="py-3 px-4">{budget.category}</td>
                              <td className="py-3 px-4">{formatCurrency(budget.amount)}</td>
                              <td className="py-3 px-4">{budget.fiscalYear}</td>
                              <td className="py-3 px-4 capitalize">{budget.status.replace("_", " ")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No budget entries match your filters</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
