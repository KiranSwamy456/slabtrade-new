"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/lib/cart/cart-context";
import { Button } from "@/components/ui/button";

export function CartHeaderButton() {
  const cart = useCart();

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href="/customer/cart" aria-label="View cart">
        <ShoppingCart className="size-5" />

        {cart.totalItems > 0 && (
          <span className="absolute top-0.5 right-0.5 flex size-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] leading-none font-semibold text-white">
            {cart.totalItems > 99 ? "99+" : cart.totalItems}
          </span>
        )}
      </Link>
    </Button>
  );
}
