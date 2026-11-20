import Link from "next/link";
import type { Metadata } from "next";
import {
  FolderTree,
  Package,
  FileText,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import {
  getCategoryTreeForSitemap,
  getCollectionsForSitemap,
  getProductsForSitemap,
  getPublishedBlogsForSitemap,
  type SitemapRecord,
} from "@/lib/data/sitemap";

export const metadata: Metadata = {
  title: `HTML Sitemap | ${SITE.name} - Medical Equipment & Supplies Directory`,
  description: `Complete directory of pages, medical product categories, lab equipment, hospital machinery, and articles available on ${SITE.name}.`,
  alternates: { canonical: "/sitemap" },
};

const PAGE_GROUPS = [
  {
    title: "Main Storefront",
    links: [
      { name: "Home", href: "/" },
      { name: "All Products", href: "/products" },
      { name: "Categories", href: "/categories" },
      { name: "Collections", href: "/collections" },
      { name: "Shopping Cart", href: "/cart" },
    ],
  },
  {
    title: "Company & Services",
    links: [
      { name: "About Zanmed", href: "/about" },
      { name: "Contact & Technical Support", href: "/contact" },
      { name: "Warranty & Support", href: "/support" },
      { name: "Field Notes & Medical Blog", href: "/blogs" },
    ],
  },
  {
    title: "Compliance & Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms & Conditions", href: "/terms" },
    ],
  },
];

const linkClass =
  "inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors duration-150 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const sectionClass = "rounded-md border border-border bg-card p-4";
const countClass =
  "rounded-md bg-soft px-2 py-0.5 text-[10px] font-mono font-bold text-primary";

async function fetchSitemapData<T>(
  label: string,
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await query();
  } catch (err) {
    console.error(`sitemap-page: failed to fetch ${label}`, err);
    return fallback;
  }
}

const categoryHref = (slug: string) =>
  `/products?category=${encodeURIComponent(slug)}`;

function BulletLink({ href, name }: { href: string; name: string }) {
  return (
    <Link prefetch={false} href={href} className={linkClass}>
      <span className="text-[10px] text-muted-foreground">•</span>
      <span>{name}</span>
    </Link>
  );
}

function RecordList({
  records,
  pathFor,
  columns,
}: {
  records: SitemapRecord[];
  pathFor: (slug: string) => string;
  columns: string;
}) {
  return (
    <ul className={`mt-3 gap-x-6 space-y-1.5 text-xs ${columns}`}>
      {records.map((record) => (
        <li key={record.slug} className="break-inside-avoid">
          <BulletLink href={pathFor(record.slug)} name={record.name} />
        </li>
      ))}
    </ul>
  );
}

export default async function SitemapPage() {
  const [categories, collections, products, blogs] = await Promise.all([
    fetchSitemapData("categories", getCategoryTreeForSitemap, []),
    fetchSitemapData("collections", getCollectionsForSitemap, []),
    fetchSitemapData("products", getProductsForSitemap, []),
    fetchSitemapData("blogs", getPublishedBlogsForSitemap, []),
  ]);

  return (
    <main className="bg-background font-sans text-foreground py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <FolderTree size={13} /> Navigation Directory
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Site Map
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Complete index of departments, medical equipment, clinical supplies,
            and pages on {SITE.name}.
          </p>
        </div>

        <div className="mt-6 space-y-8">
          <section aria-label="Site Navigation">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">
              Core Pages
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PAGE_GROUPS.map((group) => (
                <div
                  key={group.title}
                  className="rounded-md border border-border bg-card p-3.5 transition-all hover:border-primary/50"
                >
                  <h3 className="border-b border-border pb-1.5 text-xs font-bold text-foreground">
                    {group.title}
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          prefetch={false}
                          href={link.href}
                          className={linkClass}
                        >
                          <ChevronRight
                            size={11}
                            className="shrink-0 text-primary"
                          />
                          <span>{link.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="sitemap-departments"
            className={sectionClass}
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <FolderTree size={15} className="text-primary" />
                <h2
                  id="sitemap-departments"
                  className="text-xs font-bold text-foreground"
                >
                  Product Departments
                </h2>
              </div>
              <span className={countClass}>
                {categories.length} Departments
              </span>
            </div>

            {categories.length > 0 ? (
              <div className="mt-3 gap-x-6 sm:columns-2 lg:columns-3 xl:columns-4">
                {categories.map((category) => (
                  <div key={category.slug} className="mb-4 break-inside-avoid">
                    <Link
                      prefetch={false}
                      href={categoryHref(category.slug)}
                      className="text-xs font-bold text-foreground transition-colors duration-150 hover:text-primary hover:underline"
                    >
                      {category.name}
                    </Link>
                    {category.children.length > 0 && (
                      <ul className="mt-1.5 space-y-1.5">
                        {category.children.map((child) => (
                          <li key={child.slug}>
                            <Link
                              prefetch={false}
                              href={categoryHref(child.slug)}
                              className={linkClass}
                            >
                              <ChevronRight
                                size={11}
                                className="shrink-0 text-primary"
                              />
                              <span>{child.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                No departments listed.
              </p>
            )}
          </section>

          <section
            aria-labelledby="sitemap-collections"
            className={sectionClass}
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <LayoutGrid size={15} className="text-primary" />
                <h2
                  id="sitemap-collections"
                  className="text-xs font-bold text-foreground"
                >
                  Curated Collections
                </h2>
              </div>
              <span className={countClass}>
                {collections.length} Collections
              </span>
            </div>

            {collections.length > 0 ? (
              <RecordList
                records={collections}
                pathFor={(slug) => `/collections/${slug}`}
                columns="sm:columns-2 md:columns-3 lg:columns-4"
              />
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                No collections listed.
              </p>
            )}
          </section>

          <section aria-labelledby="sitemap-products" className={sectionClass}>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <Package size={15} className="text-primary" />
                <h2
                  id="sitemap-products"
                  className="text-xs font-bold text-foreground"
                >
                  Catalog Products Index
                </h2>
              </div>
              <span className={countClass}>{products.length} Products</span>
            </div>

            {products.length > 0 ? (
              <RecordList
                records={products}
                pathFor={(slug) => `/products/${slug}`}
                columns="sm:columns-2 md:columns-3 lg:columns-4"
              />
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                No products listed.
              </p>
            )}
          </section>

          <section aria-labelledby="sitemap-blogs" className={sectionClass}>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <FileText size={15} className="text-primary" />
                <h2
                  id="sitemap-blogs"
                  className="text-xs font-bold text-foreground"
                >
                  Field Notes & Technical Articles
                </h2>
              </div>
              <span className={countClass}>{blogs.length} Articles</span>
            </div>

            {blogs.length > 0 ? (
              <RecordList
                records={blogs}
                pathFor={(slug) => `/blogs/${slug}`}
                columns="sm:columns-2 lg:columns-3"
              />
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                No blog posts available.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
