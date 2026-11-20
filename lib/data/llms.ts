import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { LIMITS } from "@/lib/llms-config";

export interface LlmsCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  order: number;
  description: string | null;
  subtitle: string | null;
}

export interface LlmsCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
}

export interface LlmsProduct {
  slug: string;
  name: string;
  price: number | null;
  compareAtPrice: number | null;
  featured: boolean;
  categoryId: string;
}

export interface LlmsPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
}

export interface LlmsData {
  categories: LlmsCategory[];
  collections: LlmsCollection[];
  products: LlmsProduct[];
  posts: LlmsPost[];
  generatedAt: string;
}

export interface LlmsProductDetail {
  slug: string;
  name: string;
  price: number | null;
  compareAtPrice: number | null;
  inStock: boolean;
  categoryName: string;
  categorySlug: string;
}

export async function getLlmsData(full = false): Promise<LlmsData> {
  "use cache";

  cacheTag("products", "categories", "collections", "blogs", "llms");
  cacheLife("hours");

  const now = new Date();

  const [categories, collections, products, posts] = await Promise.all([
    prisma.category.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        order: true,
        description: true,
        subtitle: true,
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),

    prisma.collection.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        order: true,
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),

    prisma.product.findMany({
      where: full ? { inStock: true } : { inStock: true, featured: true },
      select: {
        slug: true,
        name: true,
        price: true,
        compareAtPrice: true,
        featured: true,
        categoryId: true,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }, { name: "asc" }],
      take: full ? LIMITS.maxProducts : LIMITS.featuredProducts,
    }),

    prisma.blog.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { lte: now },
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: full ? 2000 : LIMITS.blogPosts,
    }),
  ]);

  return {
    categories,
    collections,
    products: products.map((product) => ({
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      featured: product.featured,
      categoryId: product.categoryId,
    })),
    posts: posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt?.toISOString() ?? null,
    })),
    generatedAt: now.toISOString(),
  };
}

export async function getLlmsProduct(
  slug: string,
): Promise<LlmsProductDetail | null> {
  "use cache";

  cacheTag("products", "categories", `product:${slug}`, "llms");
  cacheLife("hours");

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      slug: true,
      name: true,
      price: true,
      compareAtPrice: true,
      inStock: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return {
    slug: product.slug,
    name: product.name,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    inStock: product.inStock,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
  };
}
