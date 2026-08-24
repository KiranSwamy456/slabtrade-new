"use client";

import type { ReactNode } from "react";
import { LayoutDashboard } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [{ title: "Dashboard", url: "/support", icon: LayoutDashboard }];

export default function SupportLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      allowedRoles={["support"]}
      navItems={NAV_ITEMS}
      title="Support Portal"
    >
      {children}
    </DashboardLayout>
  );
}
