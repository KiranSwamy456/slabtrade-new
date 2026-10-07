"use client";

import { useEffect, useState } from "react";
import { PackageSearch } from "lucide-react";
import { toast } from "sonner";

import { useAuthGuard } from "@/lib/auth/auth-guard";
import { authStorage } from "@/lib/auth/auth-storage";
import { orderService, type Order, type OrderStatus } from "@/services/order.service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_BADGE_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-blue-50 text-blue-700",
  Shipped: "bg-violet-50 text-violet-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CustomerOrdersPage() {
  const { user } = useAuthGuard({ allowedRoles: ["customer"] });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const accessToken = authStorage.getAccessToken();

    if (!accessToken) {
      toast.error("Authentication required", {
        description: "Please sign in again.",
      });
      setLoading(false);
      return;
    }

    orderService
      .getMyOrders(accessToken)
      .then((response) => setOrders(response.data))
      .catch((error) => {
        toast.error("Failed to load orders", {
          description:
            error instanceof Error ? error.message : "Something went wrong.",
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Orders</h2>
        <p className="mt-1 text-slate-500">
          Track the orders you&apos;ve placed.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 border border-slate-200 py-16 text-center shadow-sm ring-0">
          <PackageSearch className="size-8 text-slate-300" />
          <p className="text-sm font-semibold text-slate-900">
            No orders yet
          </p>
          <p className="text-sm text-slate-500">
            Orders you place will show up here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="space-y-3 border border-slate-200 p-4 shadow-sm ring-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-slate-500">
                    Placed {formatDate(order.createdAt)}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={STATUS_BADGE_STYLES[order.status]}
                >
                  {order.status}
                </Badge>
              </div>

              <div className="divide-y divide-slate-100 rounded-lg border border-slate-100">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <span className="text-slate-700">
                      {item.materialName} × {item.quantity}
                    </span>
                    <span className="font-medium text-slate-900">
                      ${item.lineTotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Payment</span>
                <span className="font-medium text-slate-900">
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : "UPI"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="font-semibold text-slate-900">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
