import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import {
  DEFAULT_SECTION_LIMIT,
  HOME_SECTIONS,
  type HomeSectionSource,
} from "@/lib/data/home-sections";

const listInclude = {
  category: { select: { name: true, slug: true } },
} as const;

const productDetailInclude = {
  specs: { orderBy: { order: "asc" } },
  category: { select: { id: true, name: true, slug: true } },
  collections: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.ProductInclude;

export type ProductSort = "featured" | "newest" | "price-asc" | "price-desc";

const PRODUCT_ORDER: Record<
  ProductSort,
  Prisma.ProductOrderByWithRelationInput[]
> = {
  featured: [{ featured: "desc" }, { createdAt: "desc" }],
  newest: [{ createdAt: "desc" }],
  "price-asc": [
    { price: { sort: "asc", nulls: "last" } },
    { createdAt: "desc" },
  ],
  "price-desc": [
    { price: { sort: "desc", nulls: "last" } },
    { createdAt: "desc" },
  ],
};

export type ProductListFilters = {
  categorySlug?: string;
  collectionSlug?: string;
  condition?: "NEW" | "REFURBISHED" | "USED";
  search?: string;
  featured?: boolean;
  onSale?: boolean;
  inStockOnly?: boolean;
  maxPrice?: number;
  specs?: Record<string, string[]>;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
};

type ProductWhereFilters = Omit<
  ProductListFilters,
  "sort" | "page" | "pageSize"
>;

function buildProductWhere(
  f: ProductWhereFilters,
  categoryIds?: string[],
): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [];

  if (categoryIds) and.push({ categoryId: { in: categoryIds } });
  if (f.collectionSlug) {
    and.push({ collections: { some: { slug: f.collectionSlug } } });
  }
  if (f.condition) and.push({ condition: f.condition });
  if (f.featured) and.push({ featured: true });
  if (f.onSale) and.push({ compareAtPrice: { not: null } });
  if (f.inStockOnly) and.push({ inStock: true });
  if (f.maxPrice !== undefined) and.push({ price: { lte: f.maxPrice } });
  if (f.search) {
    and.push({
      OR: [
        { name: { contains: f.search, mode: "insensitive" } },
        { description: { contains: f.search, mode: "insensitive" } },
        { shortDescription: { contains: f.search, mode: "insensitive" } },
      ],
    });
  }
  for (const [label, values] of Object.entries(f.specs ?? {})) {
    if (values.length > 0) {
      and.push({ specs: { some: { label, value: { in: values } } } });
    }
  }

  return and.length > 0 ? { AND: and } : {};
}

async function resolveCategoryIds(categorySlug?: string) {
  "use cache";
  cacheTag("categories");
  cacheLife("hours");

  if (!categorySlug) return undefined;
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { id: true, children: { select: { id: true } } },
  });
  if (!category) return undefined;
  return [category.id, ...category.children.map((c) => c.id)];
}

export async function getAllProductsForAdmin() {
  "use cache";
  cacheTag("products");
  cacheLife("default");

  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      collections: { select: { name: true } },
    },
  });
}

export async function getProductById(id: string) {
  "use cache";
  cacheTag("products");
  cacheLife("default");

  return prisma.product.findUnique({
    where: { id },
    include: productDetailInclude,
  });
}

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheTag("products", `product-${slug}`);
  cacheLife("default");

  return prisma.product.findUnique({
    where: { slug },
    include: productDetailInclude,
  });
}

export async function getProducts(filters: ProductListFilters = {}) {
  "use cache";
  cacheTag("products");
  cacheLife("default");

  const { sort = "newest", page = 1, pageSize = 12, ...rest } = filters;

  const categoryIds = await resolveCategoryIds(rest.categorySlug);
  const where = buildProductWhere(rest, categoryIds);

  const total = await prisma.product.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), pageCount);

  const products = await prisma.product.findMany({
    where,
    orderBy: PRODUCT_ORDER[sort],
    skip: (safePage - 1) * pageSize,
    take: pageSize,
    include: listInclude,
  });

  return { products, total, page: safePage, pageSize, pageCount };
}

export async function getFilterableSpecs(
  filters: Omit<ProductWhereFilters, "specs"> = {},
) {
  "use cache";
  cacheTag("products", "product-specs");
  cacheLife("default");

  const categoryIds = await resolveCategoryIds(filters.categorySlug);

  const specs = await prisma.productSpec.findMany({
    where: { product: buildProductWhere(filters, categoryIds) },
    select: { label: true, value: true },
    distinct: ["label", "value"],
    orderBy: [{ label: "asc" }, { value: "asc" }],
  });

  const grouped: Record<string, string[]> = {};
  for (const { label, value } of specs) {
    (grouped[label] ??= []).push(value);
  }
  return grouped;
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 5,
) {
  "use cache";
  cacheTag("products");
  cacheLife("default");

  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId }, inStock: true },
    orderBy: PRODUCT_ORDER.featured,
    take: limit,
    include: listInclude,
  });
}

export async function getProductPriceBounds() {
  "use cache";
  cacheTag("products");
  cacheLife("default");

  const agg = await prisma.product.aggregate({
    _min: { price: true },
    _max: { price: true },
  });

  return {
    min: agg._min.price ?? 0,
    max: agg._max.price ?? 1000,
  };
}

function whereForSource(source: HomeSectionSource): Prisma.ProductWhereInput {
  switch (source.type) {
    case "featured":
      return { featured: true };

    case "collection":
      return { collections: { some: { slug: source.slug } } };
    case "category":
      return { category: { slug: source.slug } };
    case "newest":
      return {};
  }
}

function hrefForSource(source: HomeSectionSource): string {
  switch (source.type) {
    case "collection":
      return `/products?collection=${source.slug}`;
    case "category":
      return `/products?category=${source.slug}`;

    default:
      return "/products";
  }
}

export async function getHomePageSections() {
  "use cache";
  cacheTag("products", "home-products");
  cacheLife("default");

  const sections = await Promise.all(
    HOME_SECTIONS.map(async ({ source, limit, ...meta }) => ({
      ...meta,
      href: hrefForSource(source),
      products: await prisma.product.findMany({
        where: { inStock: true, ...whereForSource(source) },
        orderBy: PRODUCT_ORDER.newest,
        take: limit ?? DEFAULT_SECTION_LIMIT,
        include: listInclude,
      }),
    })),
  );

  return sections.filter((s) => s.products.length > 0);
}

export async function getDealsProducts(
  filters: { page?: number; pageSize?: number } = {},
) {
  "use cache";
  cacheTag("products", "deals-products");
  cacheLife("default");

  const { page = 1, pageSize = 24 } = filters;

  const where = {
    inStock: true,
    compareAtPrice: { not: null },
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ createdAt: "desc" as const }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize) || 1,
  };
}
