"use client";

import type { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar, type DashboardNavItem } from "./AppSidebar";
import { useAuthGuard, type RoleName } from "@/lib/auth/auth-guard";

interface DashboardLayoutProps {
  allowedRoles: RoleName[];
  navItems: DashboardNavItem[];
  title: string;
  children: ReactNode;
}

export function DashboardLayout({
  allowedRoles,
  navItems,
  title,
  children,
}: DashboardLayoutProps) {
  const { user, isLoading, isAuthorized } = useAuthGuard({ allowedRoles });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="w-full max-w-sm space-y-3 px-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!isAuthorized || !user) {
    return null;
  }

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "14rem" } as React.CSSProperties}
    >
      <AppSidebar navItems={navItems} user={user} />

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
        </header>

        <div className="flex-1 bg-slate-50 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
