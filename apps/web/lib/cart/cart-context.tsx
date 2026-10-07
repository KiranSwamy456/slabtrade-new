"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { MarketplaceSlabListing } from "@/services/slab.service";

export type CartItem = {
  slabListingId: string;
  materialName: string;
  unitPrice: number;
  image?: string;
  colorCategory: MarketplaceSlabListing["colorCategory"];
  thickness: MarketplaceSlabListing["thickness"];
  vendorId: string;
  vendorName: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (listing: MarketplaceSlabListing, quantity?: number) => void;
  updateQuantity: (slabListingId: string, quantity: number) => void;
  removeItem: (slabListingId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function storageKey(customerId: string): string {
  return `slabtrade_cart_${customerId}`;
}

export function CartProvider({
  customerId,
  children,
}: {
  customerId: string | null;
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!customerId) {
      setItems([]);
      return;
    }

    try {
      const raw = localStorage.getItem(storageKey(customerId));

      setItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
    } catch {
      setItems([]);
    }
  }, [customerId]);

  useEffect(() => {
    if (!customerId) {
      return;
    }

    try {
      localStorage.setItem(storageKey(customerId), JSON.stringify(items));
    } catch {
      // Ignore storage errors (private browsing, quota, etc.) — cart just won't persist.
    }
  }, [customerId, items]);

  const addItem = (listing: MarketplaceSlabListing, quantity = 1) => {
    setItems((previous) => {
      const existing = previous.find(
        (item) => item.slabListingId === listing.id,
      );

      if (existing) {
        return previous.map((item) =>
          item.slabListingId === listing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [
        ...previous,
        {
          slabListingId: listing.id,
          materialName: listing.materialName,
          unitPrice: listing.unitPrice,
          image: listing.images[0],
          colorCategory: listing.colorCategory,
          thickness: listing.thickness,
          vendorId: listing.vendorId,
          vendorName: listing.vendorName,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (slabListingId: string, quantity: number) => {
    setItems((previous) =>
      quantity <= 0
        ? previous.filter((item) => item.slabListingId !== slabListingId)
        : previous.map((item) =>
            item.slabListingId === slabListingId
              ? { ...item, quantity }
              : item,
          ),
    );
  };

  const removeItem = (slabListingId: string) => {
    setItems((previous) =>
      previous.filter((item) => item.slabListingId !== slabListingId),
    );
  };

  const clear = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addItem,
        updateQuantity,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
