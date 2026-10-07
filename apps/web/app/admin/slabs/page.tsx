"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuthGuard } from "@/lib/auth/auth-guard";
import { authStorage } from "@/lib/auth/auth-storage";
import { slabService, type AdminSlabListing } from "@/services/slab.service";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SlabsDataTable } from "@/components/dashboard/SlabsDataTable";

export default function AdminSlabsPage() {
  const { user } = useAuthGuard({ allowedRoles: ["admin"] });

  const [listings, setListings] = useState<AdminSlabListing[]>([]);
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
      .getAdminListings(accessToken)
      .then((response) => setListings(response.data))
      .catch((error) => {
        toast.error("Failed to load slabs", {
          description:
            error instanceof Error ? error.message : "Something went wrong.",
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleApprove = async (listing: AdminSlabListing, price: number) => {
    const accessToken = authStorage.getAccessToken();

    if (!accessToken) {
      toast.error("Authentication required", {
        description: "Please sign in again.",
      });
      return;
    }

    try {
      const response = await slabService.approveSlabListing(
        listing.id,
        price,
        accessToken,
      );

      setListings((previous) =>
        previous.map((item) =>
          item.id === listing.id
            ? { ...item, ...response.data, customerPrice: price }
            : item,
        ),
      );

      toast.success("Slab approved", {
        description: `${listing.materialName} — customers will see $${price.toFixed(2)}`,
      });
    } catch (error) {
      toast.error("Failed to approve slab", {
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  const handleReject = async (listing: AdminSlabListing) => {
    const accessToken = authStorage.getAccessToken();

    if (!accessToken) {
      toast.error("Authentication required", {
        description: "Please sign in again.",
      });
      return;
    }

    try {
      const response = await slabService.rejectSlabListing(
        listing.id,
        accessToken,
      );

      setListings((previous) =>
        previous.map((item) =>
          item.id === listing.id
            ? { ...item, ...response.data, customerPrice: null }
            : item,
        ),
      );

      toast.success("Slab rejected", { description: listing.materialName });
    } catch (error) {
      toast.error("Failed to reject slab", {
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
        <h2 className="text-2xl font-bold text-slate-900">Slabs</h2>
        <p className="mt-1 text-slate-500">
          Review vendor listings and set the price customers see.
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
        <SlabsDataTable
          listings={listings}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
