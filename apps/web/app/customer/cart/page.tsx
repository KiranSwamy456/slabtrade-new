"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

/* eslint-disable @next/next/no-img-element -- images are served from the API's /uploads path, not next/image's domains */

import { useAuthGuard } from "@/lib/auth/auth-guard";
import { authStorage } from "@/lib/auth/auth-storage";
import { useCart } from "@/lib/cart/cart-context";
import { getSlabImageUrl } from "@/services/slab.service";
import { orderService, type PaymentMethod } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const PAYMENT_METHOD_OPTIONS: {
  value: PaymentMethod;
  label: string;
  hint: string;
}[] = [
  {
    value: "COD",
    label: "Cash on Delivery",
    hint: "Pay in cash when your order arrives.",
  },
  {
    value: "UPI",
    label: "UPI",
    hint: "Pay via UPI — details shared after the order is confirmed.",
  },
];

type ShippingFormData = {
  shippingName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
};

const INITIAL_SHIPPING: ShippingFormData = {
  shippingName: "",
  shippingPhone: "",
  shippingAddressLine1: "",
  shippingAddressLine2: "",
  shippingCity: "",
  shippingState: "",
  shippingPostalCode: "",
  shippingCountry: "",
};

export default function CartPage() {
  const { user } = useAuthGuard({ allowedRoles: ["customer"] });
  const cart = useCart();
  const router = useRouter();

  const [shipping, setShipping] = useState<ShippingFormData>(INITIAL_SHIPPING);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [loading, setLoading] = useState(false);

  const handleChange = <Field extends keyof ShippingFormData>(
    field: Field,
    value: string,
  ) => {
    setShipping((previous) => ({ ...previous, [field]: value }));
  };

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cart.items.length === 0) {
      toast.error("Your cart is empty", {
        description: "Add some slabs before placing an order.",
      });
      return;
    }

    const requiredFields: (keyof ShippingFormData)[] = [
      "shippingName",
      "shippingPhone",
      "shippingAddressLine1",
      "shippingCity",
      "shippingState",
      "shippingPostalCode",
      "shippingCountry",
    ];

    const missing = requiredFields.some((field) => !shipping[field].trim());

    if (missing) {
      toast.error("Please complete the shipping details", {
        description: "All fields except address line 2 are required.",
      });
      return;
    }

    setLoading(true);

    try {
      const accessToken = authStorage.getAccessToken();

      if (!accessToken) {
        toast.error("Authentication required", {
          description: "Please sign in again.",
        });
        return;
      }

      const response = await orderService.placeOrder(
        {
          items: cart.items.map((item) => ({
            slabListingId: item.slabListingId,
            quantity: item.quantity,
          })),
          paymentMethod,
          shippingName: shipping.shippingName,
          shippingPhone: shipping.shippingPhone,
          shippingAddressLine1: shipping.shippingAddressLine1,
          shippingAddressLine2: shipping.shippingAddressLine2 || undefined,
          shippingCity: shipping.shippingCity,
          shippingState: shipping.shippingState,
          shippingPostalCode: shipping.shippingPostalCode,
          shippingCountry: shipping.shippingCountry,
        },
        accessToken,
      );

      cart.clear();

      toast.success("Order placed", {
        description: `Your order ${response.data.orderNumber} has been placed — pay via ${
          paymentMethod === "COD" ? "cash on delivery" : "UPI"
        }.`,
      });

      router.push("/customer/orders");
    } catch (error) {
      toast.error("Failed to place order", {
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Your Cart</h2>
        <p className="mt-1 text-slate-500">
          Review your slabs, choose a payment method, and place your order.
        </p>
      </div>

      {cart.items.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 border border-slate-200 py-16 text-center shadow-sm ring-0">
          <ShoppingBag className="size-8 text-slate-300" />
          <p className="text-sm font-semibold text-slate-900">
            Your cart is empty
          </p>
          <p className="text-sm text-slate-500">
            Browse slabs and add some to your cart to get started.
          </p>
        </Card>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="w-full gap-0 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-0">
            {cart.items.map((item) => (
              <div
                key={item.slabListingId}
                className="flex items-center gap-3 p-4"
              >
                <div className="size-16 shrink-0 overflow-hidden rounded-md bg-slate-50">
                  {item.image ? (
                    <img
                      src={getSlabImageUrl(item.image)}
                      alt={item.materialName}
                      className="size-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.materialName}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {item.vendorName} · {item.colorCategory} · {item.thickness}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    ${item.unitPrice.toFixed(2)}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      / slab
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      cart.updateQuantity(
                        item.slabListingId,
                        item.quantity - 1,
                      )
                    }
                  >
                    <Minus className="size-3.5" />
                  </Button>

                  <span className="w-6 text-center text-sm font-medium text-slate-900">
                    {item.quantity}
                  </span>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      cart.updateQuantity(
                        item.slabListingId,
                        item.quantity + 1,
                      )
                    }
                  >
                    <Plus className="size-3.5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="ml-1 text-red-500 hover:text-red-600"
                    onClick={() => cart.removeItem(item.slabListingId)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </Card>

          <div className="space-y-4">
            <Card className="space-y-3 border border-slate-200 p-4 shadow-sm ring-0">
              <h3 className="text-sm font-semibold text-slate-900">
                Shipping details
              </h3>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="shippingName" className="text-xs text-slate-700">
                  Full name
                </Label>
                <Input
                  id="shippingName"
                  value={shipping.shippingName}
                  onChange={(event) =>
                    handleChange("shippingName", event.target.value)
                  }
                  disabled={loading}
                  className="h-8"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="shippingPhone" className="text-xs text-slate-700">
                  Phone number
                </Label>
                <Input
                  id="shippingPhone"
                  value={shipping.shippingPhone}
                  onChange={(event) =>
                    handleChange("shippingPhone", event.target.value)
                  }
                  disabled={loading}
                  className="h-8"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="shippingAddressLine1"
                  className="text-xs text-slate-700"
                >
                  Address line 1
                </Label>
                <Input
                  id="shippingAddressLine1"
                  value={shipping.shippingAddressLine1}
                  onChange={(event) =>
                    handleChange("shippingAddressLine1", event.target.value)
                  }
                  disabled={loading}
                  className="h-8"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="shippingAddressLine2"
                  className="text-xs text-slate-700"
                >
                  Address line 2 (optional)
                </Label>
                <Input
                  id="shippingAddressLine2"
                  value={shipping.shippingAddressLine2}
                  onChange={(event) =>
                    handleChange("shippingAddressLine2", event.target.value)
                  }
                  disabled={loading}
                  className="h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="shippingCity" className="text-xs text-slate-700">
                    City
                  </Label>
                  <Input
                    id="shippingCity"
                    value={shipping.shippingCity}
                    onChange={(event) =>
                      handleChange("shippingCity", event.target.value)
                    }
                    disabled={loading}
                    className="h-8"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="shippingState" className="text-xs text-slate-700">
                    State
                  </Label>
                  <Input
                    id="shippingState"
                    value={shipping.shippingState}
                    onChange={(event) =>
                      handleChange("shippingState", event.target.value)
                    }
                    disabled={loading}
                    className="h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="shippingPostalCode"
                    className="text-xs text-slate-700"
                  >
                    Postal code
                  </Label>
                  <Input
                    id="shippingPostalCode"
                    value={shipping.shippingPostalCode}
                    onChange={(event) =>
                      handleChange("shippingPostalCode", event.target.value)
                    }
                    disabled={loading}
                    className="h-8"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="shippingCountry"
                    className="text-xs text-slate-700"
                  >
                    Country
                  </Label>
                  <Input
                    id="shippingCountry"
                    value={shipping.shippingCountry}
                    onChange={(event) =>
                      handleChange("shippingCountry", event.target.value)
                    }
                    disabled={loading}
                    className="h-8"
                  />
                </div>
              </div>
            </Card>

            <Card className="space-y-3 border border-slate-200 p-4 shadow-sm ring-0">
              <h3 className="text-sm font-semibold text-slate-900">
                Payment method
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "rounded-md border border-slate-200 bg-white px-2.5 py-2 text-left transition-colors hover:border-blue-300",
                      paymentMethod === option.value &&
                        "border-blue-600 bg-blue-50 shadow-[0_0_0_1px_#2563eb] hover:border-blue-600",
                    )}
                    onClick={() => setPaymentMethod(option.value)}
                    disabled={loading}
                  >
                    <strong className="text-xs text-slate-900">
                      {option.label}
                    </strong>
                    <p className="text-[11px] text-slate-500">{option.hint}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="space-y-3 border border-slate-200 p-4 shadow-sm ring-0">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ${cart.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Payment method</span>
                <span className="font-semibold text-slate-900">
                  {
                    PAYMENT_METHOD_OPTIONS.find(
                      (option) => option.value === paymentMethod,
                    )?.label
                  }
                </span>
              </div>

              <LoadingButton
                type="submit"
                className="w-full"
                loading={loading}
                loadingText="Placing order..."
              >
                Place Order ({paymentMethod})
              </LoadingButton>
            </Card>
          </div>
        </form>
      )}
    </div>
  );
}
