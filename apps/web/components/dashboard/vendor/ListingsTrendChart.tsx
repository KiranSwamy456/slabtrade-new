"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TrendPoint } from "@/components/dashboard/vendor/vendor-metrics";

interface ListingsTrendChartProps {
  data: TrendPoint[];
}

export function ListingsTrendChart({ data }: ListingsTrendChartProps) {
  const [active, setActive] = useState<number | null>(null);

  const max = Math.max(1, ...data.map((point) => point.count));
  const total = data.reduce((sum, point) => sum + point.count, 0);

  return (
    <Card className="gap-0 overflow-hidden border border-slate-200 p-0 shadow-sm ring-0">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-b from-violet-50/70 to-white px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Slabs Listed</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            New lots added over the last {data.length} months
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
          <TrendingUp className="size-3.5" />
          {total} total
        </span>
      </div>

      <CardContent className="px-5 py-5">
        {total === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">
            No listings created in this period yet.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="relative flex h-40 items-end gap-2 border-b border-slate-200 sm:gap-3">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-slate-100" />
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-slate-100" />

              {data.map((point, index) => {
                const heightPercent = (point.count / max) * 100;
                const isActive = active === index;

                return (
                  <button
                    type="button"
                    key={point.key}
                    onMouseEnter={() => setActive(index)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(index)}
                    onBlur={() => setActive(null)}
                    className="group relative flex h-full flex-1 flex-col items-center justify-end gap-1.5 outline-none"
                    aria-label={`${point.label}: ${point.count} listings`}
                  >
                    <span
                      className={cn(
                        "text-xs font-semibold tabular-nums transition-colors",
                        isActive ? "text-violet-700" : "text-slate-400",
                      )}
                    >
                      {point.count}
                    </span>

                    <span
                      className={cn(
                        "w-full max-w-10 rounded-t-md transition-colors",
                        isActive
                          ? "bg-violet-600"
                          : "bg-violet-500 group-hover:bg-violet-600",
                      )}
                      style={{
                        height: `${Math.max(heightPercent, point.count > 0 ? 8 : 2)}%`,
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 sm:gap-3">
              {data.map((point) => (
                <span
                  key={point.key}
                  className="flex-1 text-center text-xs font-medium text-slate-500"
                >
                  {point.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
