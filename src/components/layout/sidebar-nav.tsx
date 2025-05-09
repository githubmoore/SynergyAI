
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { AppWindow, Bot, LayoutDashboard, Route, Sparkles, UsersRound, Zap } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, matchExact: true },
  { href: "/dynamic-query-routing", label: "Query Routing", icon: Route },
  { href: "/self-prompting-optimization", label: "Prompt Optimization", icon: Sparkles },
  { href: "/energy-aware-model-selection", label: "Energy-Aware Selection", icon: Zap },
  { href: "/collaborative-output-refinement", label: "Output Refinement", icon: UsersRound },
  { href: "/ai-tools", label: "AI Tools", icon: AppWindow },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const isActive = item.matchExact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={cn(
                  isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                  "justify-start"
                )}
                tooltip={{ children: item.label, className: "bg-primary text-primary-foreground" }}
              >
                <a>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
