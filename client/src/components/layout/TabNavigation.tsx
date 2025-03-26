import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface NavigationTab {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export function TabNavigation() {
  const [location] = useLocation();

  const navigationTabs: NavigationTab[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-line",
      path: "/",
    },
    {
      id: "report-issue",
      label: "Report Issue",
      icon: "ri-error-warning-line",
      path: "/report-issue",
    },
    {
      id: "issues",
      label: "Issues",
      icon: "ri-list-check-2",
      path: "/issues",
    },
    {
      id: "budget",
      label: "Public Funds",
      icon: "ri-funds-line",
      path: "/budget",
    },
    {
      id: "representatives",
      label: "Representatives",
      icon: "ri-user-star-line",
      path: "/representatives",
    },
    {
      id: "parliamentary",
      label: "Parliament Updates",
      icon: "ri-government-line",
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
            <Link key={tab.id} href={tab.path}>
              <a
                className={cn(
                  "flex items-center px-4 py-2 mx-1 whitespace-nowrap",
                  isActive(tab.path)
                    ? "text-primary border-b-2 border-primary font-medium"
                    : "text-gray-600 hover:text-primary"
                )}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
