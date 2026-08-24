"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteChrome } from "@/components/site/SiteChrome";
import { MarketingFooter } from "@/components/site/MarketingFooter";
import { PageTransition } from "@/components/site/PageTransition";
import { RevealImage, SIZE_PRESETS } from "@/components/site/OptimizedImage";
import { sellerShowcaseImage } from "@/lib/products";

const sellerProcess: [string, string][] = [
  [
    "Register your company",
    "Fill in your company information with all the details along with a contact person and phone number, so it's easy to reach you for material, orders, and shipping.",
  ],
  [
    "List your inventory",
    "Once your account is activated, create products in any color and quantity from your dashboard, add deal slabs when running promotions, and upload a picture and inspection report for every bundle.",
  ],
  [
    "Process every order",
    "When a buyer places an order you'll get a notification in your dashboard. Review the details, confirm slab availability, arrange packing and shipping, and keep the order status updated so buyers can track progress.",
  ],
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function SellerPage() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.7, ease, delay },
  });

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.7, ease, delay },
  });

  const revealScale = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 40, scale: 0.97 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.2 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.75, ease, delay },
  });

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#083b40] text-[#f3f7f8]">
        <SiteChrome dark />

        <section className="relative mx-auto grid max-w-[1440px] gap-14 overflow-hidden px-6 py-20 lg:grid-cols-[.9fr_1.1fr] lg:px-16 lg:py-28">
          <div className="pointer-events-none absolute top-10 -left-24 h-72 w-72 rounded-full bg-[#6fc4bf]/15 blur-3xl" />
          <div className="relative z-10">
            <motion.p className="mb-7 text-[11px] font-bold tracking-[0.22em] text-[#6fc4bf] uppercase" {...fadeUp(0.05)}>
              For stone suppliers
            </motion.p>
            <motion.h1 className="max-w-2xl font-serif text-6xl leading-[.92] tracking-[-.04em] md:text-7xl lg:text-8xl" {...fadeUp(0.15)}>
              Make your
              <br />
              <i className="text-[#6fc4bf]">best work</i> visible.
            </motion.h1>
            <motion.p className="mt-8 max-w-lg text-lg leading-8 text-white/65" {...fadeUp(0.3)}>
              A beautiful digital home for your inventory. Meet the people looking for exactly what you have.
            </motion.p>
            <motion.div {...fadeUp(0.42)}>
              <motion.div whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} className="mt-10 inline-block">
                <Link href="/register" className="btn-soft">
                  Start a conversation <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <motion.div className="surface-card relative min-h-[430px] overflow-hidden" {...revealScale(0.2)}>
            <RevealImage src={sellerShowcaseImage} alt="Stone supplier showroom detail" sizes={SIZE_PRESETS.showcase} priority zoomOnHover />
            <div className="absolute bottom-6 left-6 z-10 rounded-2xl border border-white/40 bg-white/85 px-4 py-3 text-[11px] font-bold tracking-[0.16em] text-[#083b40] uppercase backdrop-blur">
              Your collection
              <br />
              deserves a stage
            </div>
          </motion.div>
        </section>

        <section className="bg-[#f3f7f8] px-6 py-20 text-[#101820] lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <motion.p className="label-eyebrow mb-4" {...reveal(0)}>
              How it works
            </motion.p>
            <motion.h2 className="mb-10 max-w-xl font-serif text-4xl leading-[.95] tracking-[-.04em] sm:text-5xl" {...reveal(0.05)}>
              From registration to a shipped order.
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-3">
              {sellerProcess.map(([title, copy], index) => (
                <motion.div
                  key={title}
                  className="surface-card group border border-[#c5d8dc]/80 bg-white p-7"
                  {...reveal(index * 0.12)}
                  whileHover={reduceMotion ? undefined : { y: -8 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease, delay: index * 0.12 }}
                >
                  <span className="font-serif text-3xl text-[#0d5c63]">0{index + 1}</span>
                  <h3 className="mt-6 font-serif text-2xl leading-tight tracking-[-0.03em]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5b6c74]">{copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-6 py-20 text-center lg:px-16 lg:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(111,196,191,.12),transparent_55%)]" />
          <motion.div {...reveal(0)}>
            <Sparkles className="mx-auto mb-5 h-7 w-7 text-[#6fc4bf]" />
          </motion.div>
          <motion.h2 className="relative font-serif text-5xl tracking-[-.04em] md:text-6xl lg:text-7xl" {...reveal(0.1)}>
            Bring your stone
            <br />
            <i className="text-[#6fc4bf]">to the right people.</i>
          </motion.h2>
          <motion.div {...reveal(0.2)}>
            <motion.div whileHover={reduceMotion ? undefined : { x: 4 }} className="relative mt-8 inline-block">
              <Link href="/contact" className="inline-flex items-center text-sm font-semibold text-[#6fc4bf]">
                Talk to us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </section>
        <MarketingFooter />
      </main>
    </PageTransition>
  );
}
