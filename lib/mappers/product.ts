import type { getProducts } from "@/lib/data/products";

type DbProduct = Awaited<ReturnType<typeof getProducts>>["products"][number];

export function toStorefrontProduct(product: DbProduct) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    featured: product.featured,
    inStock: product.inStock,
    stockCount: product.stockCount,
    condition: product.condition,
    image: product.image,
    gallery: product.gallery,
    category: product.category.name,
    categorySlug: product.category.slug,
  };
}

export type StorefrontProduct = ReturnType<typeof toStorefrontProduct>;
