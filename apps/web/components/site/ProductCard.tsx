"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { RevealImage } from "@/components/site/OptimizedImage";
import { enquireHref, productHref, type Product } from "@/lib/products";

const ease = [0.22, 1, 0.36, 1] as const;

interface ProductCardProps {
  product: Product;
  index?: number;
  stagger?: boolean;
}

export function ProductCard({ product, index = 0, stagger = true }: ProductCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="group relative flex flex-col"
      initial={reduceMotion || !stagger ? false : { opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.65, ease, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
    >
      <Link href={productHref(product.slug)} className="surface-card relative aspect-[4/5] overflow-hidden bg-[#d2ecea] sm:aspect-[.82]">
        <RevealImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute top-3 left-3 rounded-xl border border-white/30 bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-[#0d5c63] uppercase backdrop-blur">
          {product.type}
        </span>
        {product.finish ? (
          <span className="absolute bottom-3 left-3 rounded-xl border border-white/25 bg-[#083b40]/70 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-white uppercase backdrop-blur">
            {product.finish}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col pt-4 sm:pt-5">
        <Link href={productHref(product.slug)} className="block">
          <h3 className="font-serif text-xl tracking-[-0.03em] transition group-hover:text-[#0d5c63] sm:text-2xl">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-[#5b6c74]">
            {product.origin} <span className="mx-1.5">·</span> {product.tone}
          </p>
          {product.availability ? (
            <p className="mt-2 text-[12px] font-medium tracking-wide text-[#0d5c63]/80">{product.availability}</p>
          ) : null}
        </Link>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={productHref(product.slug)}
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#c5d8dc] bg-white px-4 py-3 text-sm font-semibold text-[#0d5c63] transition hover:-translate-y-0.5 sm:flex-none"
          >
            View details
          </Link>
          <Link href={enquireHref(product.name)} className="btn-primary !py-3 flex-1 justify-center sm:flex-none">
            Enquire <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function ProductSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[4/5] rounded-3xl bg-[#d2ecea] sm:aspect-[.82]" />
          <div className="mt-4 h-6 w-2/3 rounded-lg bg-[#d2ecea]" />
          <div className="mt-2 h-4 w-1/2 rounded-lg bg-[#e7f5f4]" />
          <div className="mt-4 flex gap-2">
            <div className="h-11 flex-1 rounded-2xl bg-[#e7f5f4]" />
            <div className="h-11 flex-1 rounded-2xl bg-[#d2ecea]" />
          </div>
        </div>
      ))}
    </div>
  );
}
