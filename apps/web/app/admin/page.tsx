"use client";

import { Users, ShieldCheck, Boxes } from "lucide-react";

import { useAuthGuard } from "@/lib/auth/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLOR_STYLES = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    value: "text-blue-700",
    bar: "bg-blue-500",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    value: "text-violet-700",
    bar: "bg-violet-500",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    value: "text-emerald-700",
    bar: "bg-emerald-500",
  },
} as const;

const STATS = [
  { label: "Total Users", value: "—", icon: Users, color: "blue" as const },
  {
    label: "Active Roles",
    value: "4",
    icon: ShieldCheck,
    color: "violet" as const,
  },
  { label: "Listings", value: "—", icon: Boxes, color: "emerald" as const },
];

export default function AdminDashboardPage() {
  const { user } = useAuthGuard({ allowedRoles: ["admin"] });

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome, {user.firstName}
        </h2>
        <p className="mt-1 text-slate-500">
          Here&apos;s an overview of Slab Trade.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map(({ label, value, icon: Icon, color }) => {
          const styles = COLOR_STYLES[color];

          return (
            <Card key={label} className="relative gap-3 overflow-hidden pt-5">
              <div
                className={cn("absolute inset-x-0 top-0 h-1", styles.bar)}
              />

              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {label}
                </CardTitle>
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    styles.bg,
                  )}
                >
                  <Icon className={cn("size-4.5", styles.icon)} />
                </div>
              </CardHeader>
              <CardContent>
                <p className={cn("text-2xl font-bold", styles.value)}>
                  {value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
