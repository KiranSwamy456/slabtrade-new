"use client";

import type { ReactNode } from "react";
import { LayoutDashboard, Users } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      allowedRoles={["admin"]}
      navItems={NAV_ITEMS}
      title="Admin Panel"
    >
      {children}
    </DashboardLayout>
  );
}
