"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { logProductWhatsAppClick } from "@/lib/actions/products";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore, selectIsInCart } from "@/lib/stores/cart-store";
import { WhatsAppIcon } from "@/lib/icons/whatsapp";
import type { StorefrontProduct } from "@/lib/mappers/product";

function getBadge(product: StorefrontProduct): string | null {
  const { price, compareAtPrice } = product;
  if (price !== null && compareAtPrice !== null && compareAtPrice > price) {
    return `-${Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}%`;
  }
  return product.featured ? "Featured" : null;
}

export function ProductCard({
  product,
  compact = false,
}: {
  product: StorefrontProduct;
  compact?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const isInCart = useCartStore(selectIsInCart(product.id));

  const outOfStock = !product.inStock;
  const hasPrice = product.price !== null;
  const badge = getBadge(product);

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock || isPending) return;

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
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const price = product.price;
    if (price === null || outOfStock || isAdding || isInCart) return;

    setIsAdding(true);
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price,
      inStock: product.inStock,
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-border bg-card transition-all hover:border-primary hover:shadow-xs",
        outOfStock && "opacity-75",
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden bg-soft">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />

          {badge && !outOfStock && (
            <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 rounded-xs bg-primary px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-primary-foreground">
              {badge}
            </span>
          )}

          {!outOfStock && product.condition && (
            <span className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 rounded-xs bg-background/90 backdrop-blur-xs px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-foreground border border-border">
              {product.condition}
            </span>
          )}

          {outOfStock && (
            <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 rounded-xs bg-destructive px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-destructive-foreground">
              Out of Stock
            </span>
          )}

          <button
            type="button"
            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-xs transition-colors hover:bg-background hover:text-primary"
            aria-label={`Like ${product.name}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
          >
            <Heart
              size={13}
              fill={liked ? "currentColor" : "none"}
              className={cn(
                "transition-colors",
                liked ? "text-destructive" : "text-foreground",
              )}
            />
          </button>
        </div>

        {/* Compact padding on mobile */}
        <div className="flex flex-1 flex-col justify-between p-1.5 sm:p-2.5">
          <div>
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {product.category}
            </span>
            <h3 className="mt-0.5 line-clamp-2 text-[11px] sm:text-xs font-semibold leading-snug text-foreground">
              {product.name}
            </h3>
          </div>

          <div className="mt-1 sm:mt-2 flex items-baseline gap-1 sm:gap-1.5">
            {product.price !== null ? (
              <>
                <span className="text-[11px] sm:text-xs font-bold text-foreground">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice !== null &&
                  product.compareAtPrice > product.price && (
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
              </>
            ) : (
              <span className="text-[11px] sm:text-xs font-bold text-primary">
                Request a quote
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-stretch gap-1 sm:gap-1.5 border-t border-border bg-card p-1 sm:p-2">
        <button
          type="button"
          onClick={handleWhatsAppOrder}
          disabled={outOfStock || isPending}
          title={outOfStock ? "Out of stock" : "Order via WhatsApp"}
          aria-label={outOfStock ? "Out of stock" : "Order via WhatsApp"}
          className={cn(
            "flex h-6.5 sm:h-7 flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#1f9d55] px-1.5 sm:px-2 text-white transition-colors",
            "hover:bg-[#1f9d55]/90 active:bg-[#1f9d55] disabled:opacity-60",
          )}
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 animate-spin" />
          ) : (
            <WhatsAppIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          )}
          <span className="truncate text-[10px] sm:text-xs font-semibold">
            {isPending ? "Opening…" : hasPrice ? "WhatsApp" : "Get Quote"}
          </span>
        </button>

        {hasPrice && (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock || isAdding || isInCart}
            title={
              outOfStock ? "Out of stock" : isInCart ? "In cart" : "Add to cart"
            }
            aria-label={
              outOfStock ? "Out of stock" : isInCart ? "In cart" : "Add to cart"
            }
            className={cn(
              "flex h-6.5 w-6.5 sm:h-7 sm:w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors",
              "bg-card disabled:opacity-60",
              isInCart
                ? "border-emerald-600 text-emerald-600 bg-emerald-50/50"
                : "border-border text-foreground hover:border-primary hover:bg-soft hover:text-primary",
            )}
          >
            {isAdding ? (
              <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
            ) : isInCart ? (
              <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
            ) : (
              <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            )}
          </button>
        )}
      </div>
    </article>
  );
}
