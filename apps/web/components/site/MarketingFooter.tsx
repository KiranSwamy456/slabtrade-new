import Link from "next/link";
import { BrandWordmark, LogoMark } from "@/components/site/MarketingLogo";

const footerLinks: [string, string][] = [
  ["Home", "/"],
  ["For buyers", "/buyer"],
  ["For sellers", "/seller"],
  ["Contact", "/contact"],
];

export function MarketingFooter({ dark = true }: { dark?: boolean }) {
  return (
    <footer
      className={`px-5 py-10 sm:px-6 lg:px-16 ${
        dark ? "bg-[#083b40] text-white/55" : "border-t border-[#c5d8dc] bg-white text-[#5b6c74]"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-3">
            <LogoMark className="h-9 w-9 shadow-[0_10px_24px_-12px_rgba(13,92,99,.7)]" />
            <BrandWordmark
              dark={dark}
              className={`font-serif text-xl tracking-[-0.04em] ${dark ? "text-white" : "text-[#101820]"}`}
            />
          </Link>
          <p className="mt-4 text-sm leading-6">
            A curated marketplace for exceptional natural stone — for buyers, designers, and suppliers.
          </p>
          <Link
            href="/contact"
            className={`mt-4 inline-block text-sm font-semibold ${dark ? "text-[#6fc4bf]" : "text-[#0d5c63]"}`}
          >
            Get in touch
          </Link>
        </div>

        <nav className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:grid-cols-4 md:flex md:gap-8">
          {footerLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`font-medium transition hover:opacity-100 ${
                dark ? "text-white/70 hover:text-white" : "text-[#101820]/70 hover:text-[#0d5c63]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div
        className={`mx-auto mt-10 flex max-w-[1440px] flex-col justify-between gap-3 border-t pt-6 text-sm md:flex-row md:items-center ${
          dark ? "border-white/10" : "border-[#c5d8dc]"
        }`}
      >
        <span>© 2026 slabtrade. For the makers of beautiful spaces.</span>
        <span>Made for material people.</span>
      </div>
    </footer>
  );
}
