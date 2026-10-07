"use client";

import type { ReactNode } from "react";
import { ClipboardList, LayoutDashboard, ShoppingBag, ShoppingCart } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CartHeaderButton } from "@/components/dashboard/customer/CartHeaderButton";
import { useAuthGuard } from "@/lib/auth/auth-guard";
import { CartProvider } from "@/lib/cart/cart-context";

const NAV_ITEMS = [
  { title: "Dashboard", url: "/customer", icon: LayoutDashboard },
  { title: "Browse Slabs", url: "/customer/browse", icon: ShoppingBag },
  { title: "Cart", url: "/customer/cart", icon: ShoppingCart },
  { title: "My Orders", url: "/customer/orders", icon: ClipboardList },
];

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const { user } = useAuthGuard();

  return (
    <CartProvider customerId={user?.id ?? null}>
      <DashboardLayout
        allowedRoles={["customer"]}
        navItems={NAV_ITEMS}
        title="Customer Portal"
        headerActions={<CartHeaderButton />}
      >
        {children}
      </DashboardLayout>
    </CartProvider>
  );
}
