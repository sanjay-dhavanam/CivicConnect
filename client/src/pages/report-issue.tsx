import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Footer } from "@/components/layout/Footer";
import { ReportIssueForm } from "@/components/issues/ReportIssueForm";

export default function ReportIssue() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MobileNav />
      <TabNavigation />
      
      <main className="flex-1 py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <ReportIssueForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
