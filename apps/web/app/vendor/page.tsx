"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useAuthGuard } from "@/lib/auth/auth-guard";
import { authStorage } from "@/lib/auth/auth-storage";
import { slabService, type SlabListing } from "@/services/slab.service";
import { AccountOverviewCard } from "@/components/dashboard/AccountOverviewCard";
import { VendorStatCards } from "@/components/dashboard/vendor/VendorStatCards";
import { ListingsTrendChart } from "@/components/dashboard/vendor/ListingsTrendChart";
import { InventoryBreakdownChart } from "@/components/dashboard/vendor/InventoryBreakdownChart";
import { VendorOrdersCard } from "@/components/dashboard/vendor/VendorOrdersCard";
import {
  buildColorBreakdown,
  buildMonthlyTrend,
  buildThicknessBreakdown,
  computeVendorMetrics,
} from "@/components/dashboard/vendor/vendor-metrics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorPage() {
  const { user } = useAuthGuard({ allowedRoles: ["vendor"] });

  const [listings, setListings] = useState<SlabListing[]>([]);
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

    slabService
      .getMySlabListings(accessToken)
      .then((response) => setListings(response.data))
      .catch((error) => {
        toast.error("Failed to load dashboard", {
          description:
            error instanceof Error ? error.message : "Something went wrong.",
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const metrics = useMemo(() => computeVendorMetrics(listings), [listings]);
  const trend = useMemo(() => buildMonthlyTrend(listings), [listings]);
  const colorRows = useMemo(() => buildColorBreakdown(listings), [listings]);
  const thicknessRows = useMemo(
    () => buildThicknessBreakdown(listings),
    [listings],
  );

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome, {user.firstName}
          </h2>
          <p className="mt-1 text-slate-500">
            Here&apos;s an overview of your Slab Trade account.
          </p>
        </div>

        <Button asChild className="h-9">
          <Link href="/vendor/upload-slabs">
            <Plus className="size-4" />
            Upload slabs
          </Link>
        </Button>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <VendorStatCards metrics={metrics} />

          <div className="grid gap-4 lg:grid-cols-2">
            <ListingsTrendChart data={trend} />
            <InventoryBreakdownChart
              colorRows={colorRows}
              thicknessRows={thicknessRows}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <VendorOrdersCard />
            </div>
            <AccountOverviewCard user={user} className="h-full" />
          </div>
        </>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="gap-3 border border-slate-200 pt-5 shadow-sm ring-0"
          >
            <div className="px-4">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="px-4">
              <Skeleton className="h-7 w-16" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card
            key={index}
            className="gap-4 border border-slate-200 p-4 shadow-sm ring-0"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-44 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}
