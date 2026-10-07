"use client";

import type { ReactNode } from "react";
import { Layers, LayoutDashboard, ShoppingCart, Users } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Slabs", url: "/admin/slabs", icon: Layers },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
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
