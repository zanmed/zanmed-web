import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

const base =
  "inline-flex h-9 min-w-9 items-center justify-center rounded border px-2.5 text-sm font-medium transition-colors duration-150";

export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-1.5"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          aria-label="Previous page"
          className={cn(base, "border-line hover:border-ink")}
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span aria-hidden className={cn(base, "border-line opacity-40")}>
          <ChevronLeft className="size-4" />
        </span>
      )}

      {getPageItems(page, totalPages).map((item, i) =>
        item === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-muted" aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              base,
              item === page
                ? "border-ink bg-ink text-paper"
                : "border-line hover:border-ink",
            )}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          aria-label="Next page"
          className={cn(base, "border-line hover:border-ink")}
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span aria-hidden className={cn(base, "border-line opacity-40")}>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
