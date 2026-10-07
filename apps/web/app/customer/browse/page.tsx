"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { ImageOff, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

/* eslint-disable @next/next/no-img-element -- images are served from the API's /uploads path, not next/image's domains */

import { useAuthGuard } from "@/lib/auth/auth-guard";
import { authStorage } from "@/lib/auth/auth-storage";
import { useCart } from "@/lib/cart/cart-context";
import {
  slabService,
  getSlabImageUrl,
  type MarketplaceSlabListing,
} from "@/services/slab.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const COLOR_BADGE_STYLES: Record<MarketplaceSlabListing["colorCategory"], string> = {
  Dark: "bg-slate-900/5 text-slate-700",
  Light: "bg-amber-50 text-amber-700",
  White: "bg-blue-50 text-blue-700",
};

function ListingCardSkeleton() {
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

function ListingCard({ listing }: { listing: MarketplaceSlabListing }) {
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const [broken, setBroken] = useState(false);
  const [zoom, setZoom] = useState<{
    x: number;
    y: number;
    cursorX: number;
    cursorY: number;
  } | null>(null);

  const image = listing.images[0];
  const showFallback = !image || broken;
  const imageUrl = image ? getSlabImageUrl(image) : undefined;

  const handleAddToCart = () => {
    cart.addItem(listing, Math.max(1, quantity));

    toast.success("Added to cart", {
      description: `${listing.materialName} × ${Math.max(1, quantity)}`,
    });
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

  return (
    <Card className="w-full gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-0">
      <div className="relative aspect-square w-full bg-slate-50">
        {showFallback ? (
          <div className="flex size-full flex-col items-center justify-center gap-1 text-slate-300">
            <ImageOff className="size-5" />
            <span className="text-[10px] font-medium text-slate-400">
              No photos
            </span>
          </div>
        ) : (
          <>
            <img
              src={imageUrl}
              alt={listing.materialName}
              className="size-full cursor-zoom-in object-cover"
              onError={() => setBroken(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoom(null)}
            />

            {zoom && imageUrl && (
              <ZoomPreview
                imageUrl={imageUrl}
                x={zoom.x}
                y={zoom.y}
                cursorX={zoom.cursorX}
                cursorY={zoom.cursorY}
              />
            )}
          </>
        )}
      </div>

      <div className="space-y-1.5 p-2">
        <div>
          <h3 className="truncate text-xs font-semibold text-slate-900">
            {listing.materialName}
          </h3>
          <p className="mt-0.5 truncate text-[10px] text-slate-500">
            {listing.vendorName} · {listing.portOfLoading}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge
            variant="outline"
            className={
              "text-[9px] " + COLOR_BADGE_STYLES[listing.colorCategory]
            }
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

        <p className="text-xs font-semibold text-slate-900">
          ${listing.unitPrice.toFixed(2)}
          <span className="ml-1 text-[10px] font-normal text-slate-500">
            / slab
          </span>
        </p>

        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) =>
              setQuantity(Math.max(1, Number(event.target.value) || 1))
            }
            className="h-7 w-12 px-1.5 text-xs"
          />

          <Button
            type="button"
            size="sm"
            className="h-7 flex-1 text-xs"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="size-3" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function BrowseSlabsPage() {
  const { user } = useAuthGuard({ allowedRoles: ["customer"] });

  const [listings, setListings] = useState<MarketplaceSlabListing[]>([]);
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
      .getMarketplaceListings(accessToken)
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
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Browse Slabs</h2>
        <p className="mt-1 text-slate-500">
          Explore available slab lots from all vendors and add them to your
          cart.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <ListingCardSkeleton key={index} />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 border border-slate-200 py-16 text-center shadow-sm ring-0">
          <p className="text-sm font-semibold text-slate-900">
            No slabs available yet
          </p>
          <p className="text-sm text-slate-500">
            Check back soon — vendors are adding inventory regularly.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
