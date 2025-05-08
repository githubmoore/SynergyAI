
import MainLayout from "@/components/layout/main-layout";
import { DashboardContent } from "@/components/sections/dashboard-content";

export default function DashboardPage() {
  return (
    <MainLayout pageTitle="Dashboard Overview" pageIconName="LayoutDashboard">
      <DashboardContent />
    </MainLayout>
  );
}
