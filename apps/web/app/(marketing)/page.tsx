"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Menu,
  MoveUpRight,
  Play,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  featuredProducts,
  heroImage,
  enquireHref,
  products,
  productHref,
  sellerShowcaseImage,
  storyImage,
  testimonials,
  trustPoints,
} from "@/lib/products";
import { LogoMark } from "@/components/site/MarketingLogo";
import { MarketingFooter } from "@/components/site/MarketingFooter";
import { HeroBackgroundImage, OptimizedImage, SIZE_PRESETS } from "@/components/site/OptimizedImage";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "For sellers", href: "/seller" },
  { label: "For buyers", href: "/buyer" },
  { label: "Contact us", href: "/contact" },
];

const buyerSteps: [string, string][] = [
  [
    "Register your company",
    "Add your company details, a contact person, and phone number so our team and sellers can reach you easily for orders and shipping.",
  ],
  [
    "Search and filter",
    "Browse stone by country, product type — granite, marble, quartzite, quartz and more — quality, and material.",
  ],
  [
    "Cart, wishlist, or request a sample",
    "Use Add to Cart, Add to Wishlist, and Request a Sample to move fast. One container holds slabs from a single supplier, so plan your load for efficient, cost-effective shipping.",
  ],
];

const sellerSteps: [string, string][] = [
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
    "When a buyer places an order you'll get a notification in your dashboard. Review the details, confirm slab availability, arrange packing and shipping, and keep the order status updated.",
  ],
];

const sellerBenefits = [
  "A storefront that feels as considered as your stone.",
  "A direct line to people already looking for the right material.",
  "Tools that make sharing your collection simple.",
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"buyers" | "sellers">("buyers");
  const [showTop, setShowTop] = useState(false);
  const reduceMotion = useReducedMotion();
  const closeMenu = () => setMenuOpen(false);
  const homeSlabs = featuredProducts;
  const featuredHeroSlab = (products[1] ?? products[0])!;
  const inventoryCount = products.length;

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const steps = activeTab === "buyers" ? buyerSteps : sellerSteps;

  return (
    <main className="min-h-screen overflow-hidden text-[#20201d]">
      <nav className="absolute top-0 right-0 left-0 z-30 px-4 pt-4 lg:px-8">
        <div className="glass-nav mx-auto flex h-[4.25rem] max-w-[1440px] items-center justify-between rounded-2xl px-5 lg:px-8">
          <a href="#home" className="group flex items-center gap-3" onClick={closeMenu}>
            <LogoMark className="h-9 w-9 ring-1 ring-white/20" />
            <span className="font-serif text-xl tracking-[-0.04em] text-white">
              slab<span className="text-[#6fc4bf]">trade</span>
            </span>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-[#6fc4bf] ${index === 0 ? "text-white" : "text-white/65"}`}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-2xl px-4 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white">
              Sign in
            </Link>
            <Link href="/register" className="btn-soft !px-5 !py-2.5">
              Sign up <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <button aria-label="Open menu" className="text-white md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="glass-nav mx-auto mt-2 max-w-[1440px] rounded-2xl p-3 md:hidden">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} onClick={closeMenu} className="block rounded-xl px-4 py-3 text-white/80 transition hover:bg-white/10 hover:pl-6">
                {item.label}
              </a>
            ))}
            <Link href="/register" onClick={closeMenu} className="btn-soft mt-2 w-full">
              Sign up <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#262721] px-5 pt-28 pb-16 sm:min-h-[760px] sm:px-6 sm:pt-36 sm:pb-20 lg:min-h-[860px] lg:px-16 lg:pb-24">
        <HeroBackgroundImage src={heroImage} alt="Calacatta Oceana natural stone slab" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,59,64,.96)_0%,rgba(8,59,64,.78)_50%,rgba(8,59,64,.28)_100%)] sm:bg-[linear-gradient(105deg,rgba(8,59,64,.95)_0%,rgba(8,59,64,.72)_46%,rgba(8,59,64,.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,59,64,.9),transparent_58%)]" />
        <div className="pointer-events-none absolute top-24 -right-20 h-72 w-72 rounded-full bg-[#6fc4bf]/20 blur-3xl" />

        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,420px)] lg:gap-14">
          <div className="max-w-2xl">
            <motion.div className="mb-6 flex items-center gap-3 text-[11px] font-bold tracking-[0.22em] text-[#6fc4bf] uppercase sm:mb-8" {...fadeUp(0.1)}>
              <motion.span
                className="h-px origin-left bg-[#6fc4bf]"
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: 40 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.2, ease }}
              />
              The better way to buy stone
            </motion.div>

            <motion.h1 className="max-w-3xl font-serif text-[clamp(2.6rem,11vw,6.8rem)] leading-[.92] tracking-[-.05em] text-white" {...fadeUp(0.2)}>
              Find the slab
              <br />
              <i className="text-[#6fc4bf]">behind the vision.</i>
            </motion.h1>

            <motion.p className="mt-6 max-w-lg text-base leading-7 text-white/70 sm:mt-8 sm:text-lg sm:leading-8" {...fadeUp(0.35)}>
              A more thoughtful marketplace for exceptional natural stone. Discover, compare, and connect directly with trusted suppliers.
            </motion.p>

            <motion.div className="mt-8 flex flex-wrap gap-3 sm:mt-10" {...fadeUp(0.48)}>
              <motion.a
                href="#buyers"
                className="btn-soft"
                initial="rest"
                whileHover={reduceMotion ? undefined : "hover"}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                variants={{ rest: { y: 0, scale: 1 }, hover: { y: -4, scale: 1.02 } }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                Explore slabs
                <motion.span className="inline-flex" variants={{ rest: { x: 0 }, hover: { x: 5 } }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </motion.a>
              <motion.a
                href="#how-it-works"
                className="btn-ghost"
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/15">
                  <Play className="h-3 w-3 fill-white" />
                </span>
                How it works
              </motion.a>
            </motion.div>

            <motion.p
              className="mt-7 max-w-xl text-[12px] font-medium leading-relaxed tracking-wide text-white/55 sm:mt-8 sm:text-sm"
              {...fadeUp(0.58)}
            >
              Verified slabs · Direct enquiry · Curated inventory
            </motion.p>
          </div>

          <motion.div className="hidden w-full max-w-md justify-self-end lg:block" {...fadeUp(0.45)}>
            <Link
              href={productHref(featuredHeroSlab.slug)}
              className="group relative block overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,.35)] backdrop-blur-md"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <OptimizedImage
                  src={featuredHeroSlab.image}
                  alt={featuredHeroSlab.name}
                  fill
                  sizes="(max-width: 1024px) 0px, 420px"
                  priority
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(8,59,64,.92)_100%)]" />
                <div className="absolute top-5 left-5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.16em] text-white uppercase backdrop-blur-md">
                  Featured
                </div>
                <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                  <p className="text-[11px] font-bold tracking-[0.18em] text-[#6fc4bf] uppercase">
                    {featuredHeroSlab.type} · {featuredHeroSlab.origin}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl leading-none tracking-[-.03em]">
                    {featuredHeroSlab.name}
                  </h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/70">
                    {featuredHeroSlab.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-[#6fc4bf] uppercase transition group-hover:gap-3">
                    View slab
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
            <div className="mt-4 flex items-center justify-between gap-4 px-1 text-white/65">
              <p className="text-sm">
                <span className="font-serif text-2xl text-white">{inventoryCount}</span>
                <span className="text-[#6fc4bf]">+</span>
                <span className="ml-2 text-[12px] font-medium tracking-wide">slabs curated</span>
              </p>
              <motion.a
                href="#buyers"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] text-[#6fc4bf] uppercase"
                animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
                transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                Explore
                <ChevronDown className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-b border-[#c5d8dc]/80 bg-white/70">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-[#c5d8dc]/60 sm:grid-cols-4">
          {trustPoints.map((item, index) => (
            <motion.div key={item.label} className="bg-[#f3faf9] px-5 py-8 sm:px-8 sm:py-10" {...reveal(index * 0.06)}>
              <p className="font-serif text-3xl tracking-[-0.03em] text-[#0d5c63] sm:text-4xl">{item.value}</p>
              <p className="mt-2 text-[11px] font-bold tracking-[0.16em] text-[#101820] uppercase">{item.label}</p>
              <p className="mt-2 text-sm text-[#5b6c74]">{item.note}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Collection */}
      <section id="buyers" className="mx-auto max-w-[1440px] px-6 py-24 lg:px-16 lg:py-32">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.div {...reveal(0)}>
            <p className="label-eyebrow mb-4">The collection</p>
            <h2 className="max-w-xl font-serif text-5xl leading-[.95] tracking-[-.04em] md:text-6xl lg:text-7xl">
              Materials with
              <br />
              <i className="text-[#0d5c63]">a point of view.</i>
            </h2>
          </motion.div>
          <motion.div {...reveal(0.12)}>
            <Link href="/buyer" className="group inline-flex items-center text-sm font-semibold text-[#0d5c63]">
              View all materials
              <MoveUpRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {homeSlabs.map((slab, index) => (
            <motion.article
              key={slab.slug}
              className={`surface-card group relative flex flex-col ${index === 0 ? "md:translate-y-8" : ""}`}
              {...revealScale(index * 0.12)}
              whileHover={reduceMotion ? undefined : { y: -8 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.75, ease, delay: index * 0.12 }}
            >
              <Link href={productHref(slab.slug)} className="relative aspect-[4/5] overflow-hidden bg-[#d2ecea] sm:aspect-[.76]">
                <motion.div
                  className="absolute inset-0"
                  initial={reduceMotion ? false : { opacity: 0, scale: 1.12 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 1.1, ease, delay: index * 0.08 }}
                  whileHover={reduceMotion ? undefined : { scale: 1.05, transition: { duration: 0.75, ease } }}
                >
                  <OptimizedImage src={slab.image} alt={slab.name} sizes={SIZE_PRESETS.card} quality={78} />
                </motion.div>
              </Link>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <Link href={productHref(slab.slug)}>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <p className="font-serif text-xl tracking-[-0.03em] sm:text-2xl">{slab.name}</p>
                    <span className="shrink-0 rounded-xl border border-[#c5d8dc] bg-[#e7f5f4] px-2.5 py-1 text-[10px] font-semibold tracking-widest text-[#0d5c63] uppercase">{slab.type}</span>
                  </div>
                  <p className="text-sm text-[#5b6c74]">
                    {slab.origin} <span className="mx-2">·</span> {slab.tone}
                  </p>
                  <p className="mt-2 text-[12px] font-medium text-[#0d5c63]/80">
                    {slab.finish} · {slab.availability}
                  </p>
                </Link>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={productHref(slab.slug)} className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#c5d8dc] bg-white px-4 py-3 text-sm font-semibold text-[#0d5c63] sm:flex-none">
                    View details
                  </Link>
                  <Link href={enquireHref(slab.name)} className="btn-primary !py-3 flex-1 justify-center sm:flex-none">
                    Enquire <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Material story */}
      <section className="relative overflow-hidden bg-[#083b40] px-6 py-24 text-white lg:px-16 lg:py-28">
        <div className="pointer-events-none absolute top-0 -right-24 h-80 w-80 rounded-full bg-[#6fc4bf]/15 blur-3xl" />
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div className="relative order-2 overflow-hidden rounded-[1.75rem] lg:order-1" {...revealScale(0)}>
            <div className="relative aspect-[5/4] sm:aspect-[4/3]">
              <OptimizedImage src={storyImage} alt="Close detail of colonial white natural stone" sizes={SIZE_PRESETS.showcase} quality={80} />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,59,64,.45),transparent_50%)]" />
          </motion.div>
          <motion.div className="order-1 lg:order-2" {...reveal(0.1)}>
            <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-[#6fc4bf] uppercase">Material story</p>
            <h2 className="max-w-lg font-serif text-4xl leading-[.95] tracking-[-.04em] sm:text-5xl md:text-6xl">
              Stone is chosen
              <br />
              <i className="text-[#6fc4bf]">by character, not by chance.</i>
            </h2>
            <p className="mt-7 max-w-md text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              Every listing starts with origin, finish, and movement — the details that decide whether a slab belongs in a quiet bath or a statement kitchen. We present materials the way designers shortlist them: clearly, carefully, and without noise.
            </p>
            <Link href="/buyer" className="btn-soft mt-9 inline-flex">
              Browse the collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative overflow-hidden bg-[#25261f] px-6 py-24 text-[#f4f1eb] lg:px-16 lg:py-28">
        <div className="pointer-events-none absolute top-10 -left-24 h-64 w-64 rounded-full bg-[#6fc4bf]/10 blur-3xl" />
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
            <motion.div {...reveal(0)}>
              <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-[#6fc4bf] uppercase">Built for both sides</p>
              <h2 className="font-serif text-5xl leading-[.95] tracking-[-.04em] md:text-6xl lg:text-7xl">
                A simpler path
                <br />
                <i className="text-[#6fc4bf]">to something rare.</i>
              </h2>
              <p className="mt-7 max-w-md leading-7 text-white/60">
                Whether you&apos;re sourcing for a once-in-a-lifetime home or representing a quarry&apos;s finest work, slabtrade brings the right people together.
              </p>
              <div className="mt-9 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab("buyers")}
                  className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${activeTab === "buyers" ? "bg-white text-[#083b40]" : "border border-white/20 text-white/70 hover:border-white/40"}`}
                >
                  I&apos;m a buyer
                </button>
                <button
                  onClick={() => setActiveTab("sellers")}
                  className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${activeTab === "sellers" ? "bg-white text-[#083b40]" : "border border-white/20 text-white/70 hover:border-white/40"}`}
                >
                  I&apos;m a seller
                </button>
              </div>
            </motion.div>

            <div className="grid gap-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
              {steps.map(([title, copy], index) => (
                <motion.div
                  key={`${activeTab}-${title}`}
                  className="flex gap-7 border-b border-white/10 px-6 py-7 last:border-b-0"
                  initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease, delay: index * 0.1 }}
                >
                  <span className="font-serif text-2xl text-[#6fc4bf]">0{index + 1}</span>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold tracking-[-0.02em]">{title}</h3>
                    <p className="max-w-md text-sm leading-6 text-white/55">{copy}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sellers */}
      <section id="sellers" className="mx-auto max-w-[1440px] px-6 py-24 lg:px-16 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <motion.div className="relative overflow-hidden rounded-[1.75rem]" {...revealScale(0)}>
            <div className="relative aspect-[4/5] sm:aspect-[.9]">
              <OptimizedImage src={sellerShowcaseImage} alt="Carrara gold stone close-up" sizes={SIZE_PRESETS.showcase} quality={80} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(8,59,64,.88)_100%)]" />
              <div className="absolute right-0 bottom-0 left-0 p-8 text-white md:p-10">
                <Sparkles className="mb-5 h-6 w-6 text-[#6fc4bf]" />
                <h2 className="max-w-md font-serif text-4xl leading-[.95] tracking-[-.04em] md:text-5xl">
                  Good stone deserves a <i className="text-[#6fc4bf]">good story.</i>
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
                  Build a home for your collection and let the quality of your work speak to the people looking for it.
                </p>
                <Link href="/seller" className="btn-soft mt-7 inline-flex">
                  Become a seller <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          <div>
            <motion.div {...reveal(0.08)}>
              <p className="label-eyebrow mb-4">For suppliers</p>
              <h2 className="font-serif text-5xl leading-[.95] tracking-[-.04em] md:text-6xl">
                Your inventory,
                <br />
                <i className="text-[#0d5c63]">beautifully seen.</i>
              </h2>
            </motion.div>
            <div className="mt-10 space-y-4">
              {sellerBenefits.map((text, index) => (
                <motion.div key={text} className="flex gap-4 rounded-2xl border border-[#c5d8dc] bg-white/70 px-5 py-4 text-sm shadow-sm backdrop-blur" {...reveal(0.15 + index * 0.1)}>
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#0d5c63]" />
                  {text}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voices */}
      <section className="border-y border-[#c5d8dc]/80 bg-[#e7f5f4]/50 px-6 py-24 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <motion.div className="mb-12 max-w-2xl" {...reveal(0)}>
            <p className="label-eyebrow mb-4">From the field</p>
            <h2 className="font-serif text-4xl leading-[.95] tracking-[-.04em] sm:text-5xl md:text-6xl">
              Chosen with care.
              <br />
              <i className="text-[#0d5c63]">Remembered for longer.</i>
            </h2>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {testimonials.map((item, index) => (
              <motion.blockquote key={item.name} className="flex h-full flex-col rounded-[1.5rem] border border-[#c5d8dc] bg-white/80 p-7 sm:p-8" {...reveal(0.08 + index * 0.1)}>
                <p className="flex-1 text-base leading-7 text-[#5b6c74]">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-8 border-t border-[#c5d8dc]/80 pt-5">
                  <p className="font-semibold text-[#101820]">{item.name}</p>
                  <p className="mt-1 text-sm text-[#5b6c74]">{item.role}</p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative overflow-hidden bg-[#0d5c63] px-6 py-24 text-white lg:px-16 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(111,196,191,.35),transparent_55%)]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-[70%] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-[1440px] text-center">
          <motion.div {...reveal(0)}>
            <ShieldCheck className="mx-auto mb-6 h-8 w-8 text-[#6fc4bf]" />
            <p className="mb-5 text-[11px] font-bold tracking-[0.2em] text-[#6fc4bf] uppercase">Start a conversation</p>
          </motion.div>
          <motion.h2 className="mx-auto max-w-3xl font-serif text-5xl leading-[.92] tracking-[-.04em] md:text-7xl lg:text-8xl" {...reveal(0.1)}>
            The right stone
            <br />
            <i className="text-[#6fc4bf]">is out there.</i>
          </motion.h2>
          <motion.p className="mx-auto mt-7 max-w-md leading-7 text-white/65" {...reveal(0.2)}>
            Tell us what you&apos;re working on. We&apos;ll help you find the material to make it memorable.
          </motion.p>
          <motion.div {...reveal(0.3)}>
            <motion.div whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }} className="mt-9 inline-block">
              <Link href="/contact" className="btn-soft">
                Talk to our team <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <MarketingFooter />

      {showTop && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
          className="fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d5c63] text-white shadow-[0_16px_36px_-14px_rgba(13,92,99,.7)]"
          initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={reduceMotion ? undefined : { y: -3, scale: 1.06 }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </main>
  );
}
