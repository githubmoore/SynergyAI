
import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import type { PageIconName } from "./icon-types";

interface MainLayoutProps {
  children: ReactNode;
  pageTitle: string;
  pageIconName?: PageIconName;
}

export default function MainLayout({ children, pageTitle, pageIconName }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader title={pageTitle} iconName={pageIconName} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
