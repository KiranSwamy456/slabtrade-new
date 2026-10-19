import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import { ReactLenis } from "lenis/react";

import { CustomCursor } from "@/components/site/CustomCursor";

import "lenis/dist/lenis.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`marketing-canvas min-h-screen text-[#101820] ${jakarta.variable} ${syne.variable}`}>
      <CustomCursor />
      <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
        {children}
      </ReactLenis>
    </div>
  );
}
