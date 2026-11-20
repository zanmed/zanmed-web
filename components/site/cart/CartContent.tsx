"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { CartItems } from "./CartItems";
import { CartSummary } from "./CartSummary";
import { useCartStore, selectHasItems } from "@/lib/stores/cart-store";

export function CartContent() {
  const hasItems = useCartStore(selectHasItems);

  if (!hasItems) {
    return (
      <div className="rounded-md border border-dashed border-border bg-card p-8 text-center sm:p-12">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-soft text-primary">
          <ShoppingBag size={20} />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Procurement Cart Empty
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground leading-relaxed">
          No medical equipment, reagents, or supplies have been added to your
          order desk yet.
        </p>
        <div className="mt-5">
          <Link
            href="/products"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse Product Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <CartItems />
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-soft hover:border-primary"
          >
            <ArrowLeft size={13} />
            Add More Items to Order Desk
          </Link>
        </div>
      </div>
      <div className="lg:col-span-1">
        <CartSummary />
      </div>
    </div>
  );
}
