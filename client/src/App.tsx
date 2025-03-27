import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import GovernmentLogin from "@/pages/government-login";
import ReportIssue from "@/pages/report-issue";
import Issues from "@/pages/issues";
import Representatives from "@/pages/representatives";
import Budget from "@/pages/budget";
import Parliamentary from "@/pages/parliamentary";
import About from "@/pages/about";
import HowItWorks from "@/pages/how-it-works";
import OpenData from "@/pages/open-data";
import ApiDocs from "@/pages/api-docs";
import GovtPortals from "@/pages/govt-portals";
import PrivacyPolicy from "@/pages/privacy-policy";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { isLoading } = useAuth();

  if (isLoading) {
    // You could show a loading spinner here
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/government-login" component={GovernmentLogin} />
      <Route path="/report-issue" component={ReportIssue} />
      <Route path="/issues" component={Issues} />
      <Route path="/representatives" component={Representatives} />
      <Route path="/budget" component={Budget} />
      <Route path="/parliamentary" component={Parliamentary} />
      <Route path="/about" component={About} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/open-data" component={OpenData} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route path="/govt-portals" component={GovtPortals} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
