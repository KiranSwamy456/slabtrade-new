"use client";

import type { ReactNode } from "react";
import { LayoutDashboard } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [{ title: "Dashboard", url: "/vendor", icon: LayoutDashboard }];

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      allowedRoles={["vendor"]}
      navItems={NAV_ITEMS}
      title="Vendor Portal"
    >
      {children}
    </DashboardLayout>
  );
}
