"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { SiteChrome } from "@/components/site/SiteChrome";
import { MarketingFooter } from "@/components/site/MarketingFooter";
import { PageTransition } from "@/components/site/PageTransition";
import { ProductCard, ProductSkeleton } from "@/components/site/ProductCard";
import { filterProducts, originOptions, products, toneOptions, typeOptions } from "@/lib/products";

const ease = [0.22, 1, 0.36, 1] as const;

export default function BuyerPage() {
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState("all");
  const [tone, setTone] = useState("all");
  const [type, setType] = useState("all");
  const [ready, setReady] = useState(false);
  const [isPending, startTransition] = useTransition();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 280);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(
    () => filterProducts({ query, origin, tone, type }),
    [query, origin, tone, type],
  );

  const fadeUp = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.7, ease, delay },
  });

  const hasFilters = query || origin !== "all" || tone !== "all" || type !== "all";

  function clearFilters() {
    startTransition(() => {
      setQuery("");
      setOrigin("all");
      setTone("all");
      setType("all");
    });
  }

  return (
    <PageTransition>
      <main className="min-h-screen text-[#101820]">
        <SiteChrome />

        <section className="relative overflow-hidden bg-[#d6b887] px-5 py-16 sm:px-6 sm:py-20 lg:px-16 lg:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,.55),transparent_55%)]" />
          <div className="relative mx-auto max-w-[1440px]">
            <motion.p className="label-eyebrow mb-6" {...fadeUp(0.05)}>
              For buyers & designers
            </motion.p>
            <motion.h1 className="max-w-3xl font-serif text-[clamp(2.75rem,10vw,5.5rem)] leading-[.92] tracking-[-.04em] md:text-7xl lg:text-8xl" {...fadeUp(0.15)}>
              Start with the
              <br />
              <i className="text-[#0d5c63]">material.</i>
            </motion.h1>
            <motion.p className="mt-6 max-w-lg text-base leading-7 text-[#5b6c74] sm:mt-8 sm:text-lg sm:leading-8" {...fadeUp(0.3)}>
              Browse {products.length} curated slabs. Search by name, filter by origin or tone, then enquire directly.
            </motion.p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-6 sm:py-20 lg:px-16 lg:py-28">
          <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label-eyebrow">Curated materials</p>
              <h2 className="mt-3 font-serif text-4xl tracking-[-.04em] sm:text-5xl">Find your starting point.</h2>
              <p className="mt-2 text-sm text-[#5b6c74]">
                Showing {filtered.length} of {products.length} materials
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <label className="relative min-w-[220px] flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#0d5c63]" />
                <input
                  value={query}
                  onChange={(event) => startTransition(() => setQuery(event.target.value))}
                  placeholder="Search name, origin, tone…"
                  className="w-full rounded-2xl border border-[#c5d8dc] bg-white px-10 py-3 text-sm outline-none transition focus:border-[#0d5c63] focus:ring-2 focus:ring-[#0d5c63]/15"
                />
              </label>

              <select
                value={origin}
                onChange={(event) => startTransition(() => setOrigin(event.target.value))}
                className="rounded-2xl border border-[#c5d8dc] bg-white px-4 py-3 text-sm outline-none focus:border-[#0d5c63]"
                aria-label="Filter by origin"
              >
                <option value="all">All origins</option>
                {originOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={tone}
                onChange={(event) => startTransition(() => setTone(event.target.value))}
                className="rounded-2xl border border-[#c5d8dc] bg-white px-4 py-3 text-sm outline-none focus:border-[#0d5c63]"
                aria-label="Filter by tone"
              >
                <option value="all">All tones</option>
                {toneOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={type}
                onChange={(event) => startTransition(() => setType(event.target.value))}
                className="rounded-2xl border border-[#c5d8dc] bg-white px-4 py-3 text-sm outline-none focus:border-[#0d5c63]"
                aria-label="Filter by type"
              >
                <option value="all">All types</option>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#c5d8dc] bg-[#e7f5f4] px-4 py-3 text-sm font-semibold text-[#0d5c63]"
                >
                  <X className="h-4 w-4" /> Clear
                </button>
              ) : (
                <span className="hidden items-center gap-2 rounded-2xl border border-transparent px-4 py-3 text-sm text-[#5b6c74] lg:inline-flex">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </span>
              )}
            </div>
          </div>

          {!ready || isPending ? (
            <ProductSkeleton count={6} />
          ) : filtered.length === 0 ? (
            <div className="surface-card border border-[#c5d8dc] bg-white px-6 py-16 text-center">
              <p className="font-serif text-3xl tracking-[-0.03em]">No slabs match those filters.</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-[#5b6c74]">
                Try another search term, or clear filters to see the full collection again.
              </p>
              <button type="button" onClick={clearFilters} className="btn-primary mt-8">
                Clear filters
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 ${isPending ? "opacity-70" : ""}`}>
              {filtered.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} />
              ))}
            </div>
          )}
        </section>

        <MarketingFooter />
      </main>
    </PageTransition>
  );
}
