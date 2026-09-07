import type { LucideIcon } from "lucide-react";
import { Boxes, CheckCircle2, DollarSign, PauseCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  type VendorMetrics,
} from "@/components/dashboard/vendor/vendor-metrics";

const ACCENTS = {
  violet: {
    bar: "bg-violet-500",
    iconBg: "bg-violet-100",
    icon: "text-violet-600",
    value: "text-violet-700",
    card: "hover:border-violet-200",
  },
  emerald: {
    bar: "bg-emerald-500",
    iconBg: "bg-emerald-100",
    icon: "text-emerald-600",
    value: "text-emerald-700",
    card: "hover:border-emerald-200",
  },
  slate: {
    bar: "bg-slate-400",
    iconBg: "bg-slate-100",
    icon: "text-slate-500",
    value: "text-slate-700",
    card: "hover:border-slate-300",
  },
  amber: {
    bar: "bg-amber-500",
    iconBg: "bg-amber-100",
    icon: "text-amber-600",
    value: "text-amber-700",
    card: "hover:border-amber-200",
  },
} as const;

type Accent = keyof typeof ACCENTS;

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  accent: Accent;
}

function StatCard({ label, value, hint, icon: Icon, accent }: StatCardProps) {
  const styles = ACCENTS[accent];

  return (
    <Card
      className={cn(
        "relative gap-3 overflow-hidden border border-slate-200 pt-5 shadow-sm ring-0 transition-all hover:shadow-md",
        styles.card,
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-1", styles.bar)} />

      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-slate-500">
          {label}
        </CardTitle>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            styles.iconBg,
          )}
        >
          <Icon className={cn("size-4.5", styles.icon)} />
        </div>
      </CardHeader>

      <CardContent>
        <p className={cn("text-2xl font-bold tabular-nums", styles.value)}>
          {value}
        </p>
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      </CardContent>
    </Card>
  );
}

interface VendorStatCardsProps {
  metrics: VendorMetrics;
}

export function VendorStatCards({ metrics }: VendorStatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Slabs"
        value={metrics.totalListings.toLocaleString()}
        hint={`${metrics.totalSlabs.toLocaleString()} slabs across all lots`}
        icon={Boxes}
        accent="violet"
      />
      <StatCard
        label="Active Slabs"
        value={metrics.activeListings.toLocaleString()}
        hint={`${metrics.activeRate}% of your listings are live`}
        icon={CheckCircle2}
        accent="emerald"
      />
      <StatCard
        label="Inactive Slabs"
        value={metrics.inactiveListings.toLocaleString()}
        hint={
          metrics.inactiveListings === 0
            ? "Everything is currently listed"
            : "Not visible to buyers"
        }
        icon={PauseCircle}
        accent="slate"
      />
      <StatCard
        label="Inventory Value"
        value={formatCurrency(metrics.inventoryValue)}
        hint={`Avg ${formatCurrency(metrics.avgUnitPrice)} / slab`}
        icon={DollarSign}
        accent="amber"
      />
    </div>
  );
}
