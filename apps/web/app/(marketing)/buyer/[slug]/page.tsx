"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { SiteChrome } from "@/components/site/SiteChrome";
import { MarketingFooter } from "@/components/site/MarketingFooter";
import { PageTransition } from "@/components/site/PageTransition";
import { OptimizedImage, RevealImage, SIZE_PRESETS } from "@/components/site/OptimizedImage";
import { enquireHref, getProductBySlug, products, productHref } from "@/lib/products";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ProductDetailPage() {
  const params = useParams<{ slug: string | string[] }>();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const product = getProductBySlug(slug);
  const reduceMotion = useReducedMotion();
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    notFound();
  }

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const related = products
    .filter((item) => item.slug !== product.slug && (item.origin === product.origin || item.type === product.type))
    .slice(0, 3);

  const specs: [string, string][] = [
    ["Finish", product.finish],
    ["Thickness", product.thickness],
    ["Format", product.size],
    ["Availability", product.availability],
    ["Origin", product.origin],
    ["Character", product.tone],
  ];

  const fadeUp = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.65, ease, delay },
  });

  return (
    <PageTransition>
      <main className="min-h-screen text-[#101820]">
        <SiteChrome />

        <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-6 sm:py-10 lg:px-16">
          <Link href="/buyer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0d5c63]">
            <ArrowLeft className="h-4 w-4" /> Back to collection
          </Link>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-16 sm:gap-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:px-16 lg:pb-24">
          <motion.div {...fadeUp(0.05)}>
            <div className="surface-card relative overflow-hidden bg-[#d2ecea]">
              <div className="relative aspect-[4/5] sm:aspect-[.9]">
                <RevealImage
                  key={gallery[activeImage]}
                  src={gallery[activeImage]!}
                  alt={`${product.name} view ${activeImage + 1}`}
                  sizes={SIZE_PRESETS.detail}
                  priority
                  zoomOnHover={false}
                  quality={82}
                />
              </div>
            </div>
            {gallery.length > 1 ? (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {gallery.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border transition sm:h-24 sm:w-20 ${
                      activeImage === index
                        ? "border-[#0d5c63] ring-2 ring-[#0d5c63]/25"
                        : "border-[#c5d8dc] opacity-80 hover:opacity-100"
                    }`}
                  >
                    <OptimizedImage src={src} alt="" sizes="80px" quality={70} className="object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </motion.div>

          <div>
            <motion.div className="flex flex-wrap items-center gap-2" {...fadeUp(0.1)}>
              <p className="label-eyebrow !mb-0">{product.type}</p>
              <span className="rounded-full border border-[#c5d8dc] bg-[#e7f5f4] px-3 py-1 text-[11px] font-semibold text-[#0d5c63]">
                {product.availability}
              </span>
            </motion.div>
            <motion.h1 className="mt-4 font-serif text-[clamp(2.5rem,8vw,4.5rem)] leading-[.95] tracking-[-0.04em]" {...fadeUp(0.18)}>
              {product.name}
            </motion.h1>
            <motion.p className="mt-4 inline-flex flex-wrap items-center gap-2 text-[#5b6c74]" {...fadeUp(0.24)}>
              <MapPin className="h-4 w-4 text-[#0d5c63]" />
              {product.origin}
              <span>·</span>
              {product.tone}
            </motion.p>
            <motion.p className="mt-6 max-w-xl text-base leading-7 text-[#5b6c74] sm:text-lg sm:leading-8" {...fadeUp(0.3)}>
              {product.detail || product.summary}
            </motion.p>

            <motion.div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3" {...fadeUp(0.36)}>
              {specs.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-[#c5d8dc] bg-white/80 p-4">
                  <p className="text-[11px] font-bold tracking-[0.16em] text-[#0d5c63] uppercase">{label}</p>
                  <p className="mt-2 text-sm leading-snug font-medium sm:text-[15px]">{value}</p>
                </div>
              ))}
            </motion.div>

            <motion.div className="mt-8" {...fadeUp(0.4)}>
              <p className="text-[11px] font-bold tracking-[0.16em] text-[#0d5c63] uppercase">Ideal for</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.applications.map((item) => (
                  <span key={item} className="rounded-full border border-[#c5d8dc] bg-white px-3.5 py-1.5 text-sm text-[#5b6c74]">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div className="mt-8 flex flex-wrap gap-3" {...fadeUp(0.44)}>
              <Link href={enquireHref(product.name)} className="btn-primary">
                Enquire about this slab <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/buyer" className="inline-flex items-center justify-center rounded-2xl border border-[#c5d8dc] bg-white px-6 py-3.5 text-sm font-semibold text-[#0d5c63]">
                Browse more
              </Link>
            </motion.div>

            <motion.p className="mt-8 flex items-start gap-2 text-sm text-[#5b6c74]" {...fadeUp(0.48)}>
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#0d5c63]" />
              Verified listing · Direct enquiry · Curated inventory
            </motion.p>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="border-t border-[#c5d8dc] bg-white/50 px-5 py-16 sm:px-6 lg:px-16 lg:py-20">
            <div className="mx-auto max-w-[1440px]">
              <p className="label-eyebrow">You may also like</p>
              <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">Related materials</h2>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {related.map((item) => (
                  <Link key={item.slug} href={productHref(item.slug)} className="surface-card group relative overflow-hidden border border-[#c5d8dc]/70 bg-white">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#d2ecea] sm:aspect-[.82]">
                      <OptimizedImage
                        src={item.image}
                        alt={item.name}
                        sizes={SIZE_PRESETS.related}
                        className="transition duration-700 group-hover:scale-105"
                        quality={75}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl tracking-[-0.03em]">{item.name}</h3>
                      <p className="mt-1 text-sm text-[#5b6c74]">
                        {item.origin} · {item.finish}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <MarketingFooter />
      </main>
    </PageTransition>
  );
}
