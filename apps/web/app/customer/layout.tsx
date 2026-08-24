"use client";

import type { ReactNode } from "react";
import { LayoutDashboard } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [{ title: "Dashboard", url: "/customer", icon: LayoutDashboard }];

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      allowedRoles={["customer"]}
      navItems={NAV_ITEMS}
      title="Customer Portal"
    >
      {children}
    </DashboardLayout>
  );
}
