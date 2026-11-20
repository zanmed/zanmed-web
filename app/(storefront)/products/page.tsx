import { Suspense } from "react";
import Link from "next/link";
import {
  Stethoscope,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import {
  getProducts,
  getProductPriceBounds,
  type ProductListFilters,
  getFilterableSpecs,
} from "@/lib/data/products";
import { getTopLevelCategories } from "@/lib/data/categories";
import { getAllCollections } from "@/lib/data/collections";
import { toStorefrontProduct } from "@/lib/mappers/product";
import {
  groupSpecEntries,
  parseSpecEntriesFromRaw,
  productSearchParamsCache,
} from "@/lib/search-params";
import { GridSkeleton } from "@/components/site/products/grid-skeleton";
import { FilterSummary } from "@/components/site/products/filter-summary";
import { Pagination } from "@/components/site/products/pagination";
import { ProductFilters } from "@/components/site/products/product-filters";
import { ProductGrid } from "@/components/site/products/product-grid";
import { SITE } from "@/lib/constants";

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const instant = false;

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const rawParams = await searchParams;

  const { category, collection, condition, q, sort, maxPrice, page } =
    productSearchParamsCache.parse(rawParams);

  const baseFilters: Omit<ProductListFilters, "specs"> = {
    categorySlug: category ?? undefined,
    collectionSlug: collection ?? undefined,
    condition: condition ?? undefined,
    search: q ?? undefined,
    sort,
    maxPrice: maxPrice ?? undefined,
    page,
  };

  const [categories, collections, priceBounds, filterableSpecs] =
    await Promise.all([
      getTopLevelCategories(),
      getAllCollections(),
      getProductPriceBounds(),
      getFilterableSpecs(baseFilters),
    ]);

  const validSpecLabels = new Set(Object.keys(filterableSpecs));
  const specEntries = parseSpecEntriesFromRaw(rawParams, validSpecLabels);

  const filters: ProductListFilters = {
    ...baseFilters,
    specs: specEntries.length > 0 ? groupSpecEntries(specEntries) : undefined,
  };

  const suspenseKey = JSON.stringify(filters);

  return (
    <div className="bg-background font-sans text-foreground py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-3 text-xs text-muted-foreground"
        >
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-foreground">Medical Catalog</li>
          </ol>
        </nav>

        <ProductFilters
          categories={categories}
          collections={collections}
          priceBounds={priceBounds}
          filterableSpecs={filterableSpecs}
        >
          <Suspense key={suspenseKey} fallback={<GridSkeleton />}>
            <ProductResults filters={filters} />
          </Suspense>
        </ProductFilters>
      </div>
    </div>
  );
}

async function ProductResults({ filters }: { filters: ProductListFilters }) {
  const { products, total, page, pageCount } = await getProducts(filters);

  const items = products.map(toStorefrontProduct);

  return (
    <>
      <FilterSummary count={total} />

      {items.length > 0 ? (
        <>
          <div className="mt-4">
            <ProductGrid items={items} />
          </div>

          <Pagination filters={filters} page={page} pageCount={pageCount} />
        </>
      ) : (
        <div className="mt-6 flex flex-col items-center rounded-md border border-dashed border-border bg-card px-4 py-12 text-center">
          <h2 className="text-sm font-bold text-foreground">
            No medical products match those filters
          </h2>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Try clearing or adjusting your filters, or contact our sales desk
            for custom equipment sourcing.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Reset All Filters
          </Link>
        </div>
      )}
    </>
  );
}
