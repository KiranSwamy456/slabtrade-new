"use client";

import type { ReactNode } from "react";
import { Boxes, LayoutDashboard, Layers } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [
  { title: "Dashboard", url: "/vendor", icon: LayoutDashboard },
  { title: "Upload Slabs", url: "/vendor/upload-slabs", icon: Layers },
  { title: "My Slabs", url: "/vendor/my-slabs", icon: Boxes },
];

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
