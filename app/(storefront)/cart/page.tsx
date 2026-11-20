"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { WhatsAppIcon } from "@/lib/icons/whatsapp";

const subscribe = () => () => {};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export default function CartPage() {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [error, setError] = useState<string | null>(null);

  const {
    items,
    subtotal,
    tax,
    shipping,
    total,
    isSendingWhatsApp,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    checkoutViaWhatsApp,
  } = useCartStore();

  if (!hydrated) return <CartSkeleton />;

  if (items.length === 0) {
    return (
      <main className="bg-background font-sans text-foreground py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-sm text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-soft text-primary"
            >
              <ShoppingBag size={24} />
            </span>
            <h1 className="mt-4 text-lg font-bold text-foreground">
              Your Order Desk is Empty
            </h1>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Add medical equipment, lab consumables, or home care supplies to
              your cart to generate a quote or send an order via WhatsApp.
            </p>
            <Link
              href="/products"
              className={`mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 ${focusRing}`}
            >
              Explore Equipment Catalog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const hasOutOfStock = items.some((item) => !item.product.inStock);

  async function handleCheckout() {
    setError(null);
    const res = await checkoutViaWhatsApp();
    if (res.success && res.url) {
      window.open(res.url, "_blank", "noopener,noreferrer");
    } else {
      setError(
        "We could not prepare your order request. Please try again or contact us directly.",
      );
    }
  }

  return (
    <main className="bg-background font-sans pb-24 text-foreground py-6 sm:py-8 lg:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border pb-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-2"
          >
            <ArrowLeft size={13} /> Continue Browsing Catalog
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              Procurement Cart
            </h1>
            <span className="rounded-md bg-soft border border-border px-2.5 py-0.5 text-xs font-mono font-bold text-primary">
              {itemCount} {itemCount === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
          <section aria-label="Cart items" className="lg:col-span-8">
            {FREE_SHIPPING_THRESHOLD > 0 && (
              <ShippingProgress subtotal={subtotal} />
            )}

            {hasOutOfStock && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <p>
                  Some requested items are currently out of stock. Remove them
                  or contact our technical sales desk for pre-order options.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Selected Items
              </h2>
              <button
                type="button"
                onClick={clearCart}
                className={`text-xs text-muted-foreground transition-colors hover:text-destructive ${focusRing}`}
              >
                Clear Cart
              </button>
            </div>

            <ul className="divide-y divide-border">
              {items.map(({ product, quantity, unitPrice, productId }) => (
                <li key={productId} className="flex gap-3 py-3.5">
                  <Link
                    href={`/products/${product.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-soft sm:h-24 sm:w-24"
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ShoppingBag size={20} />
                      </span>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-xs font-bold text-foreground sm:text-sm">
                          <Link
                            href={`/products/${product.slug}`}
                            className={`transition-colors hover:text-primary ${focusRing}`}
                          >
                            {product.name}
                          </Link>
                        </h3>
                        <p
                          className={`mt-0.5 text-[10px] font-semibold ${
                            product.inStock
                              ? "text-emerald-700"
                              : "text-destructive"
                          }`}
                        >
                          {product.inStock
                            ? "In Stock & Ready for Dispatch"
                            : "Out of Stock"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs font-bold text-foreground sm:text-sm">
                          {formatCurrency(unitPrice * quantity)}
                        </p>
                        {quantity > 1 && (
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {formatCurrency(unitPrice)} each
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center divide-x divide-border rounded-md border border-border bg-card">
                        <button
                          type="button"
                          onClick={() => decrementQuantity(productId)}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className={`flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:bg-soft hover:text-foreground ${focusRing}`}
                        >
                          <Minus size={12} />
                        </button>
                        <span
                          aria-live="polite"
                          className="w-8 text-center text-xs font-bold font-mono"
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementQuantity(productId)}
                          disabled={!product.inStock}
                          aria-label={`Increase quantity of ${product.name}`}
                          className={`flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:bg-soft hover:text-foreground disabled:opacity-40 ${focusRing}`}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(productId)}
                        aria-label={`Remove ${product.name}`}
                        className={`inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive ${focusRing}`}
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="lg:sticky lg:top-24 lg:col-span-4">
            <div className="rounded-md border border-border bg-card p-4 shadow-xs">
              <h2 className="text-sm font-bold text-foreground">
                Order Summary
              </h2>

              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <dt>Subtotal</dt>
                  <dd className="font-bold text-foreground font-mono">
                    {formatCurrency(subtotal)}
                  </dd>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <dt>Estimated VAT / Tax</dt>
                    <dd className="font-bold text-foreground font-mono">
                      {formatCurrency(tax)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <dt>Estimated Freight / Delivery</dt>
                  <dd className="font-bold text-foreground font-mono">
                    {shipping === 0
                      ? "Free Shipping"
                      : formatCurrency(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2.5 text-sm font-bold">
                  <dt className="text-foreground">Total</dt>
                  <dd className="text-primary font-mono">
                    {formatCurrency(total)}
                  </dd>
                </div>
              </dl>

              <CheckoutButton
                onClick={handleCheckout}
                sending={isSendingWhatsApp}
                disabled={isSendingWhatsApp || hasOutOfStock}
                className="mt-4 w-full"
              />

              {error && (
                <p role="alert" className="mt-2 text-xs text-destructive">
                  {error}
                </p>
              )}

              <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
                WhatsApp opens with your itemized medical order list ready to
                send to our sales & engineering desk for availability
                confirmation and proforma invoicing.
              </p>

              <ul className="mt-4 space-y-2 border-t border-border pt-3 text-[11px] text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <Truck size={13} className="shrink-0 text-primary" />
                  Nationwide Medical Logistics in Kenya
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="shrink-0 text-primary" />
                  ISO Certified & Compliant Gear
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="shrink-0 text-primary" />
                  LPO & Proforma Invoicing Supported
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card p-3 shadow-md lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="shrink-0">
            <p className="text-[10px] uppercase font-semibold text-muted-foreground">
              Total Amount
            </p>
            <p className="text-sm font-bold text-primary font-mono">
              {formatCurrency(total)}
            </p>
          </div>
          <CheckoutButton
            onClick={handleCheckout}
            sending={isSendingWhatsApp}
            disabled={isSendingWhatsApp || hasOutOfStock}
            className="flex-1"
          />
        </div>
      </div>
    </main>
  );
}

function CheckoutButton({
  onClick,
  sending,
  disabled,
  className = "",
}: {
  onClick: () => void;
  sending: boolean;
  disabled: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#20BD5C] active:bg-[#1CAE54] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing} ${className}`}
    >
      <WhatsAppIcon className="h-4 w-4 shrink-0" />
      <span>{sending ? "Preparing Order…" : "Order via WhatsApp Desk"}</span>
    </button>
  );
}

function ShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const percent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="mb-4 rounded-md border border-border bg-soft p-3">
      <p className="flex items-center gap-1.5 text-xs text-foreground">
        <Truck size={14} className="shrink-0 text-primary" />
        {remaining > 0 ? (
          <span>
            Add{" "}
            <strong className="font-bold text-primary">
              {formatCurrency(remaining)}
            </strong>{" "}
            more to qualify for free nationwide delivery.
          </span>
        ) : (
          <span className="font-semibold text-primary">
            Your order qualifies for free delivery across Kenya!
          </span>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progress towards free delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-border"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <main className="bg-background font-sans text-foreground py-8">
      <div className="mx-auto max-w-7xl animate-pulse px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 rounded-md bg-soft mb-6" />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-8">
            <div className="h-24 rounded-md bg-soft" />
            <div className="h-24 rounded-md bg-soft" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-56 rounded-md bg-soft" />
          </div>
        </div>
      </div>
    </main>
  );
}
