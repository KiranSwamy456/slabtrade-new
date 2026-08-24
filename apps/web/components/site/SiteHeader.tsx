"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/seller", label: "Seller" },
  { href: "/buyer", label: "Buyer" },
  { href: "/contact", label: "Contact Us" },
];

function NavLinks({
  className,
  linkClassName,
  activeClassName,
  onNavigate,
}: {
  className?: string;
  linkClassName?: string;
  activeClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "text-sm font-semibold tracking-wide transition-colors",
              linkClassName,
              isActive && activeClassName,
            )}
          >
            {link.label.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all",
        scrolled
          ? "border-white/10 bg-slate-900/95 shadow-lg shadow-slate-900/20 backdrop-blur-md"
          : "border-transparent bg-slate-900",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/logo.png"
            alt="Slab Trade"
            width={1743}
            height={743}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <NavLinks
          className="hidden items-center gap-7 lg:flex"
          linkClassName="text-slate-300 hover:text-white"
          activeClassName="text-white"
        />

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search products..."
              className="h-9 w-56 border-white/15 bg-white/5 pl-9 text-white placeholder:text-slate-400 focus-visible:border-blue-400 lg:w-64"
            />
          </div>

          <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Sign up</Link>
          </Button>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto text-white hover:bg-white/10 hover:text-white md:hidden"
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-6 px-4 pb-6">
              <NavLinks
                className="flex flex-col gap-4"
                linkClassName="text-slate-700 hover:text-blue-600"
                activeClassName="text-blue-600"
                onNavigate={() => setMobileOpen(false)}
              />

              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="h-9 pl-9"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button asChild variant="outline">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
