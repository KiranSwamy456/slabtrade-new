"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, MapPin, Phone, Printer } from "lucide-react";
import { SiteChrome } from "@/components/site/SiteChrome";
import { MarketingFooter } from "@/components/site/MarketingFooter";
import { PageTransition } from "@/components/site/PageTransition";

const ease = [0.22, 1, 0.36, 1] as const;

const ADDRESS_QUERY = encodeURIComponent("3016 Polar Ln #208, Cedar Park, TX 78613, USA");

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [material, setMaterial] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMaterial(params.get("material") || "");
  }, []);

  const fadeUp = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.7, ease, delay },
  });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.get("email"),
        message: data.get("message"),
        material: data.get("material") || material,
      }),
    });
    setLoading(false);
    setSent(true);
  }

  const defaultMessage = material
    ? `Hi, I'm interested in ${material}. Please share availability, dimensions, and pricing.`
    : "";

  return (
    <PageTransition>
      <main className="min-h-screen text-[#101820]">
        <SiteChrome />
        <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:gap-14 sm:px-6 sm:py-16 lg:grid-cols-[.75fr_1.25fr] lg:px-16 lg:py-24">
          <div>
            <motion.p className="label-eyebrow mb-6" {...fadeUp(0.05)}>
              Contact slabtrade
            </motion.p>
            <motion.h1 className="font-serif text-[clamp(2.75rem,10vw,5.5rem)] leading-[.92] tracking-[-.04em] md:text-7xl lg:text-8xl" {...fadeUp(0.15)}>
              Let&apos;s find
              <br />
              <i className="text-[#0d5c63]">the right fit.</i>
            </motion.h1>
            <motion.p className="mt-6 max-w-md text-base leading-7 text-[#5b6c74] sm:mt-8 sm:text-lg sm:leading-8" {...fadeUp(0.28)}>
              Whether you have a collection to share or a project to source, we&apos;d love to hear from you.
            </motion.p>
            {material ? (
              <motion.p className="mt-6 inline-flex rounded-2xl border border-[#c5d8dc] bg-[#e7f5f4] px-4 py-3 text-sm font-medium text-[#0d5c63]" {...fadeUp(0.34)}>
                Enquiring about: {material}
              </motion.p>
            ) : null}
            <motion.div className="mt-10 space-y-4 text-sm sm:mt-12" {...fadeUp(0.4)}>
              <p className="inline-flex items-center rounded-2xl border border-[#c5d8dc] bg-white/70 px-4 py-3 shadow-sm">
                <MapPin className="mr-3 h-5 w-5 shrink-0 text-[#0d5c63]" />
                <span>
                  Slab Trade LLC
                  <br />
                  3016 Polar Lane, Suite 208
                  <br />
                  Cedar Park, TX 78613
                </span>
              </p>
              <p className="inline-flex items-center rounded-2xl border border-[#c5d8dc] bg-white/70 px-4 py-3 shadow-sm">
                <Phone className="mr-3 h-5 w-5 shrink-0 text-[#0d5c63]" />
                Desk: 512-846-7599
              </p>
              <p className="inline-flex items-center rounded-2xl border border-[#c5d8dc] bg-white/70 px-4 py-3 shadow-sm">
                <Printer className="mr-3 h-5 w-5 shrink-0 text-[#0d5c63]" />
                Fax: 833-261-9955
              </p>
            </motion.div>

            <motion.div className="surface-card mt-6 overflow-hidden border border-[#c5d8dc]/70" {...fadeUp(0.48)}>
              <iframe
                title="Slab Trade office location"
                src={`https://www.google.com/maps?q=${ADDRESS_QUERY}&output=embed`}
                className="h-56 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>

          <motion.div
            className="surface-card border border-[#c5d8dc]/70 bg-[#d7efed] p-6 sm:p-8 md:p-12"
            initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.75, ease, delay: 0.2 }}
          >
            <p className="mb-8 font-serif text-3xl tracking-[-0.03em]">Tell us a little more.</p>
            {sent ? (
              <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0d5c63] text-[#6fc4bf]">
                  <Check />
                </span>
                <h2 className="font-serif text-4xl tracking-[-0.03em]">Message received.</h2>
                <p className="mt-3 text-[#5b6c74]">We&apos;ll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                {material ? <input type="hidden" name="material" value={material} /> : null}
                <input
                  required
                  name="name"
                  placeholder="Your name"
                  className="w-full rounded-xl border border-[#b7d0d3] bg-white/70 px-4 py-4 outline-none transition placeholder:text-[#5b6c74] focus:border-[#0d5c63] focus:ring-2 focus:ring-[#0d5c63]/15"
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="w-full rounded-xl border border-[#b7d0d3] bg-white/70 px-4 py-4 outline-none transition placeholder:text-[#5b6c74] focus:border-[#0d5c63] focus:ring-2 focus:ring-[#0d5c63]/15"
                />
                <textarea
                  required
                  name="message"
                  key={material || "blank"}
                  defaultValue={defaultMessage}
                  placeholder="What are you working on?"
                  rows={5}
                  className="w-full resize-none rounded-xl border border-[#b7d0d3] bg-white/70 px-4 py-4 outline-none transition placeholder:text-[#5b6c74] focus:border-[#0d5c63] focus:ring-2 focus:ring-[#0d5c63]/15"
                />
                <button disabled={loading} className="btn-primary mt-2 w-full justify-center disabled:opacity-60 sm:w-auto">
                  {loading ? "Sending…" : "Send enquiry"} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </motion.div>
        </section>
        <MarketingFooter />
      </main>
    </PageTransition>
  );
}
