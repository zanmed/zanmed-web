"use client";

import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Search, X } from "lucide-react";

import type { SearchIndex, SearchScope } from "@/lib/data/search";
import {
  matchProducts,
  matchTerms,
  MIN_QUERY_LENGTH,
} from "@/lib/search-match";
import { formatCurrency } from "@/lib/utils";

interface SearchBarProps {
  index: SearchIndex;
  scopes: SearchScope[];
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
  autoFocus?: boolean;
}

export default function SearchBar({
  index,
  scopes,
  variant = "desktop",
  onNavigate,
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [scopeSlug, setScopeSlug] = useState<string | null>(
    scopes[0]?.slug ?? null,
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const trimmed = query.trim();
  // Typing stays instant; matching runs at lower priority.
  const deferred = useDeferredValue(trimmed);

  const products = useMemo(
    () => matchProducts(index.products, deferred, scopeSlug),
    [index.products, deferred, scopeSlug],
  );
  const categories = useMemo(
    () => matchTerms(index.categories, deferred),
    [index.categories, deferred],
  );

  const hrefs = useMemo(
    () => [
      ...products.map((product) => `/products/${product.slug}`),
      ...categories.map((category) => `/products?category=${category.slug}`),
    ],
    [products, categories],
  );

  // Close on outside press.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the keyboard-highlighted row visible inside the scrolling list.
  useEffect(() => {
    if (activeIndex < 0) return;
    document
      .getElementById(`${listboxId}-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listboxId]);

  function close() {
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
    onNavigate?.();
  }

  function go(href: string) {
    close();
    router.push(href);
  }

  function submit() {
    if (!trimmed) return;
    const params = new URLSearchParams({ q: trimmed });
    if (scopeSlug) params.set("category", scopeSlug);
    go(`/products?${params.toString()}`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Escape") {
      if (open) setOpen(false);
      else setQuery("");
      setActiveIndex(-1);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (hrefs.length === 0) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => {
        if (event.key === "ArrowDown") {
          return current + 1 >= hrefs.length ? 0 : current + 1;
        }
        return current <= 0 ? hrefs.length - 1 : current - 1;
      });
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const href = hrefs[activeIndex];
      if (href) go(href);
      else submit();
    }
  }

  const showDropdown = open && trimmed.length >= MIN_QUERY_LENGTH;
  const hasResults = hrefs.length > 0;
  const isMobile = variant === "mobile";

  return (
    <div
      ref={containerRef}
      className={
        isMobile ? "relative w-full" : "relative mx-auto w-full max-w-2xl"
      }
    >
      <div
        className={[
          "flex items-center rounded-md border border-border bg-background transition-colors duration-150 focus-within:border-primary",
          isMobile ? "h-10" : "h-11",
        ].join(" ")}
      >
        {!isMobile && scopes.length > 1 && (
          <div className="relative flex h-full shrink-0 items-center border-r border-border">
            <label htmlFor={`${listboxId}-scope`} className="sr-only">
              Limit search to a category
            </label>
            <select
              id={`${listboxId}-scope`}
              value={scopeSlug ?? ""}
              onChange={(event) => {
                setScopeSlug(event.target.value || null);
                setActiveIndex(-1);
                inputRef.current?.focus();
              }}
              className="h-full max-w-40 cursor-pointer appearance-none truncate rounded-l-md bg-transparent py-0 px-3.5 text-xs font-medium text-foreground outline-none"
            >
              {scopes.map((scope) => (
                <option
                  key={scope.slug ?? "all"}
                  value={scope.slug ?? ""}
                  className="bg-background text-foreground"
                >
                  {scope.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {isMobile && (
          <Search size={15} className="ml-3 shrink-0 text-muted-foreground" />
        )}

        <label htmlFor={`${listboxId}-input`} className="sr-only">
          Search products
        </label>
        <input
          id={`${listboxId}-input`}
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
          }
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          autoFocus={autoFocus}
          value={query}
          placeholder={
            isMobile
              ? "Search products..."
              : "Search home care, lab equipment, etc..."
          }
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-full w-full min-w-0 flex-1 appearance-none bg-transparent px-3 text-base text-foreground outline-none placeholder:text-muted-foreground md:text-sm [&::-webkit-search-cancel-button]:hidden"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="mr-1 grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-soft hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}

        <button
          type="button"
          onClick={submit}
          aria-label="Search"
          className={[
            "mr-1 grid shrink-0 place-items-center rounded-md bg-primary text-primary-foreground transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isMobile ? "size-8" : "h-9 px-5",
          ].join(" ")}
        >
          <Search size={isMobile ? 14 : 16} aria-hidden="true" />
        </button>
      </div>

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute inset-x-0 top-full z-50 mt-1 max-h-[70vh] overflow-y-auto overscroll-contain rounded-md border border-border bg-background shadow-lg"
        >
          {!hasResults ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No matches for “{trimmed}”. Try a shorter term.
            </p>
          ) : (
            <>
              {products.length > 0 && (
                <ul role="presentation">
                  {products.map((product, i) => (
                    <li key={product.id} role="presentation">
                      <Link
                        id={`${listboxId}-${i}`}
                        role="option"
                        aria-selected={activeIndex === i}
                        href={`/products/${product.slug}`}
                        prefetch={false}
                        onClick={close}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={[
                          "flex items-center gap-3 border-b border-border px-3 py-2.5 transition-colors duration-150",
                          activeIndex === i ? "bg-soft" : "bg-background",
                        ].join(" ")}
                      >
                        <span className="relative size-11 shrink-0 overflow-hidden rounded-md border border-border bg-paper">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-contain p-1"
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {product.name}
                          </span>
                          {product.categoryName && (
                            <span className="block truncate text-xs text-muted-foreground">
                              {product.categoryName}
                            </span>
                          )}
                        </span>

                        {product.price > 0 && (
                          <span className="shrink-0 text-sm font-semibold text-foreground">
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {categories.length > 0 && (
                <ul role="presentation">
                  {categories.map((category, offset) => {
                    const i = products.length + offset;
                    return (
                      <li key={`category-${category.slug}`} role="presentation">
                        <Link
                          id={`${listboxId}-${i}`}
                          role="option"
                          aria-selected={activeIndex === i}
                          href={`/products?category=${category.slug}`}
                          prefetch={false}
                          onClick={close}
                          onMouseEnter={() => setActiveIndex(i)}
                          className={[
                            "flex items-center justify-between border-b border-border px-3 py-2 text-sm text-foreground transition-colors duration-150",
                            activeIndex === i ? "bg-soft" : "bg-background",
                          ].join(" ")}
                        >
                          {category.name}
                          <span className="text-xs text-muted-foreground">
                            Category
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              <button
                type="button"
                onClick={submit}
                className="block w-full bg-background px-3 py-2.5 text-left text-sm font-semibold text-foreground transition-colors duration-150 hover:bg-soft hover:text-primary"
              >
                See all results for “{trimmed}”
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
