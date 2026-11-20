import { SITE } from "@/lib/constants";
import { toPlainText } from "./utils";

type ProductForSchema = {
  slug: string;
  name: string;
  description: string;
  price: number | null;
  image: string;
  gallery: string[];
  inStock: boolean;
  condition: "NEW" | "REFURBISHED" | "USED";
  category?: { name: string } | null;
};

const ITEM_CONDITION = {
  NEW: "https://schema.org/NewCondition",
  REFURBISHED: "https://schema.org/RefurbishedCondition",
  USED: "https://schema.org/UsedCondition",
} as const;

export function buildProductJsonLd(product: ProductForSchema) {
  const url = `${SITE.siteUrl}/products/${product.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: toPlainText(product.description, 5000),
    image: [product.image, ...product.gallery].filter(Boolean),
    sku: product.slug,
    url,

    ...(product.category && { category: product.category.name }),

    // Quote-only products have no price, so they get no offer
    ...(product.price !== null && {
      offers: {
        "@type": "Offer",
        "@id": `${url}#offer`,
        url,
        priceCurrency: "KES",
        price: product.price,
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: ITEM_CONDITION[product.condition],
        priceValidUntil: nextYearISODate(),
        seller: {
          "@type": "Organization",
          name: SITE.name,
        },
      },
    }),
  };
}

function nextYearISODate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

export function buildBreadcrumbJsonLd(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
