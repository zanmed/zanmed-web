"use client";

import Link from "next/link";
import { ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { useCartStore, selectCartCount } from "@/lib/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { WhatsAppIcon } from "@/lib/icons/whatsapp";

export function CartSummary() {
  const subtotal = useCartStore((state) => state.subtotal);
  const shipping = useCartStore((state) => state.shipping);
  const total = useCartStore((state) => state.total);
  const items = useCartStore((state) => state.items);
  const itemCount = useCartStore(selectCartCount);
  const isSendingWhatsApp = useCartStore((state) => state.isSendingWhatsApp);
  const checkoutViaWhatsApp = useCartStore(
    (state) => state.checkoutViaWhatsApp,
  );

  const hasOutOfStockItems = items.some((item) => !item.product.inStock);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  const handleWhatsAppCheckout = async () => {
    const result = await checkoutViaWhatsApp();
    if (result.success && result.url) {
      window.open(result.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="rounded-md border border-border bg-card p-4 shadow-xs lg:sticky lg:top-24">
      <div className="border-b border-border pb-2.5 mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Order Desk Summary
        </h2>
      </div>

      <div className="space-y-3">
        <dl className="space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <dt>
              Subtotal ({itemCount} {itemCount === 1 ? "Item" : "Items"})
            </dt>
            <dd className="font-mono font-bold text-foreground">
              {formatCurrency(subtotal)}
            </dd>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <dt className="flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-primary" />
              <span>Freight / Delivery</span>
            </dt>
            <dd
              className={`font-mono font-bold ${shipping === 0 ? "text-emerald-600" : "text-foreground"}`}
            >
              {shipping === 0 ? "Free Delivery" : formatCurrency(shipping)}
            </dd>
          </div>

          <div className="border-t border-border pt-2.5 flex justify-between items-baseline">
            <dt className="text-xs font-bold text-foreground uppercase">
              Estimated Total
            </dt>
            <dd className="font-mono text-sm font-bold text-primary">
              {formatCurrency(total)}
            </dd>
          </div>
        </dl>

        {!isFreeShipping && amountForFreeShipping > 0 && (
          <div className="rounded-md border border-border bg-soft p-2.5 text-[11px] text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>
                Add{" "}
                <strong className="font-mono font-bold text-primary">
                  {formatCurrency(amountForFreeShipping)}
                </strong>{" "}
                for free Kenya delivery.
              </span>
            </p>
          </div>
        )}

        {hasOutOfStockItems && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-[11px] font-bold text-destructive uppercase tracking-tight">
            Remove out-of-stock items before submitting order.
          </div>
        )}

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleWhatsAppCheckout}
            disabled={
              items.length === 0 || hasOutOfStockItems || isSendingWhatsApp
            }
            className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-3 text-xs font-bold text-white transition-colors hover:bg-[#20BD5C] active:bg-[#1CAE54] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0" />
            <span>
              {isSendingWhatsApp
                ? "Opening WhatsApp…"
                : "Order via WhatsApp Desk"}
            </span>
          </button>

          <Link
            href="/checkout"
            className={`flex h-8 w-full items-center justify-center gap-1 rounded-md border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-soft ${
              items.length === 0 || hasOutOfStockItems
                ? "pointer-events-none opacity-50"
                : ""
            }`}
          >
            <span>Proceed to Formal Checkout</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="border-t border-border/60 pt-3 space-y-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Official Manufacturer Warranty Included</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Fast Nairobi & Countrywide Dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
