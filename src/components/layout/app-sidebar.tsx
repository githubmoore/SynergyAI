
import { Bot } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import Link from "next/link";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="border-b">
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[[data-collapsible=icon]]:justify-center">
          <Bot className="h-7 w-7 text-primary" />
          <span className="text-lg font-semibold text-primary group-data-[[data-collapsible=icon]]:hidden">SynergyAI</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter className="p-2 border-t group-data-[[data-collapsible=icon]]:hidden">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} SynergyAI
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
