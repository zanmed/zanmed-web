"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ImageOff,
  PackageSearch,
  Search,
  Stethoscope,
} from "lucide-react";

export interface CollectionItem {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  _count: { products: number };
}

type SortKey = "name" | "products";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name", label: "Name (A–Z)" },
  { value: "products", label: "Most products" },
];

const controlClass =
  "h-8 border border-border bg-card px-2.5 text-xs text-foreground outline-none transition-colors duration-150 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring";

function CollectionCard({
  collection,
  priority,
}: {
  collection: CollectionItem;
  priority: boolean;
}) {
  const count = collection._count.products;

  return (
    <li className="flex">
      <Link
        href={`/collections/${collection.slug}`}
        className="group flex w-full flex-col overflow-hidden border border-border bg-card transition-all duration-200 hover:border-primary hover:shadow-xs"
      >
        <div className="relative aspect-4/3 overflow-hidden bg-soft">
          {collection.coverImage ? (
            <Image
              src={collection.coverImage}
              alt={collection.name}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-5" aria-hidden />
            </div>
          )}
          <span className="absolute left-2 top-2 rounded-xs bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-xs">
            {count} {count === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-between border-t border-border p-2.5">
          <div>
            <h3 className="line-clamp-1 text-xs font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
              {collection.name}
            </h3>
            {collection.description && (
              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                {collection.description}
              </p>
            )}
          </div>
          <span className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold text-primary">
            Browse Collection
            <ArrowRight
              className="size-3 transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </div>
      </Link>
    </li>
  );
}

export function CollectionsView({
  collections,
}: {
  collections: CollectionItem[];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const available = useMemo(
    () => collections.filter((c) => c._count.products > 0),
    [collections],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? available.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q),
        )
      : available;

    return [...filtered].sort((a, b) =>
      sort === "products"
        ? b._count.products - a._count.products || a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name),
    );
  }, [available, query, sort]);

  const totalProducts = available.reduce(
    (sum, c) => sum + c._count.products,
    0,
  );

  return (
    <div className="bg-background font-sans text-foreground py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
            Curated Healthcare Solutions
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Medical Collections
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Specialized packages and product bundles grouped for clinic setups,
            lab outfitting, bedridden patient care, and home health.
          </p>
          <p className="mt-2 text-[10px] font-mono text-muted-foreground">
            <span className="font-bold text-foreground">
              {available.length}
            </span>{" "}
            active collections ·{" "}
            <span className="font-bold text-foreground">{totalProducts}</span>{" "}
            medical products
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-soft p-2.5">
          <div className="relative w-full sm:max-w-xs">
            <label htmlFor="collection-search" className="sr-only">
              Search medical collections
            </label>
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              id="collection-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search collections..."
              className={`${controlClass} w-full pl-8 placeholder:text-muted-foreground`}
            />
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <p
              className="text-[11px] font-mono text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              {visible.length}{" "}
              {visible.length === 1 ? "collection" : "collections"}
            </p>
            <label htmlFor="collection-sort" className="sr-only">
              Sort collections
            </label>
            <select
              id="collection-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className={controlClass}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {visible.length > 0 ? (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((collection, i) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                priority={i < 5}
              />
            ))}
          </ul>
        ) : (
          <div className="mt-4 flex flex-col items-center border border-dashed border-border bg-card px-4 py-12 text-center">
            <PackageSearch
              className="size-8 text-muted-foreground"
              aria-hidden
            />
            <h2 className="mt-3 text-sm font-bold text-foreground">
              {available.length === 0
                ? "No active collections"
                : "No collections match your search"}
            </h2>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {available.length === 0
                ? "New curated medical bundles are being prepared. In the meantime, browse our product categories."
                : "Try a different search term or explore all product categories."}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="h-8 border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-soft"
                >
                  Clear Search
                </button>
              )}
              <Link
                href="/categories"
                className="inline-flex h-8 items-center bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 border-t border-border bg-soft py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h2 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Stethoscope size={14} className="text-primary" /> Need a Custom
              Clinic Setup Package?
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Our biomedical engineers assemble custom equipment and furniture
              bundles tailored to your facility requirements.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/categories"
              className="inline-flex h-8 items-center border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-soft"
            >
              All Categories
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-8 items-center bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Request Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
