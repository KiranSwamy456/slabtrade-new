import { Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function VendorOrdersCard() {
  return (
    <Card className="h-full gap-0 overflow-hidden border border-slate-200 p-0 shadow-sm ring-0">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Recent Orders
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Purchases buyers have placed for your slabs
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
          Coming soon
        </span>
      </div>

      <CardContent className="px-5 py-5">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-3 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span>Order</span>
          <span>Buyer</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-violet-50 ring-8 ring-violet-50/40">
            <Package className="size-5 text-violet-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">No orders yet</p>
            <p className="mt-1 text-sm text-slate-500">
              When a buyer orders one of your lots, it will appear here.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
