import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/seller", label: "Seller" },
  { href: "/buyer", label: "Buyer" },
  { href: "/contact", label: "Contact Us" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:py-14">
        <Image
          src="/images/logo.png"
          alt="Slab Trade"
          width={1743}
          height={743}
          className="h-7 w-auto"
        />

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-slate-500">
          © 2026 Slab Trade. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
