import Image from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen grid-cols-2 bg-slate-50 max-[900px]:grid-cols-1">
      <section className="relative flex flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white max-[900px]:min-h-[360px] max-[900px]:p-8 max-[500px]:min-h-[320px] max-[500px]:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[180px] -right-[180px] size-[500px] rounded-full bg-blue-500/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[180px] -left-[180px] size-[400px] rounded-full bg-sky-500/10 blur-3xl"
        />

        <div className="relative z-10">
          <Image
            src="/images/logo.png"
            alt="Slab Trade"
            width={1743}
            height={743}
            priority
            className="h-10 w-auto"
          />
        </div>

        <Reveal className="relative z-10 max-w-[520px]">
          <p className="mb-5 text-xs font-semibold tracking-[2px] text-blue-400">
            SLAB TRADE
          </p>

          <h2 className="text-[clamp(42px,5vw,68px)] leading-[1.05] tracking-[-2px] max-[900px]:text-[42px]">
            Trade smarter.
            <br />
            Build better.
          </h2>

          <p className="my-7 max-w-[460px] text-[17px] leading-relaxed text-slate-300 max-[500px]:text-[15px]">
            A secure marketplace built for modern businesses, sellers, and
            customers.
          </p>

          <div className="flex flex-col gap-3.5 max-[500px]:gap-2.5">
            <div className="flex items-center gap-2.5 text-sm text-slate-200">
              <span className="font-bold text-blue-400">✓</span>
              Secure authentication
            </div>

            <div className="flex items-center gap-2.5 text-sm text-slate-200">
              <span className="font-bold text-blue-400">✓</span>
              Trusted marketplace
            </div>

            <div className="flex items-center gap-2.5 text-sm text-slate-200">
              <span className="font-bold text-blue-400">✓</span>
              Simple and secure trading
            </div>
          </div>
        </Reveal>

        <p className="relative z-10 text-xs text-slate-500 max-[900px]:hidden">
          © 2026 Slab Trade
        </p>
      </section>

      <section className="flex items-center justify-center bg-white p-10 max-[900px]:p-8 max-[900px]:px-5 max-[500px]:p-6 max-[500px]:px-4">
        <Reveal delay={0.1} className="w-full max-w-[460px]">
          {children}
        </Reveal>
      </section>
    </main>
  );
}
