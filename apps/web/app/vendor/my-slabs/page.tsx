"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Layers,
  Package,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

/* eslint-disable @next/next/no-img-element -- images are served from the API's /uploads path, not next/image's domains */

import { useAuthGuard } from "@/lib/auth/auth-guard";
import { authStorage } from "@/lib/auth/auth-storage";
import { slabService, getSlabImageUrl, type SlabListing } from "@/services/slab.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const COLOR_BADGE_STYLES: Record<SlabListing["colorCategory"], string> = {
  Dark: "bg-slate-900/5 text-slate-700",
  Light: "bg-amber-50 text-amber-700",
  White: "bg-blue-50 text-blue-700",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SlabCardSkeleton() {
  return (
    <Card className="w-full gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-0">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </Card>
  );
}

function SlabImageCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  const total = images.length;
  const current = images[index];
  const showFallback = !current || broken[index];

  const goTo = (next: number) => {
    setIndex((next + total) % total);
  };

  if (total === 0 || showFallback) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-1 text-slate-300">
        <ImageOff className="size-5" />
        <span className="text-[10px] font-medium text-slate-400">
          {total === 0 ? "No photos" : "Image unavailable"}
        </span>
      </div>
    );
  }

  return (
    <>
      <img
        src={getSlabImageUrl(current)}
        alt={alt}
        className="size-full object-cover"
        onError={() =>
          setBroken((previous) => ({ ...previous, [index]: true }))
        }
      />

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(event) => {
              event.preventDefault();
              goTo(index - 1);
            }}
            className="absolute top-1/2 left-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ChevronLeft className="size-3.5" />
          </button>

          <button
            type="button"
            aria-label="Next photo"
            onClick={(event) => {
              event.preventDefault();
              goTo(index + 1);
            }}
            className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ChevronRight className="size-3.5" />
          </button>

          <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={cn(
                  "size-1.5 rounded-full bg-white/60",
                  dotIndex === index && "bg-white",
                )}
              />
            ))}
          </div>

          <span className="absolute top-1.5 right-1.5 rounded-full bg-slate-900/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {index + 1}/{total}
          </span>
        </>
      )}
    </>
  );
}

function SlabListingCard({ listing }: { listing: SlabListing }) {
  return (
    <Card className="group w-full gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-0">
      <div className="relative aspect-square w-full shrink-0 bg-slate-100">
        <SlabImageCarousel images={listing.images} alt={listing.materialName} />

        <Badge
          variant="outline"
          className={cn(
            "absolute top-1.5 left-1.5 shadow-sm",
            listing.isActive
              ? "bg-green-50 text-green-700 ring-1 ring-green-200"
              : "bg-white/90 text-slate-700 ring-1 ring-slate-200",
          )}
        >
          {listing.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="space-y-2 p-3">
        <div>
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {listing.materialName}
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Listed {formatDate(listing.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge
            variant="outline"
            className={cn("text-[10px]", COLOR_BADGE_STYLES[listing.colorCategory])}
          >
            {listing.colorCategory}
          </Badge>
          <Badge variant="outline" className="text-[10px] text-slate-600">
            {listing.veinPattern} vein
          </Badge>
          <Badge variant="outline" className="text-[10px] text-slate-600">
            {listing.thickness}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Package className="size-3 shrink-0 text-slate-400" />
            {listing.slabsPerLot}/lot
          </span>
          <span className="truncate">
            {listing.lengthMin}–{listing.lengthMax} × {listing.widthMin}–
            {listing.widthMax} cm
          </span>
        </div>

        <p className="text-sm font-semibold text-slate-900">
          ${listing.unitPrice.toFixed(2)}
          <span className="ml-1 text-[11px] font-normal text-slate-500">
            / slab
          </span>
        </p>
      </div>
    </Card>
  );
}

export default function MySlabsPage() {
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
        toast.error("Failed to load slabs", {
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Slabs</h2>
          <p className="mt-1 text-slate-500">
            Every lot you&apos;ve listed for buyers to discover.
          </p>
        </div>

        <Button asChild className="h-8">
          <Link href="/vendor/upload-slabs">
            <Plus className="size-4" />
            Upload slabs
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <SlabCardSkeleton key={index} />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-none ring-0">
          <Layers className="size-8 text-slate-300" />
          <div>
            <p className="text-sm font-semibold text-slate-900">
              No slabs listed yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Upload your first lot to get it in front of buyers.
            </p>
          </div>
          <Button asChild className="mt-2 h-8">
            <Link href="/vendor/upload-slabs">
              <Plus className="size-4" />
              Upload slabs
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <SlabListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
