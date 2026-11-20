"use client";

import { toStorefrontProduct } from "@/lib/mappers/product";
import { ProductCard } from "./product-card";

type StorefrontProduct = ReturnType<typeof toStorefrontProduct>;

export function ProductGrid({
  items,
  compact = false,
}: {
  items: StorefrontProduct[];
  compact?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} compact={compact} />
      ))}
    </div>
  );
}
