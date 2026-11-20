import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SITE } from "@/lib/constants";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import {
  buildProductJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/structured-data";
import { ProductGallery } from "@/components/site/product/product-gallery";
import { PurchasePanel } from "@/components/site/product/purchase-panel";
import { ProductInfoSections } from "@/components/site/product/product-info-sections";
import { RelatedProducts } from "@/components/site/product/related-products";
import BreadcrumbBasic from "@/components/site/product/breadcrumb";

type Props = { params: Promise<{ slug: string }> };

function toPlainText(html: string, max = 160) {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const url = `${SITE.siteUrl}/products/${product.slug}`;
  const title = product.metaTitle ?? product.name;
  const description =
    product.metaDescription ??
    product.shortDescription ??
    toPlainText(product.description);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [
        { url: product.image, width: 900, height: 900, alt: product.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}

function ProductSkeleton() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-2 lg:px-8">
      <div className="aspect-square animate-pulse rounded-md bg-soft border border-border" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-28 animate-pulse rounded bg-soft" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-soft" />
        <div className="h-10 w-1/3 animate-pulse rounded bg-soft" />
      </div>
    </main>
  );
}

export default function ProductPage({ params }: Props) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id, 5);

  const productJsonLd = buildProductJsonLd(product);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE.siteUrl },
    { name: "Products", url: `${SITE.siteUrl}/products` },
    {
      name: product.category.name,
      url: `${SITE.siteUrl}/products?category=${product.category.slug}`,
    },
    { name: product.name, url: `${SITE.siteUrl}/products/${product.slug}` },
  ]);

  const { price, compareAtPrice } = product;
  const discountPercent =
    price !== null && compareAtPrice !== null && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const colorSpecRaw = product.specs.find((s) =>
    ["color", "colour"].includes(s.label.toLowerCase()),
  );
  const otherSpecs = product.specs.filter((s) => s.id !== colorSpecRaw?.id);

  return (
    <>
      <script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 lg:px-8 font-sans">
        <BreadcrumbBasic product={product} />

        <section className="grid gap-6 rounded-md border border-border bg-card p-4 sm:p-6 md:grid-cols-2 shadow-xs">
          <ProductGallery
            images={[product.image, ...product.gallery]}
            name={product.name}
            badge={product.featured ? "Featured Equipment" : null}
            discountPercent={discountPercent}
          />

          <PurchasePanel
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              inStock: product.inStock,
              image: product.image,
              shortDescription: product.shortDescription ?? "",
            }}
            colorSpec={
              colorSpecRaw
                ? { label: colorSpecRaw.label, value: colorSpecRaw.value }
                : null
            }
          />
        </section>

        <div className="rounded-md border border-border bg-card p-4 sm:p-6 shadow-xs">
          <ProductInfoSections
            description={product.description}
            specs={otherSpecs}
          />
        </div>

        {related.length > 0 && (
          <div className="rounded-md border border-border bg-card p-4 sm:p-6 shadow-xs">
            <RelatedProducts products={related} />
          </div>
        )}
      </main>
    </>
  );
}
