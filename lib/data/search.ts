import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface SearchProduct {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  categoryName: string | null;
  categorySlug: string | null;
}

export interface TermSuggestion {
  name: string;
  slug: string;
}

export interface SearchIndex {
  products: SearchProduct[];
  categories: TermSuggestion[];
}

export async function getSearchIndex(): Promise<SearchIndex> {
  "use cache";
  cacheTag("products", "categories", "search-index");
  cacheLife("default");

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { inStock: true },
      select: {
        id: true,
        slug: true,
        name: true,
        image: true,
        price: true,
        category: { select: { name: true, slug: true } },
      },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    }),
    prisma.category.findMany({
      where: { active: true },
      select: { name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    products: products.map(({ category, price, ...p }) => ({
      ...p,
      price: price ?? 0,
      categoryName: category?.name ?? null,
      categorySlug: category?.slug ?? null,
    })),
    categories,
  };
}

export interface SearchScope {
  label: string;
  slug: string | null;
}

export async function getSearchScopes(): Promise<SearchScope[]> {
  "use cache";
  cacheTag("categories");
  cacheLife("default");

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
    select: { name: true, slug: true },
  });

  return [
    { label: "All categories", slug: null },
    ...categories.map((category) => ({
      label: category.name,
      slug: category.slug,
    })),
  ];
}
