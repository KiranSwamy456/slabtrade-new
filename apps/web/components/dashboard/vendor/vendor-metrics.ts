import type { SlabListing } from "@/services/slab.service";

export type VendorMetrics = {
  totalListings: number;
  activeListings: number;
  inactiveListings: number;
  totalSlabs: number;
  activeRate: number;
  inventoryValue: number;
  avgUnitPrice: number;
};

export type TrendPoint = {
  key: string;
  label: string;
  count: number;
};

export type BreakdownRow = {
  label: string;
  count: number;
};

export function computeVendorMetrics(listings: SlabListing[]): VendorMetrics {
  const totalListings = listings.length;
  const activeListings = listings.filter(
    (listing) => listing.status === 1,
  ).length;
  const inactiveListings = totalListings - activeListings;

  const totalSlabs = listings.reduce(
    (sum, listing) => sum + (listing.slabsPerLot ?? 0),
    0,
  );

  const inventoryValue = listings.reduce(
    (sum, listing) =>
      sum + Number(listing.unitPrice) * (listing.slabsPerLot ?? 0),
    0,
  );

  const avgUnitPrice =
    totalListings === 0
      ? 0
      : listings.reduce((sum, listing) => sum + Number(listing.unitPrice), 0) /
        totalListings;

  const activeRate =
    totalListings === 0
      ? 0
      : Math.round((activeListings / totalListings) * 100);

  return {
    totalListings,
    activeListings,
    inactiveListings,
    totalSlabs,
    activeRate,
    inventoryValue,
    avgUnitPrice,
  };
}

export function buildMonthlyTrend(
  listings: SlabListing[],
  months = 6,
): TrendPoint[] {
  const now = new Date();

  const buckets: TrendPoint[] = Array.from({ length: months }, (_, offset) => {
    const monthsBack = months - 1 - offset;
    const date = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("en-US", { month: "short" }),
      count: 0,
    };
  });

  const indexByKey = new Map(buckets.map((bucket, index) => [bucket.key, index]));

  for (const listing of listings) {
    const date = new Date(listing.createdAt);
    const index = indexByKey.get(`${date.getFullYear()}-${date.getMonth()}`);
    const bucket = index === undefined ? undefined : buckets[index];

    if (bucket) {
      bucket.count += 1;
    }
  }

  return buckets;
}

const COLOR_ORDER: SlabListing["colorCategory"][] = ["Dark", "Light", "White"];

export function buildColorBreakdown(listings: SlabListing[]): BreakdownRow[] {
  return COLOR_ORDER.map((category) => ({
    label: category,
    count: listings.filter((listing) => listing.colorCategory === category)
      .length,
  }));
}

export function buildThicknessBreakdown(listings: SlabListing[]): BreakdownRow[] {
  const thicknesses = Array.from(
    new Set(listings.map((listing) => listing.thickness)),
  ).sort();

  return thicknesses.map((thickness) => ({
    label: thickness,
    count: listings.filter((listing) => listing.thickness === thickness).length,
  }));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
