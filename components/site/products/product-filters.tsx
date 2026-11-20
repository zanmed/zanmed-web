"use client";

import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useQueryStates } from "nuqs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  RotateCcw,
  SlidersHorizontal,
  X,
  Search,
  ChevronDown,
  Filter,
  Check,
  Stethoscope,
} from "lucide-react";

import {
  productFiltersParsers,
  clearSpecParams,
  parseSpecEntriesFromParams,
} from "@/lib/search-params";
import SpecFilters from "./spec-filters";
import {
  PRODUCT_CONDITION_LABELS,
  PRODUCT_CONDITIONS,
} from "@/lib/product-condition";

interface ProductFiltersProps {
  categories: { slug: string; name: string }[];
  collections: { slug: string; name: string }[];
  priceBounds: { min: number; max: number };
  filterableSpecs: Record<string, string[]>;
  children: ReactNode;
}

export function ProductFilters({
  categories,
  collections,
  priceBounds,
  filterableSpecs,
  children,
}: ProductFiltersProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useQueryStates(productFiltersParsers, {
    shallow: false,
    startTransition,
    clearOnDefault: true,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState(filters.q ?? "");

  useEffect(() => {
    setSearchDraft(filters.q ?? "");
  }, [filters.q]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQuery = filters.q ?? "";
      if (searchDraft !== currentQuery) {
        setFilters({ q: searchDraft.trim() || null, page: 1 });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchDraft, filters.q, setFilters]);

  const [priceDraft, setPriceDraft] = useState(
    filters.maxPrice ?? priceBounds.max,
  );

  useEffect(() => {
    setPriceDraft(filters.maxPrice ?? priceBounds.max);
  }, [filters.maxPrice, priceBounds.max]);

  function commitPrice(value: number) {
    const current = filters.maxPrice ?? priceBounds.max;
    if (value !== current) {
      setFilters({
        maxPrice: value === priceBounds.max ? null : value,
        page: 1,
      });
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => commitPrice(priceDraft), 350);
    return () => clearTimeout(timer);
  }, [priceDraft]);

  const validSpecLabels = useMemo(
    () => new Set(Object.keys(filterableSpecs)),
    [filterableSpecs],
  );

  const specEntries = useMemo(
    () => parseSpecEntriesFromParams(searchParams, validSpecLabels),
    [searchParams, validSpecLabels],
  );

  const specGroups = Object.entries(filterableSpecs).map(
    ([title, options]) => ({ title, options }),
  );

  function isSpecChecked(label: string, value: string) {
    return specEntries.some(
      (spec) => spec.label === label && spec.value === value,
    );
  }

  function navigateWithParams(params: URLSearchParams) {
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  function toggleSpec(label: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const checked = isSpecChecked(label, value);

    if (checked) {
      const remaining = params.getAll(label).filter((v) => v !== value);
      params.delete(label);
      for (const v of remaining) params.append(label, v);
    } else {
      params.append(label, value);
    }
    params.delete("page");
    navigateWithParams(params);
  }

  function clearSpecFilters() {
    const params = new URLSearchParams(searchParams.toString());
    clearSpecParams(params, validSpecLabels);
    params.delete("page");
    navigateWithParams(params);
  }

  function clearAllFilters() {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count += 1;
    if (filters.collection) count += 1;
    if (filters.condition) count += 1;
    if (filters.maxPrice != null) count += 1;
    if (filters.q) count += 1;
    count += specEntries.length;
    return count;
  }, [
    filters.category,
    filters.collection,
    filters.condition,
    filters.maxPrice,
    filters.q,
    specEntries,
  ]);

  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  const SidebarFilterPanel = () => (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <span className="font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 text-[10px]">
          <Filter size={12} className="text-primary" /> Filter Equipment
        </span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
          >
            <RotateCcw size={11} /> Clear ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="rounded-md border border-border bg-card p-3 space-y-2">
        <h3 className="font-bold text-foreground text-[11px] uppercase tracking-wider">
          Departments
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => setFilters({ category: null, page: 1 })}
              className={`w-full flex items-center justify-between px-2 py-1 rounded-xs transition-colors text-left ${
                !filters.category
                  ? "bg-primary text-primary-foreground font-bold"
                  : "text-muted-foreground hover:hover:bg-soft hover:text-foreground"
              }`}
            >
              <span>All Medical Equipment</span>
              {!filters.category && <Check size={12} />}
            </button>
          </li>
          {categories.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <li key={cat.slug}>
                <button
                  type="button"
                  onClick={() => setFilters({ category: cat.slug, page: 1 })}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded-xs transition-colors text-left ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground hover:hover:bg-soft hover:text-foreground"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {isSelected && <Check size={12} />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Collections Dropdown Panel */}
      <div className="rounded-md border border-border bg-card p-3 space-y-2">
        <h3 className="font-bold text-foreground text-[11px] uppercase tracking-wider">
          Curated Bundles
        </h3>
        <select
          value={filters.collection ?? ""}
          onChange={(e) =>
            setFilters({ collection: e.target.value || null, page: 1 })
          }
          className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-primary"
        >
          <option value="">All Collections</option>
          {collections.map((col) => (
            <option key={col.slug} value={col.slug}>
              {col.name}
            </option>
          ))}
        </select>
      </div>

      {/* Condition & Price Controls */}
      <div className="rounded-md border border-border bg-card p-3 space-y-3">
        <div>
          <h3 className="font-bold text-foreground text-[11px] uppercase tracking-wider mb-1.5">
            Condition
          </h3>
          <select
            value={filters.condition ?? ""}
            onChange={(e) =>
              setFilters({
                condition: (e.target.value || null) as typeof filters.condition,
                page: 1,
              })
            }
            className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-primary"
          >
            <option value="">Any Condition</option>
            {PRODUCT_CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>
                {PRODUCT_CONDITION_LABELS[cond]}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-border/60 pt-2.5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-foreground text-[11px] uppercase tracking-wider">
              Max Price
            </h3>
            <span className="font-mono text-[11px] font-bold text-primary">
              KES {priceDraft.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            step={500}
            value={priceDraft}
            onChange={(e) => setPriceDraft(Number(e.target.value))}
            onMouseUp={(e) =>
              commitPrice(Number((e.target as HTMLInputElement).value))
            }
            onTouchEnd={(e) =>
              commitPrice(Number((e.target as HTMLInputElement).value))
            }
            className="h-7 w-full cursor-pointer accent-primary"
          />
        </div>
      </div>

      {/* Dynamic Spec Attributes */}
      {specGroups.length > 0 && (
        <div className="rounded-md border border-border bg-card p-3">
          <SpecFilters
            groups={specGroups}
            selected={specEntries}
            onToggle={toggleSpec}
            onClear={clearSpecFilters}
          />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={[
        "w-full min-w-0 transition-opacity duration-200",
        isPending ? "opacity-60" : "opacity-100",
      ].join(" ")}
    >
      {/* Top Search & Sorting Bar */}
      <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-3 mb-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Search medical equipment, CT scanners, lab reagents..."
            className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Mobile Filter Trigger Button */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-semibold text-foreground hover:border-primary lg:hidden"
        >
          <SlidersHorizontal size={13} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label
            htmlFor="catalog-sort"
            className="text-[10px] uppercase font-bold text-muted-foreground"
          >
            Sort:
          </label>
          <select
            id="catalog-sort"
            value={filters.sort ?? "featured"}
            onChange={(e) =>
              setFilters({
                sort: e.target.value as typeof filters.sort,
                page: 1,
              })
            }
            className="h-8 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground outline-none focus:border-primary"
          >
            <option value="featured">Featured Equipment</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filter Tags Bar */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-4 pb-2 border-b border-border text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
            Active:
          </span>
          {filters.category && (
            <span className="inline-flex items-center gap-1 rounded-xs bg-soft border border-border px-2 py-0.5 text-[11px] font-medium text-foreground">
              Dept: {categories.find((c) => c.slug === filters.category)?.name}
              <button
                type="button"
                onClick={() => setFilters({ category: null })}
                className="text-muted-foreground hover:text-primary"
              >
                <X size={11} />
              </button>
            </span>
          )}
          {filters.collection && (
            <span className="inline-flex items-center gap-1 rounded-xs bg-soft border border-border px-2 py-0.5 text-[11px] font-medium text-foreground">
              Bundle:{" "}
              {collections.find((c) => c.slug === filters.collection)?.name}
              <button
                type="button"
                onClick={() => setFilters({ collection: null })}
                className="text-muted-foreground hover:text-primary"
              >
                <X size={11} />
              </button>
            </span>
          )}
          {filters.condition && (
            <span className="inline-flex items-center gap-1 rounded-xs bg-soft border border-border px-2 py-0.5 text-[11px] font-medium text-foreground">
              Cond: {PRODUCT_CONDITION_LABELS[filters.condition]}
              <button
                type="button"
                onClick={() => setFilters({ condition: null })}
                className="text-muted-foreground hover:text-primary"
              >
                <X size={11} />
              </button>
            </span>
          )}
          {specEntries.map((spec) => (
            <span
              key={`${spec.label}-${spec.value}`}
              className="inline-flex items-center gap-1 rounded-xs bg-soft border border-border px-2 py-0.5 text-[11px] font-medium text-foreground"
            >
              {spec.label}: {spec.value}
              <button
                type="button"
                onClick={() => toggleSpec(spec.label, spec.value)}
                className="text-muted-foreground hover:text-primary"
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-[11px] font-bold text-primary hover:underline ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid Layout: Sticky Left Sidebar + Results Main */}
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)]">
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <SidebarFilterPanel />
          </div>
        </aside>

        {/* Results Stream */}
        <main className="min-w-0">{children}</main>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          drawerOpen ? "" : "pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-background/80 backdrop-blur-xs transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          role="dialog"
          aria-modal="true"
          className={`absolute inset-y-0 right-0 w-full max-w-xs flex flex-col border-l border-border bg-card shadow-xl transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border p-3.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Filter Medical Equipment
            </h2>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-soft"
            >
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5">
            <SidebarFilterPanel />
          </div>

          <div className="flex gap-2 border-t border-border p-3">
            <button
              type="button"
              onClick={clearAllFilters}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-soft"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="flex-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
