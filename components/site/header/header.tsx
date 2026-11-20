"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Phone,
  Truck,
  LayoutGrid,
} from "lucide-react";

import CartDrawer from "./CartDrawer";
import { selectCartCount, useCartStore } from "@/lib/stores/cart-store";
import {
  ActiveNavLinks,
  StaticNavLinks,
  ActiveMobileNavLinks,
  StaticMobileNavLinks,
} from "./active-nav-links";
import { formatCurrency } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, SITE } from "@/lib/constants";
import type { SearchIndex, SearchScope } from "@/lib/data/search";
import SearchBar from "./searchbar";

interface CategoryLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface HeaderProps {
  CATEGORY_LINKS: CategoryLink[];
  SEARCH_INDEX: SearchIndex;
  SEARCH_SCOPES: SearchScope[];
}

export default function Header({
  CATEGORY_LINKS,
  SEARCH_INDEX,
  SEARCH_SCOPES,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartCount = useCartStore(selectCartCount);
  const subtotal = useCartStore((state) => state.subtotal);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!categoriesOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!categoriesRef.current?.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setCategoriesOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [categoriesOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const scrollY = window.scrollY;
    const { body } = document;
    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousWidth = body.style.width;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    const desktop = window.matchMedia("(min-width: 1024px)");
    function onBreakpoint(event: MediaQueryListEvent) {
      if (event.matches) setMobileOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    desktop.addEventListener("change", onBreakpoint);
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      body.style.position = previousPosition;
      body.style.top = previousTop;
      body.style.width = previousWidth;
      window.scrollTo(0, scrollY);

      desktop.removeEventListener("change", onBreakpoint);
      document.removeEventListener("keydown", onKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [mobileOpen]);

  const displayCount = mounted ? cartCount : 0;
  const displaySubtotal = mounted ? subtotal : 0;

  return (
    <div className="sticky top-0 z-50 w-full shadow-xs">
      <div className="hidden bg-primary text-primary-foreground lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-8 text-xs font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0" />
              Nationwide Delivery Across Kenya
            </span>
            <span className="flex items-center gap-2">
              <Truck size={14} className="shrink-0" />
              Free Shipping Over {formatCurrency(FREE_SHIPPING_THRESHOLD)}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="h-3.5 w-px bg-primary-foreground/30" />
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-1.5 font-semibold transition-opacity hover:opacity-85"
            >
              <Phone size={13} />
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <header className="relative z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-1 sm:px-4 lg:h-24 lg:gap-12 xl:gap-16 lg:px-6">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => {
              setMobileSearchOpen(false);
              setMobileOpen(true);
            }}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="grid size-10 shrink-0 place-items-center rounded-md text-foreground transition-colors hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            <Menu size={22} />
          </button>

          <Link
            href="/"
            aria-label="Zanmed Medical Supplies - Home"
            className="flex shrink-0 items-center mx-auto py-1.5 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image
              src="/logo.avif"
              alt="Zanmed Medical Supplies Ltd"
              width={500}
              height={120}
              priority
              className="h-10 w-auto object-contain sm:h-12 lg:h-20"
            />
          </Link>

          <div className="hidden px-2 lg:block lg:max-w-xl lg:flex-1 lg:px-4 xl:max-w-2xl">
            <SearchBar index={SEARCH_INDEX} scopes={SEARCH_SCOPES} />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((open) => !open)}
              aria-label="Toggle search"
              aria-expanded={mobileSearchOpen}
              className="grid size-10 place-items-center rounded-md text-foreground transition-colors hover:bg-soft lg:hidden"
            >
              {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            <span className="mx-1 hidden h-8 w-px bg-border lg:block" />

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${displayCount} items`}
              className="flex items-center gap-3 rounded-md border border-border bg-card px-3.5 py-2 text-foreground transition-all hover:border-primary hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="relative flex items-center justify-center">
                <ShoppingCart size={21} className="text-primary" />
                {displayCount > 0 && (
                  <span className="absolute -right-2.5 -top-2.5 grid size-5 place-items-center rounded-full bg-primary  text-[10px] font-bold text-primary-foreground shadow-xs">
                    {displayCount}
                  </span>
                )}
              </span>
              <span className="hidden text-left leading-tight lg:block">
                <span className="block text-xs font-semibold text-muted-foreground">
                  Order Cart
                </span>
                <span className="block text-xs font-bold text-foreground">
                  {formatCurrency(displaySubtotal)}
                </span>
              </span>
            </button>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="border-t border-border bg-card px-4 py-3 lg:hidden">
            <SearchBar
              index={SEARCH_INDEX}
              scopes={SEARCH_SCOPES}
              variant="mobile"
              autoFocus
              onNavigate={() => setMobileSearchOpen(false)}
            />
          </div>
        )}
      </header>

      <div className="hidden border-b border-border bg-card lg:block">
        <div
          ref={categoriesRef}
          className="relative mx-auto flex max-w-7xl items-center gap-6 px-8 py-2"
        >
          <button
            type="button"
            onClick={() => setCategoriesOpen((open) => !open)}
            aria-expanded={categoriesOpen}
            aria-controls="categories-panel"
            className="flex h-9 shrink-0 items-center gap-2 rounded-md bg-primary px-3.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LayoutGrid size={15} />
            All Categories
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                categoriesOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <span className="h-5 w-px bg-border" />

          <nav className="flex items-center gap-3 text-xs font-medium">
            <Suspense fallback={<StaticNavLinks />}>
              <ActiveNavLinks />
            </Suspense>
          </nav>

          <div
            id="categories-panel"
            hidden={!categoriesOpen}
            className="absolute left-8 right-8 top-full z-40 mt-1 overflow-hidden rounded-md border border-border bg-card shadow-lg"
          >
            <div className="grid grid-cols-3">
              {CATEGORY_LINKS.map(({ label, href, icon }, index) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setCategoriesOpen(false)}
                  className={`flex items-center gap-3 border-b border-border px-4 py-3 text-xs font-semibold text-foreground transition-colors hover:bg-soft hover:text-primary ${
                    index % 3 === 2 ? "" : "border-r"
                  }`}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-background text-primary">
                    {icon}
                  </span>
                  <span className="truncate">{label}</span>
                </Link>
              ))}
            </div>

            <Link
              href="/products"
              onClick={() => setCategoriesOpen(false)}
              className="block bg-soft px-5 py-2.5 text-center text-xs font-bold text-primary transition-colors hover:underline"
            >
              Explore Complete Medical Catalogue →
            </Link>
          </div>
        </div>
      </div>

      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-foreground/40 backdrop-blur-xs transition-opacity duration-200 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!mobileOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col border-r border-border bg-card shadow-xl transition-transform duration-200 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Zanmed Menu
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {mobileOpen && (
            <SearchBar
              index={SEARCH_INDEX}
              scopes={SEARCH_SCOPES}
              variant="mobile"
              onNavigate={() => setMobileOpen(false)}
            />
          )}

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Main Navigation
            </p>
            <div className="flex flex-col gap-1 text-xs">
              <Suspense
                fallback={
                  <StaticMobileNavLinks
                    onNavigate={() => setMobileOpen(false)}
                  />
                }
              >
                <ActiveMobileNavLinks onNavigate={() => setMobileOpen(false)} />
              </Suspense>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Categories
            </p>
            <div className="overflow-hidden rounded-md border border-border bg-background">
              {CATEGORY_LINKS.map(({ label, href, icon }, index) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-soft ${
                    index === CATEGORY_LINKS.length - 1
                      ? ""
                      : "border-b border-border"
                  }`}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-md text-primary">
                    {icon}
                  </span>
                  <span className="truncate">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 space-y-3 border-t border-border p-4">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              setCartOpen(true);
            }}
            className="flex w-full items-center justify-between rounded-md bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart size={16} />
              View Cart ({displayCount})
            </span>
            <span className="">{formatCurrency(displaySubtotal)}</span>
          </button>

          <a
            href={`tel:${SITE.phone}`}
            className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <Phone size={13} />
            {SITE.phone}
          </a>
        </div>
      </div>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartCount={cartCount}
      />
    </div>
  );
}
