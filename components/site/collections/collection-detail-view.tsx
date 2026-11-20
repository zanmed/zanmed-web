"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  PackageSearch,
  Filter,
  Layers,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { ProductGrid } from "@/components/site/product-grid";
import { Pagination } from "@/components/site/collections/pagination";
import type { toStorefrontProduct } from "@/lib/mappers/product";
import {
  CONDITIONS,
  SORT_KEYS,
  buildCollectionHref,
  type CollectionQuery,
  type ConditionKey,
  type SortKey,
} from "@/lib/data/collection-query";

type StorefrontProduct = ReturnType<typeof toStorefrontProduct>;

export interface CollectionDetail {
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
}

export interface RelatedCollection {
  slug: string;
  name: string;
}

const SORT_LABEL: Record<SortKey, string> = {
  featured: "Featured Equipment",
  newest: "Newest Arrivals",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

const CONDITION_LABEL: Record<ConditionKey, string> = {
  NEW: "Brand New",
  REFURBISHED: "Refurbished",
  USED: "Certified Pre-Owned",
};

const controlClass =
  "h-8  border border-border bg-card px-2.5 text-xs text-foreground outline-none transition-colors duration-150 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring";

export function CollectionDetailView({
  collection,
  products,
  related,

  query,
  total,
  totalPages,
  pageSize,
}: {
  collection: CollectionDetail;
  products: StorefrontProduct[];
  related: RelatedCollection[];

  query: CollectionQuery;
  total: number;
  totalPages: number;
  pageSize: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const basePath = `/collections/${collection.slug}`;

  const hrefFor = (page: number) =>
    buildCollectionHref(basePath, { ...query, page });

  const update = (patch: Partial<CollectionQuery>) =>
    startTransition(() =>
      router.replace(
        buildCollectionHref(basePath, { ...query, ...patch, page: 1 }),
        { scroll: false },
      ),
    );

  const hasFilters = !!query.brand || !!query.condition || query.inStock;
  const from = total === 0 ? 0 : (query.page - 1) * pageSize + 1;
  const to = Math.min(query.page * pageSize, total);

  return (
    <div className="bg-background font-sans text-foreground py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:underline mb-3"
        >
          <ArrowLeft size={13} /> Back to All Collections
        </Link>

        <div className="relative  border border-border bg-soft p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1 border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Medical Collection
              </span>
              <h1 className="mt-1 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {collection.description}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 text-xs">
              <span className=" bg-card border border-border px-3 py-1.5 font-mono font-bold text-foreground text-[11px]">
                {total} {total === 1 ? "Product" : "Products"} Available
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5  border border-border bg-card p-2.5 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="filter-condition" className="sr-only">
              Equipment Condition
            </label>
            <select
              id="filter-condition"
              value={query.condition ?? ""}
              onChange={(e) =>
                update({
                  condition: (e.target.value || undefined) as
                    | ConditionKey
                    | undefined,
                })
              }
              className={controlClass}
            >
              <option value="">Any condition</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {CONDITION_LABEL[c]}
                </option>
              ))}
            </select>

            <label className="flex h-8 cursor-pointer items-center gap-1.5  border border-border bg-card px-2.5 text-xs text-foreground transition-colors hover:bg-soft">
              <input
                type="checkbox"
                checked={query.inStock}
                onChange={(e) => update({ inStock: e.target.checked })}
                className="size-3.5 accent-primary rounded-xs"
              />
              In Stock Only
            </label>

            {hasFilters && (
              <Link
                href={buildCollectionHref(basePath, { sort: query.sort })}
                className="text-xs font-semibold text-primary underline-offset-2 hover:underline pl-1"
              >
                Clear filters
              </Link>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <p
              className="hidden text-[11px] font-mono text-muted-foreground sm:block"
              role="status"
              aria-live="polite"
            >
              {total === 0 ? "0 results" : `Showing ${from}–${to} of ${total}`}
            </p>
            <label htmlFor="sort" className="sr-only">
              Sort products
            </label>
            <select
              id="sort"
              value={query.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className={controlClass}
            >
              {SORT_KEYS.map((k) => (
                <option key={k} value={k}>
                  {SORT_LABEL[k]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {products.length > 0 ? (
          <>
            <div
              className={`mt-4 transition-opacity duration-150 ${
                isPending ? "opacity-60" : ""
              }`}
              aria-busy={isPending}
            >
              <ProductGrid items={products} />
            </div>
            <div className="mt-6">
              <Pagination
                page={query.page}
                totalPages={totalPages}
                hrefFor={hrefFor}
              />
            </div>
          </>
        ) : (
          <div className="mt-4 flex flex-col items-center  border border-dashed border-border bg-card px-4 py-12 text-center">
            <PackageSearch
              className="size-8 text-muted-foreground"
              aria-hidden
            />
            <h2 className="mt-3 text-sm font-bold text-foreground">
              {hasFilters
                ? "No products match your selected filters"
                : "No products in this collection currently"}
            </h2>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {hasFilters
                ? "Try adjusting or clearing your filters to view more products."
                : "Contact our sales desk for custom procurement or alternative machinery options."}
            </p>
            <div className="mt-4 flex gap-2">
              {hasFilters && (
                <Link
                  href={buildCollectionHref(basePath, { sort: query.sort })}
                  className="inline-flex h-8 items-center  border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-soft"
                >
                  Clear Filters
                </Link>
              )}
              <Link
                href="/collections"
                className="inline-flex h-8 items-center  bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                All Collections
              </Link>
            </div>
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-8 border-t border-border pt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Related Medical Collections
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {related.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/collections/${c.slug}`}
                    className="inline-flex h-7 items-center  border border-border bg-card px-2.5 text-xs font-medium text-foreground transition-all hover:border-primary hover:text-primary"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
