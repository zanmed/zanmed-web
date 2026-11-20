import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Mail, MapPin, Phone } from "lucide-react";

import { getAllCollections } from "@/lib/data/collections";
import { getTopLevelCategories } from "@/lib/data/categories";
import { toStorefrontProduct } from "@/lib/mappers/product";
import { SITE } from "@/lib/constants";

import { ProductGrid } from "./site/product-grid";
import { PageHeader } from "./site/page-header";
import { getDealsProducts } from "@/lib/data/products";

export type InfoPageKind = "contact" | "deals" | "collections" | "categories";

const CONTENT: Record<InfoPageKind, { title: string; description: string }> = {
  contact: {
    title: "Contact us",
    description:
      "Questions about an order, a product or which setup to choose? Send us a message and a real person will reply.",
  },
  deals: {
    title: "Deals",
    description:
      "Current offers on customer favourites, new arrivals and bundles.",
  },
  collections: {
    title: "Collections",
    description: "Groups of products chosen for a specific need or setup.",
  },
  categories: {
    title: "Shop by category",
    description: "Pick a category to see everything in it.",
  },
};

const primaryButton =
  "inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function InfoPage({ kind }: { kind: InfoPageKind }) {
  const { title, description } = CONTENT[kind];

  return (
    <main className="bg-paper text-ink">
      <PageHeader title={title} description={description} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {kind === "contact" && <ContactSection />}
        {kind === "deals" && (
          <Suspense fallback={<GridSkeleton />}>
            <DealsSection />
          </Suspense>
        )}
        {kind === "collections" && (
          <Suspense fallback={<GridSkeleton />}>
            <CollectionsSection />
          </Suspense>
        )}
        {kind === "categories" && (
          <Suspense fallback={<GridSkeleton />}>
            <CategoriesSection />
          </Suspense>
        )}
      </div>
    </main>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-md border border-dashed border-line px-6 py-16 text-center">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{message}</p>
      <Link href="/products" className={`${primaryButton} mt-5`}>
        Browse all products
      </Link>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid animate-pulse gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-18.5 rounded-md bg-paper" />
      ))}
    </div>
  );
}

function DirectoryGrid({
  items,
  param,
}: {
  items: { name: string; slug: string }[];
  param: "brand" | "collection" | "category";
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={`/products?${param}=${encodeURIComponent(item.slug)}`}
            className="group flex items-center gap-3 rounded-md border border-line bg-paper p-4 transition-colors duration-150 hover:border-bronze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-paper text-sm font-semibold text-ink"
            >
              {item.name.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-ink">
                {item.name}
              </span>
              <span className="block text-xs text-muted">View products</span>
            </span>
            <ChevronRight
              size={16}
              className="shrink-0 text-muted transition-colors duration-150 group-hover:text-bronze"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ContactSection() {
  const methods = [
    {
      icon: Mail,
      label: "Email Support Desk",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
    },
    {
      icon: Phone,
      label: "Sales & Engineering Hotline",
      value: SITE.phone,
      href: `tel:${SITE.phone.replace(/[^\d+]/g, "")}`,
    },
    {
      icon: MapPin,
      label: "Nairobi Showroom & Depot",
      value: SITE.address,
      href: undefined,
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Contact Methods List */}
      <ul className="grid content-start gap-2.5 lg:col-span-3">
        {methods.map(({ icon: Icon, label, value, href }) => {
          const body = (
            <>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-soft text-primary"
              >
                <Icon size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {label}
                </span>
                <span className="block wrap-break-word text-xs font-semibold text-foreground">
                  {value}
                </span>
              </span>
            </>
          );
          const base =
            "flex items-center gap-3 rounded-md border border-border bg-card p-3.5 transition-colors";
          return (
            <li key={label}>
              {href ? (
                <a
                  href={href}
                  className={`${base} hover:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
                >
                  {body}
                </a>
              ) : (
                <div className={base}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      {/* Speed Up Request Guidance Box */}
      <aside className="rounded-md border border-primary/30 bg-primary/5 p-4 lg:col-span-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-primary">
            <h2 className="text-xs font-bold text-foreground">
              For Faster Quotes & Proposals
            </h2>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Include the following in your inquiry so our team can prepare an
            accurate response:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] leading-relaxed text-muted-foreground">
            <li>Product models or technical specifications</li>
            <li>Facility/Clinic location & lead-time requirements</li>
            <li>LPO or proforma invoice request details</li>
          </ul>
        </div>

        <div className="mt-4 border-t border-border/60 pt-3">
          <p className="text-[11px] text-muted-foreground">
            Ready to order? Add items to your cart and send your list directly
            to our WhatsApp desk.
          </p>
          <Link href="/products" className={`${primaryButton} mt-2.5 w-full`}>
            Browse Equipment Catalog
          </Link>
        </div>
      </aside>
    </div>
  );
}

async function DealsSection() {
  const { products } = await getDealsProducts({ pageSize: 24 });

  if (products.length === 0) {
    return (
      <EmptyState
        title="No deals right now"
        message="New offers are added regularly. Check back soon, or browse the full catalogue."
      />
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted">
        {products.length} {products.length === 1 ? "product" : "products"} on
        offer
      </p>
      <ProductGrid items={products.map(toStorefrontProduct)} />
    </>
  );
}

async function CollectionsSection() {
  const collections = await getAllCollections();

  if (collections.length === 0) {
    return (
      <EmptyState
        title="No collections yet"
        message="Collections appear here as they are created. Browse all products in the meantime."
      />
    );
  }

  return <DirectoryGrid items={collections} param="collection" />;
}

async function CategoriesSection() {
  const categories = await getTopLevelCategories();

  if (categories.length === 0) {
    return (
      <EmptyState
        title="No categories yet"
        message="Categories appear here as products are added to the catalogue."
      />
    );
  }

  return <DirectoryGrid items={categories} param="category" />;
}
