"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BreakdownRow } from "@/components/dashboard/vendor/vendor-metrics";

const COLOR_BAR: Record<string, string> = {
  Dark: "bg-slate-700",
  Light: "bg-amber-400",
  White: "bg-sky-400",
};

interface BarGroupProps {
  title: string;
  rows: BreakdownRow[];
  barClassName?: string;
  colorByLabel?: boolean;
}

function BarGroup({ title, rows, barClassName, colorByLabel }: BarGroupProps) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  const totalInGroup = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <div className="space-y-2.5">
        {rows.map((row) => {
          const widthPercent =
            totalInGroup === 0 ? 0 : (row.count / max) * 100;
          const share =
            totalInGroup === 0
              ? 0
              : Math.round((row.count / totalInGroup) * 100);

          return (
            <div key={row.label} className="flex items-center gap-3">
              <span className="w-14 shrink-0 text-xs font-medium text-slate-600">
                {row.label}
              </span>

              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn(
                    "h-full rounded-full",
                    colorByLabel
                      ? (COLOR_BAR[row.label] ?? "bg-violet-500")
                      : barClassName,
                    row.count === 0 && "bg-transparent",
                  )}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              <span className="w-20 shrink-0 text-right text-xs tabular-nums text-slate-500">
                {row.count}
                <span className="ml-1 text-slate-400">({share}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface InventoryBreakdownChartProps {
  colorRows: BreakdownRow[];
  thicknessRows: BreakdownRow[];
}

export function InventoryBreakdownChart({
  colorRows,
  thicknessRows,
}: InventoryBreakdownChartProps) {
  const hasData =
    colorRows.some((row) => row.count > 0) ||
    thicknessRows.some((row) => row.count > 0);

  return (
    <Card className="gap-0 overflow-hidden border border-slate-200 p-0 shadow-sm ring-0">
      <div className="border-b border-slate-100 bg-gradient-to-b from-sky-50/70 to-white px-5 py-4">
        <h3 className="text-base font-semibold text-slate-900">Inventory Mix</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          How your listed lots break down
        </p>
      </div>

      <CardContent className="px-5 py-5">
        {hasData ? (
          <div className="space-y-6">
            <BarGroup title="By color" rows={colorRows} colorByLabel />
            {thicknessRows.length > 0 && (
              <BarGroup
                title="By thickness"
                rows={thicknessRows}
                barClassName="bg-violet-500"
              />
            )}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-slate-400">
            Upload slabs to see your inventory mix.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
