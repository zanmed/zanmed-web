"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, AlertCircle, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatCurrency } from "@/lib/utils";

export function CartItems() {
  const items = useCartStore((state) => state.items);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-xs">
      <div className="border-b border-border bg-soft px-3.5 py-2">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Selected Equipment & Reagents
        </h2>
      </div>

      <ul className="divide-y divide-border">
        {items.map((item) => {
          const isOutOfStock = !item.product.inStock;

          return (
            <li key={item.productId} className="p-3 sm:p-3.5 transition-colors">
              {isOutOfStock && (
                <div
                  role="alert"
                  className="mb-2.5 flex items-center gap-1.5 rounded-xs border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-destructive"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Currently Unavailable — Remove or Request Lead-Time Quote
                  </span>
                </div>
              )}

              <div className={`flex gap-3 ${isOutOfStock ? "opacity-60" : ""}`}>
                <Link
                  href={`/products/${item.product.slug}`}
                  className="relative size-18 shrink-0 overflow-hidden rounded-md border border-border bg-soft sm:size-20"
                >
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <ShoppingBag size={18} />
                    </div>
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="line-clamp-2 text-xs font-bold text-foreground transition-colors hover:text-primary"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      {formatCurrency(item.unitPrice)} PER UNIT
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex h-7 items-center divide-x divide-border rounded-md border border-border bg-background">
                      <button
                        type="button"
                        onClick={() => decrementQuantity(item.productId)}
                        disabled={isOutOfStock || item.quantity <= 1}
                        className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:bg-soft hover:text-foreground disabled:opacity-30"
                        aria-label={`Decrease quantity of ${item.product.name}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-mono text-xs font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementQuantity(item.productId)}
                        disabled={isOutOfStock}
                        className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:bg-soft hover:text-foreground disabled:opacity-30"
                        aria-label={`Increase quantity of ${item.product.name}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <p className="font-mono text-xs font-bold text-foreground">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
