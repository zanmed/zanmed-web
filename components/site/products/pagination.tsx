import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductListFilters } from "@/lib/data/products";

function buildHref(filters: ProductListFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.categorySlug) params.set("category", filters.categorySlug);
  if (filters.collectionSlug) params.set("collection", filters.collectionSlug);
  if (filters.search) params.set("q", filters.search);
  if (filters.sort && filters.sort !== "featured")
    params.set("sort", filters.sort);
  if (filters.maxPrice !== undefined)
    params.set("maxPrice", String(filters.maxPrice));

  if (filters.specs) {
    for (const [label, values] of Object.entries(filters.specs)) {
      for (const value of values) params.append(label, value);
    }
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

function getPageItems(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("…");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("…");
  items.push(total);
  return items;
}

const pageItemClass =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors duration-150";

const navBtnClass =
  "inline-flex h-8 items-center gap-1 rounded-md border border-border bg-card px-2.5 text-xs font-semibold text-foreground transition-colors duration-150 hover:border-primary hover:bg-[var(--soft)]";

const navBtnDisabledClass =
  "inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 text-xs font-semibold text-muted-foreground opacity-50 cursor-not-allowed";

export function Pagination({
  filters,
  page,
  pageCount,
}: {
  filters: ProductListFilters;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex flex-wrap items-center justify-center gap-1.5"
    >
      {page > 1 ? (
        <Link href={buildHref(filters, page - 1)} className={navBtnClass}>
          <ChevronLeft className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Prev</span>
        </Link>
      ) : (
        <span aria-hidden className={navBtnDisabledClass}>
          <ChevronLeft className="size-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </span>
      )}

      <div className="flex items-center gap-1">
        {getPageItems(page, pageCount).map((item, i) =>
          item === "…" ? (
            <span
              key={`gap-${i}`}
              className="px-1 text-xs text-muted-foreground"
              aria-hidden
            >
              …
            </span>
          ) : item === page ? (
            <span
              key={item}
              aria-current="page"
              className={`${pageItemClass} border-primary bg-primary text-primary-foreground font-mono`}
            >
              {item}
            </span>
          ) : (
            <Link
              key={item}
              href={buildHref(filters, item)}
              aria-label={`Page ${item}`}
              className={`${pageItemClass} border-border bg-card text-foreground hover:border-primary hover:bg-soft font-mono`}
            >
              {item}
            </Link>
          ),
        )}
      </div>

      {page < pageCount ? (
        <Link href={buildHref(filters, page + 1)} className={navBtnClass}>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      ) : (
        <span aria-hidden className={navBtnDisabledClass}>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-3.5" />
        </span>
      )}
    </nav>
  );
}
