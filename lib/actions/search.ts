"use server";

import { prisma } from "@/lib/prisma";

export type SearchResultType =
  | "product"
  | "category"
  | "brand"
  | "collection"
  | "whatsapp-order"
  | "blog";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
}

export async function globalSearch(rawQuery: string): Promise<SearchResult[]> {
  const query = rawQuery.trim();
  if (query.length < 2) return [];

  const [products, categories, brands, collections, whatsAppOrders, blogs] =
    await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { brand: { select: { name: true } } },
        take: 5,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { parent: { select: { name: true } } },
        take: 5,
        orderBy: { name: "asc" },
      }),
      prisma.brand.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
        orderBy: { name: "asc" },
      }),
      prisma.collection.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
        orderBy: { name: "asc" },
      }),
      prisma.whatsAppOrder.findMany({
        where: {
          OR: [
            { customerName: { contains: query, mode: "insensitive" } },
            { customerPhone: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blog.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return [
    ...products.map((p) => ({
      id: p.id,
      type: "product" as const,
      title: p.name,
      subtitle: p.brand?.name ?? p.slug,
      href: `/admin/products/${p.id}/edit`,
    })),
    ...categories.map((c) => ({
      id: c.id,
      type: "category" as const,
      title: c.name,
      subtitle: c.parent ? `Subcategory of ${c.parent.name}` : "Top-level",
      href: "/admin/categories",
    })),
    ...brands.map((b) => ({
      id: b.id,
      type: "brand" as const,
      title: b.name,
      subtitle: `/${b.slug}`,
      href: "/admin/brands",
    })),
    ...collections.map((col) => ({
      id: col.id,
      type: "collection" as const,
      title: col.name,
      subtitle: `/${col.slug}`,
      href: "/admin/collections",
    })),
    ...whatsAppOrders.map((o) => ({
      id: o.id,
      type: "whatsapp-order" as const,
      title: o.customerName || "Unnamed lead",
      subtitle: o.customerPhone ?? o.status,
      href: "/admin/whatsapp-orders",
    })),
    ...blogs.map((b) => ({
      id: b.id,
      type: "blog" as const,
      title: b.title,
      subtitle: b.excerpt,
      href: `/admin/blogs/${b.slug}`,
    })),
  ];
}
