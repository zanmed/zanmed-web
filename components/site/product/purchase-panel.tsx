"use client";

import { useState, useTransition } from "react";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Loader2,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { useCartStore, selectIsInCart } from "@/lib/stores/cart-store";
import { logProductWhatsAppClick } from "@/lib/actions/products";
import { WhatsAppIcon } from "@/lib/icons/whatsapp";

interface PurchasePanelProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number | null;
    compareAtPrice: number | null;
    inStock: boolean;
    image: string;
    shortDescription: string;
  };
  colorSpec?: { label: string; value: string } | null;
}

function estimatedDeliveryRange() {
  const start = new Date();
  start.setDate(start.getDate() + 0);
  const end = new Date();
  end.setDate(end.getDate() + 1);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} - ${fmt(end)}`;
}

export function PurchasePanel({ product, colorSpec }: PurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();

  const addToCart = useCartStore((s) => s.addToCart);
  const isInCart = useCartStore(selectIsInCart(product.id));

  const { price, compareAtPrice } = product;
  const hasPrice = price !== null;

  const discountPercent =
    price !== null && compareAtPrice !== null && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;
  const savingsAmount =
    price !== null && compareAtPrice !== null && discountPercent !== null
      ? compareAtPrice - price
      : null;

  function handleAddToCart() {
    if (price === null || !product.inStock || isAdding || isInCart) return;
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price,
        inStock: product.inStock,
      });
    }
    setTimeout(() => setIsAdding(false), 400);
  }

  function handleWhatsAppOrder() {
    if (!product.inStock || isPending) return;
    startTransition(async () => {
      try {
        const { url } = await logProductWhatsAppClick(product.id);
        if (!url) {
          toast.error("Couldn't open WhatsApp. Please try again.");
          return;
        }
        window.open(url, "_blank", "noopener,noreferrer");
      } catch (err) {
        console.error("[handleWhatsAppOrder]", err);
        toast.error("Couldn't open WhatsApp. Please try again.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3.5">
      <h1 className="text-base font-bold uppercase tracking-tight sm:text-lg lg:text-xl text-foreground">
        {product.name}
      </h1>

      <div className="flex items-baseline gap-3 border-y border-border py-2.5">
        {price !== null ? (
          <>
            <strong className="font-mono text-lg font-bold text-primary sm:text-xl">
              {formatCurrency(price)}
            </strong>
            {discountPercent !== null && compareAtPrice !== null && (
              <del className="font-mono text-xs text-muted-foreground">
                {formatCurrency(compareAtPrice)}
              </del>
            )}
          </>
        ) : (
          <strong className="text-sm font-bold uppercase text-foreground">
            Price on Procurement Request
          </strong>
        )}
      </div>

      {discountPercent !== null && savingsAmount !== null && (
        <span className="inline-flex w-fit items-center gap-1 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
          Save: {formatCurrency(savingsAmount)} ({discountPercent}% Off)
        </span>
      )}

      {colorSpec && (
        <div className="flex flex-col gap-1.5 border-t border-border pt-2.5 text-xs">
          <span className="font-semibold text-muted-foreground">
            {colorSpec.label}:{" "}
            <span className="font-bold text-foreground">{colorSpec.value}</span>
          </span>
          <span
            className="size-5 border border-border"
            style={{ backgroundColor: colorSpec.value.toLowerCase() }}
            aria-hidden
          />
        </div>
      )}

      <div>
        <p>{product.shortDescription}</p>
      </div>

      {hasPrice && (
        <div className="flex items-center gap-3 text-xs pt-1">
          <span className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
            Quantity:
          </span>
          <div className="inline-flex h-8 items-center divide-x divide-border border border-border bg-background">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-soft hover:text-foreground"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center font-mono text-xs font-bold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-soft hover:text-foreground"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      )}

      {hasPrice && (
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding || isInCart}
            className={[
              "flex h-9 flex-1 items-center justify-center gap-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
              isInCart
                ? "bg-emerald-600 text-white hover:bg-emerald-600"
                : "bg-primary text-primary-foreground hover:opacity-90",
            ].join(" ")}
          >
            {isAdding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isInCart ? (
              <Check size={14} />
            ) : (
              <ShoppingCart size={14} />
            )}
            <span>{isInCart ? "Item in Order Desk" : "Add to Order Desk"}</span>
          </button>

          <button
            type="button"
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => setLiked((v) => !v)}
            className={`flex size-9 shrink-0 items-center justify-center border border-border bg-background transition-colors hover:bg-soft ${
              liked
                ? "text-destructive border-destructive/40"
                : "text-muted-foreground"
            }`}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleWhatsAppOrder}
        disabled={!product.inStock || isPending}
        className={[
          "flex items-center justify-center gap-2 border border-[#25D366] bg-[#25D366] text-xs font-semibold text-white transition-colors hover:bg-[#20BD5C] active:bg-[#1CAE54] disabled:opacity-50",
          hasPrice ? "h-9" : "h-10",
        ].join(" ")}
      >
        {isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <WhatsAppIcon className="size-4 shrink-0" />
        )}
        <span>
          {isPending
            ? "Connecting to WhatsApp..."
            : hasPrice
              ? "Order via WhatsApp Desk"
              : "Request Quote via WhatsApp"}
        </span>
      </button>

      <div className="mt-1 flex flex-col gap-1.5 border border-border bg-soft p-2.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className={`size-2 ${
              product.inStock ? "bg-emerald-500" : "bg-destructive"
            }`}
          />
          <span className="font-semibold text-foreground">
            {!product.inStock
              ? "Currently Out of Stock (Backorders Available)"
              : hasPrice
                ? `In Stock — Estimated delivery by ${estimatedDeliveryRange()}`
                : "In Stock — Contact for Hospital LPO & Quotations"}
          </span>
        </div>
        <div className="flex items-center gap-3 border-t border-border/60 pt-1.5 text-[10px] uppercase font-semibold text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-primary" /> Warranty Included
          </span>
          <span className="flex items-center gap-1">
            <Truck size={12} className="text-primary" /> Kenya Delivery
          </span>
        </div>
      </div>
    </div>
  );
}
