import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import {
  getCategoryTreeForSitemap,
  getCollectionsForSitemap,
  getProductsForSitemap,
  getPublishedBlogsForSitemap,
  type SitemapRecord,
} from "@/lib/data/sitemap";

type Entry = MetadataRoute.Sitemap[number];

const abs = (path: string) => new URL(path, SITE.siteUrl).href;

async function safe<T>(
  label: string,
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await query();
  } catch (err) {
    console.error(`sitemap: failed to fetch ${label}`, err);
    return fallback;
  }
}

function latest(records: { updatedAt: Date }[]): Date | undefined {
  let max: Date | undefined;
  for (const r of records) if (!max || r.updatedAt > max) max = r.updatedAt;
  return max;
}

function toEntries(
  records: SitemapRecord[],
  pathFor: (slug: string) => string,
  priority: number,
  changeFrequency: Entry["changeFrequency"],
): MetadataRoute.Sitemap {
  return records.map(({ slug, updatedAt }) => ({
    url: abs(pathFor(slug)),
    lastModified: updatedAt,
    changeFrequency,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categoryTree, collections, products, blogs] = await Promise.all([
    safe("categories", getCategoryTreeForSitemap, []),
    safe("collections", getCollectionsForSitemap, []),
    safe("products", getProductsForSitemap, []),
    safe("blogs", getPublishedBlogsForSitemap, []),
  ]);

  const categories = categoryTree.flatMap((c) => [c, ...(c.children || [])]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: abs("/"),
      lastModified: latest(products),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: abs("/products"),
      lastModified: latest(products),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: abs("/categories"),
      lastModified: latest(categories),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: abs("/collections"),
      lastModified: latest(collections),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: abs("/blogs"),
      lastModified: latest(blogs),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: abs("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: abs("/contact"), changeFrequency: "monthly", priority: 0.5 },
    { url: abs("/support"), changeFrequency: "monthly", priority: 0.4 },
    { url: abs("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/terms"), changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/sitemap"), changeFrequency: "yearly", priority: 0.3 },
    { url: abs("/llms.txt"), changeFrequency: "weekly", priority: 0.5 },
    { url: abs("/llms-full.txt"), changeFrequency: "weekly", priority: 0.5 },
  ];

  return [
    ...staticRoutes,
    ...toEntries(
      categories,
      (slug) => `/products?category=${encodeURIComponent(slug)}`,
      0.7,
      "weekly",
    ),
    ...toEntries(collections, (slug) => `/collections/${slug}`, 0.7, "weekly"),
    ...toEntries(products, (slug) => `/products/${slug}`, 0.8, "daily"),
    ...toEntries(blogs, (slug) => `/blogs/${slug}`, 0.6, "monthly"),
  ];
}
