"use client";

import { ArrowRight, ChevronUp, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { BrandWordmark, LogoMark } from "@/components/site/MarketingLogo";

const links: [string, string][] = [
  ["For sellers", "/seller"],
  ["For buyers", "/buyer"],
  ["Contact us", "/contact"],
];

export function SiteChrome({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b px-5 py-4 backdrop-blur-xl sm:px-6 lg:px-16 ${
          dark
            ? "border-white/10 bg-[#083b40]/85 text-white"
            : "border-[#c5d8dc]/70 bg-white/75 text-[#101820]"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark className="h-9 w-9 shadow-[0_10px_24px_-12px_rgba(13,92,99,.7)]" />
            <BrandWordmark dark={dark} />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium opacity-65 transition hover:-translate-y-0.5 hover:opacity-100"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-2xl px-4 py-2.5 text-sm font-medium opacity-65 transition hover:opacity-100">
              Sign in
            </Link>
            <Link href="/register" className="btn-primary !py-2.5 !px-5">
              Sign up <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button className="md:hidden" aria-label="Open navigation" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className={`mt-4 space-y-1 rounded-2xl p-3 md:hidden ${dark ? "bg-white/10" : "bg-[#e7f5f4]"}`}>
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm transition hover:pl-5"
              >
                {label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm transition hover:pl-5">
              Sign in
            </Link>
            <Link href="/register" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              Sign up
            </Link>
          </div>
        )}
      </header>

      {showTop && (
        <motion.button
          type="button"
          aria-label="Go to top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
          className="fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d5c63] text-white shadow-[0_16px_36px_-14px_rgba(13,92,99,.7)]"
          initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={reduceMotion ? undefined : { y: -3, scale: 1.05 }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </>
  );
}
