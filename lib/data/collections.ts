import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Collection, type Prisma } from "@/generated/prisma/client";
import {
  PAGE_SIZE,
  type CollectionQuery,
  type SortKey,
} from "./collection-query";

export async function getAllCollectionsForAdmin() {
  "use cache";
  cacheTag("collections");
  cacheLife("default");

  return prisma.collection.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getCollectionById(
  id: string,
): Promise<Collection | null> {
  "use cache";
  cacheTag("collections");
  cacheLife("default");

  return prisma.collection.findUnique({ where: { id } });
}

export async function getAllCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag("collections");
  cacheLife("default");

  return prisma.collection.findMany({ orderBy: { name: "asc" } });
}

export async function getFooterCollections({
  limit,
}: {
  limit?: number;
}): Promise<Collection[]> {
  "use cache";
  cacheTag("collections");
  cacheLife("default");

  return prisma.collection.findMany({ orderBy: { name: "asc" }, take: limit });
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  "use cache";
  cacheTag("collections", `collection-${slug}`);
  cacheLife("default");

  return prisma.collection.findUnique({ where: { slug } });
}

const ORDER_BY = {
  featured: [{ featured: "desc" }, { createdAt: "desc" }, { id: "asc" }],
  newest: [{ createdAt: "desc" }, { id: "asc" }],
  "price-asc": [{ price: { sort: "asc", nulls: "last" } }, { id: "asc" }],
  "price-desc": [{ price: { sort: "desc", nulls: "last" } }, { id: "asc" }],
} satisfies Record<SortKey, Prisma.ProductOrderByWithRelationInput[]>;

export async function getCollectionProductsPage(
  slug: string,
  query: CollectionQuery,
) {
  "use cache";
  cacheTag("collections", "products", `collection-products-${slug}`);
  cacheLife("default");
  const where: Prisma.ProductWhereInput = {
    collections: { some: { slug } },

    ...(query.condition && { condition: query.condition }),
    ...(query.inStock && { inStock: true }),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: ORDER_BY[query.sort],
      skip: (query.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}
