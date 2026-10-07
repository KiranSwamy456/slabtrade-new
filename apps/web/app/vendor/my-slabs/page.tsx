"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Anchor,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Layers,
  Loader2,
  Package,
  Plus,
  Power,
  PowerOff,
} from "lucide-react";
import { toast } from "sonner";

/* eslint-disable @next/next/no-img-element -- images are served from the API's /uploads path, not next/image's domains */

import { useAuthGuard } from "@/lib/auth/auth-guard";
import { authStorage } from "@/lib/auth/auth-storage";
import {
  slabService,
  getSlabImageUrl,
  type SlabListing,
  type SlabStatus,
} from "@/services/slab.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const APPROVAL_BADGE_STYLES: Record<SlabListing["approvalStatus"], string> = {
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Approved: "bg-green-50 text-green-700 ring-1 ring-green-200",
  Rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const APPROVAL_BADGE_LABELS: Record<SlabListing["approvalStatus"], string> = {
  Pending: "Pending review",
  Approved: "Approved",
  Rejected: "Rejected",
};

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

/** Area range of one slab face in square feet, from inch dimensions. */
function formatSquareFeetRange(listing: SlabListing): string {
  const min = (listing.lengthMin * listing.widthMin) / 144;
  const max = (listing.lengthMax * listing.widthMax) / 144;

  return min.toFixed(1) === max.toFixed(1)
    ? min.toFixed(1)
    : `${min.toFixed(1)}–${max.toFixed(1)}`;
}

function SlabCardSkeleton() {
  return (
    <Card className="w-full gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-0">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-1.5 p-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-2.5 w-1/2" />
        <Skeleton className="h-2.5 w-1/3" />
      </div>
    </Card>
  );
}

const ZOOM_PANEL_SIZE = 340;
const ZOOM_PANEL_GAP = 16;
const ZOOM_LEVEL = 2.2;

function ZoomPreview({
  imageUrl,
  x,
  y,
  cursorX,
  cursorY,
}: {
  imageUrl: string;
  x: number;
  y: number;
  cursorX: number;
  cursorY: number;
}) {
  if (typeof document === "undefined") {
    return null;
  }

  let left = cursorX + ZOOM_PANEL_GAP;

  if (left + ZOOM_PANEL_SIZE > window.innerWidth) {
    left = cursorX - ZOOM_PANEL_SIZE - ZOOM_PANEL_GAP;
  }

  left = Math.max(8, left);

  const top = Math.min(
    Math.max(8, cursorY - ZOOM_PANEL_SIZE / 2),
    window.innerHeight - ZOOM_PANEL_SIZE - 8,
  );

  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed z-50 hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:block"
      style={{ left, top, width: ZOOM_PANEL_SIZE, height: ZOOM_PANEL_SIZE }}
    >
      <div
        className="size-full"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${ZOOM_LEVEL * 100}% ${ZOOM_LEVEL * 100}%`,
          backgroundPosition: `${x}% ${y}%`,
        }}
      />
    </div>,
    document.body,
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
  const [zoom, setZoom] = useState<{
    x: number;
    y: number;
    cursorX: number;
    cursorY: number;
  } | null>(null);

  const total = images.length;
  const current = images[index];
  const showFallback = !current || broken[index];

  const goTo = (next: number) => {
    setIndex((next + total) % total);
  };

  const handleMouseMove = (event: MouseEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setZoom({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
      cursorX: event.clientX,
      cursorY: event.clientY,
    });
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

  const imageUrl = getSlabImageUrl(current);

  return (
    <>
      <img
        src={imageUrl}
        alt={alt}
        className="size-full cursor-zoom-in object-cover"
        onError={() =>
          setBroken((previous) => ({ ...previous, [index]: true }))
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoom(null)}
      />

      {zoom && (
        <ZoomPreview
          imageUrl={imageUrl}
          x={zoom.x}
          y={zoom.y}
          cursorX={zoom.cursorX}
          cursorY={zoom.cursorY}
        />
      )}

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

function SlabListingCard({
  listing,
  onToggleStatus,
}: {
  listing: SlabListing;
  onToggleStatus: (listing: SlabListing) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const isActive = listing.status === 1;
  const actionLabel = isActive ? "Deactivate" : "Activate";

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onToggleStatus(listing);
      setOpen(false);
    } catch {
      /* error is surfaced via toast by the page handler; keep the dialog open */
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="group w-full gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-0">
      <div className="relative aspect-square w-full shrink-0 bg-slate-100">
        <SlabImageCarousel images={listing.images} alt={listing.materialName} />

        <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1">
          <Badge
            variant="outline"
            className={cn(
              "shadow-sm",
              isActive
                ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                : "bg-white/90 text-slate-700 ring-1 ring-slate-200",
            )}
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>

          <Badge
            variant="outline"
            className={cn(
              "shadow-sm",
              APPROVAL_BADGE_STYLES[listing.approvalStatus],
            )}
          >
            {APPROVAL_BADGE_LABELS[listing.approvalStatus]}
          </Badge>
        </div>
      </div>

      <div className="space-y-1.5 p-2">
        <div>
          <h3 className="truncate text-xs font-semibold text-slate-900">
            {listing.materialName}
          </h3>
          <p className="mt-0.5 truncate text-[10px] text-slate-500">
            Listed {formatDate(listing.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge
            variant="outline"
            className={cn("text-[9px]", COLOR_BADGE_STYLES[listing.colorCategory])}
          >
            {listing.colorCategory}
          </Badge>
          <Badge variant="outline" className="text-[9px] text-slate-600">
            {listing.veinPattern} vein
          </Badge>
          <Badge variant="outline" className="text-[9px] text-slate-600">
            {listing.thickness}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-1.5 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Package className="size-3 shrink-0 text-slate-400" />
            {listing.slabsPerLot}/lot
          </span>
          <span className="truncate">
            {listing.lengthMin}–{listing.lengthMax} × {listing.widthMin}–
            {listing.widthMax} in
          </span>
        </div>

        <span className="flex items-center gap-1 text-[10px] text-slate-500">
          <Anchor className="size-3 shrink-0 text-slate-400" />
          {listing.portOfLoading}
        </span>

        <p className="text-[10px] text-slate-400">
          {formatSquareFeetRange(listing)} sq ft / slab
        </p>

        <p className="text-xs font-semibold text-slate-900">
          ${listing.unitPrice.toFixed(2)}
          <span className="ml-1 text-[10px] font-normal text-slate-500">
            / slab
          </span>
        </p>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant={isActive ? "outline" : "default"}
              size="sm"
              className="mt-1 h-7 w-full text-xs"
            >
              {isActive ? (
                <PowerOff className="size-3.5" />
              ) : (
                <Power className="size-3.5" />
              )}
              {actionLabel}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionLabel} this slab?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isActive
                  ? `Are you sure you want to deactivate "${listing.materialName}"? Buyers will no longer see this lot until you activate it again.`
                  : `Are you sure you want to activate "${listing.materialName}"? It will become visible to buyers right away.`}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(event) => {
                  event.preventDefault();
                  void handleConfirm();
                }}
                disabled={busy}
                className={cn(
                  isActive &&
                    "bg-red-600 text-white hover:bg-red-600/90",
                )}
              >
                {busy && <Loader2 className="size-3.5 animate-spin" />}
                Yes, {actionLabel.toLowerCase()}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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

  const handleToggleStatus = async (listing: SlabListing) => {
    const accessToken = authStorage.getAccessToken();

    if (!accessToken) {
      toast.error("Authentication required", {
        description: "Please sign in again.",
      });
      return;
    }

    const nextStatus: SlabStatus = listing.status === 1 ? 0 : 1;

    try {
      const response = await slabService.updateSlabStatus(
        listing.id,
        nextStatus,
        accessToken,
      );

      setListings((previous) =>
        previous.map((item) =>
          item.id === listing.id ? response.data : item,
        ),
      );

      toast.success(
        nextStatus === 1 ? "Slab activated" : "Slab deactivated",
        { description: listing.materialName },
      );
    } catch (error) {
      toast.error("Failed to update status", {
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
      throw error;
    }
  };

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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {listings.map((listing) => (
            <SlabListingCard
              key={listing.id}
              listing={listing}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
