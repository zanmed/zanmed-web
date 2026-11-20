import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export type SitemapRecord = { slug: string; name: string; updatedAt: Date };
export type SitemapCategory = SitemapRecord & { children: SitemapRecord[] };

export async function getProductsForSitemap(): Promise<SitemapRecord[]> {
  "use cache";
  cacheTag("products", "sitemap");
  cacheLife("hours");

  return prisma.product.findMany({
    select: { slug: true, name: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCollectionsForSitemap(): Promise<SitemapRecord[]> {
  "use cache";
  cacheTag("collections", "products", "sitemap");
  cacheLife("hours");

  return prisma.collection.findMany({
    where: { active: true, products: { some: {} } },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { slug: true, name: true, updatedAt: true },
  });
}

export async function getCategoryTreeForSitemap(): Promise<SitemapCategory[]> {
  "use cache";
  cacheTag("categories", "products", "sitemap");
  cacheLife("hours");

  return prisma.category.findMany({
    where: {
      parentId: null,
      active: true,
      OR: [
        { products: { some: {} } },
        { children: { some: { active: true, products: { some: {} } } } },
      ],
    },
    orderBy: { order: "asc" },
    select: {
      slug: true,
      name: true,
      updatedAt: true,
      children: {
        where: { active: true, products: { some: {} } },
        orderBy: { order: "asc" },
        select: { slug: true, name: true, updatedAt: true },
      },
    },
  });
}

export async function getPublishedBlogsForSitemap(): Promise<SitemapRecord[]> {
  "use cache";
  cacheTag("blogs", "sitemap");
  cacheLife("hours");

  const blogs = await prisma.blog.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, updatedAt: true },
  });

  return blogs.map(({ slug, title, updatedAt }) => ({
    slug,
    name: title,
    updatedAt,
  }));
}
