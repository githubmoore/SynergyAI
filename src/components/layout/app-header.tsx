
"use client";

import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Route, Sparkles, Zap, UsersRound, AppWindow } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { PageIconName } from "./icon-types";

const iconMap: Record<PageIconName, LucideIcon> = {
  LayoutDashboard,
  Route,
  Sparkles,
  Zap,
  UsersRound,
  AppWindow, // Added AppWindow
};

interface AppHeaderProps {
  title: string;
  iconName?: PageIconName;
}

export function AppHeader({ title, iconName }: AppHeaderProps) {
  const IconComponent = iconName ? iconMap[iconName] : null;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-2">
        {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
        <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
      </div>
    </header>
  );
}
