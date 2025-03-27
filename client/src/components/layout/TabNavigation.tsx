import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  AlertTriangle, 
  List, 
  PieChart, 
  UserCheck, 
  Building 
} from "lucide-react";

interface NavigationTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export function TabNavigation() {
  const [location] = useLocation();

  const navigationTabs: NavigationTab[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home size={18} />,
      path: "/",
    },
    {
      id: "report-issue",
      label: "Report Issue",
      icon: <AlertTriangle size={18} />,
      path: "/report-issue",
    },
    {
      id: "issues",
      label: "Issues",
      icon: <List size={18} />,
      path: "/issues",
    },
    {
      id: "budget",
      label: "Public Funds",
      icon: <PieChart size={18} />,
      path: "/budget",
    },
    {
      id: "representatives",
      label: "Representatives",
      icon: <UserCheck size={18} />,
      path: "/representatives",
    },
    {
      id: "parliamentary",
      label: "Parliament Updates",
      icon: <Building size={18} />,
      path: "/parliamentary",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="container mx-auto">
        <nav className="flex overflow-x-auto py-1 px-4 scrollbar-hide">
          {navigationTabs.map((tab) => (
            <a 
              key={tab.id}
              href={tab.path}
              className={cn(
                "flex items-center px-4 py-2 mx-1 whitespace-nowrap",
                isActive(tab.path)
                  ? "text-primary border-b-2 border-primary font-medium"
                  : "text-gray-600 hover:text-primary"
              )}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
