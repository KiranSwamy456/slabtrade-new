import { Plus_Jakarta_Sans, Syne } from "next/font/google";

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
      {children}
    </div>
  );
}
