"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuthGuard } from "@/lib/auth/auth-guard";
import { authStorage } from "@/lib/auth/auth-storage";
import {
  orderService,
  type AdminOrder,
  type OrderStatus,
} from "@/services/order.service";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrdersDataTable } from "@/components/dashboard/OrdersDataTable";

export default function AdminOrdersPage() {
  const { user } = useAuthGuard({ allowedRoles: ["admin"] });

  const [orders, setOrders] = useState<AdminOrder[]>([]);
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
      .getAllOrders(accessToken)
      .then((response) => setOrders(response.data))
      .catch((error) => {
        toast.error("Failed to load orders", {
          description:
            error instanceof Error ? error.message : "Something went wrong.",
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleUpdateStatus = async (order: AdminOrder, status: OrderStatus) => {
    const accessToken = authStorage.getAccessToken();

    if (!accessToken) {
      toast.error("Authentication required", {
        description: "Please sign in again.",
      });
      return;
    }

    try {
      const response = await orderService.updateOrderStatus(
        order.id,
        status,
        accessToken,
      );

      setOrders((previous) =>
        previous.map((item) =>
          item.id === order.id ? { ...item, status: response.data.status } : item,
        ),
      );

      toast.success(
        status === "Confirmed" ? "Order accepted" : "Order rejected",
        { description: order.orderNumber },
      );
    } catch (error) {
      toast.error("Failed to update order", {
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Orders</h2>
        <p className="mt-1 text-slate-500">
          All orders placed across the marketplace.
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="space-y-3 py-6">
            <Skeleton className="h-9 w-full max-w-sm" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      ) : (
        <OrdersDataTable
          orders={orders}
          onAccept={(order) => handleUpdateStatus(order, "Confirmed")}
          onIgnore={(order) => handleUpdateStatus(order, "Cancelled")}
        />
      )}
    </div>
  );
}
