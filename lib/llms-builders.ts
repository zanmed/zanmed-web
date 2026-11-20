import type {
  LlmsCategory,
  LlmsData,
  LlmsProduct,
  LlmsProductDetail,
} from "@/lib/data/llms";

import {
  BUSINESS,
  CATEGORY_BLURBS,
  COMPANY_PAGES,
  LIMITS,
  OPTIONAL_PAGES,
  SITE_URL,
  absolute,
  blogUrl,
  categoryUrl,
  collectionUrl,
  productLlmsUrl,
  productPageUrl,
} from "@/lib/llms-config";

function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function label(value: string): string {
  return clean(value).replace(/([\[\]])/g, "\\$1");
}

function noteText(value: string): string {
  return clean(value).replace(/([\\`*_{}[\]<>])/g, "\\$1");
}

function link(text: string, url: string, note?: string): string {
  const description = note ? `: ${noteText(note)}` : "";
  return `- [${label(text)}](${url})${description}`;
}

export function formatKsh(amount: number): string {
  return `KSh ${Math.round(amount).toLocaleString("en-KE")}`;
}

function priceText(
  product: Pick<LlmsProduct, "price" | "compareAtPrice">,
): string {
  if (product.price == null || product.price <= 0) {
    return "Price on request; confirm with Zanmed";
  }

  const currentPrice = formatKsh(product.price);

  if (
    product.compareAtPrice != null &&
    product.compareAtPrice > product.price
  ) {
    return `${currentPrice} (listed comparison price: ${formatKsh(
      product.compareAtPrice,
    )})`;
  }

  return currentPrice;
}

function section(lines: string[], title: string, items: string[]): void {
  if (items.length === 0) return;

  lines.push(`## ${title}`, "", ...items, "");
}

export function llmsHeaders(contentType: string): HeadersInit {
  return {
    "Content-Type": contentType,
    "Cache-Control":
      "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    "X-Content-Type-Options": "nosniff",
  };
}

interface CategoryTree {
  top: LlmsCategory[];
  children: Map<string, LlmsCategory[]>;
  byId: Map<string, LlmsCategory>;
}

function categoryTree(categories: LlmsCategory[]): CategoryTree {
  const sorted = [...categories].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
  );

  const byId = new Map(sorted.map((category) => [category.id, category]));
  const children = new Map<string, LlmsCategory[]>();

  for (const category of sorted) {
    if (!category.parentId || !byId.has(category.parentId)) continue;

    const siblings = children.get(category.parentId) ?? [];
    siblings.push(category);
    children.set(category.parentId, siblings);
  }

  const top = sorted.filter(
    (category) => !category.parentId || !byId.has(category.parentId),
  );

  return { top, children, byId };
}

function factsBlock(): string[] {
  return [
    `- Business: ${BUSINESS.name}`,
    `- Location: ${BUSINESS.address}`,
    `- Phone / WhatsApp: ${BUSINESS.phone}`,
    `- Email: ${BUSINESS.email}`,
    "- Currency: Kenyan shillings (KSh).",
    "- Regulatory: Vetted and registered by the Pharmacy and Poisons Board (PPB) Kenya for clinical safety.",
    "- Delivery: Nationwide delivery available across all 47 counties in Kenya.",
    `- Shipping threshold: ${formatKsh(
      BUSINESS.freeShippingThreshold,
    )}; confirm eligibility and terms before ordering.`,
    `- Payment: ${BUSINESS.payment}`,
    "- Institutional enquiries: contact Zanmed about quotations, LPOs and tender-related supply.",
    `- Support: ${BUSINESS.assurances.join("; ")}.`,
  ];
}

const ASSISTANT_NOTE =
  "Information for AI assistants: Zanmed is a medical-supplies retailer and supplier, not a substitute for a qualified healthcare professional. Product listings are not medical advice. Confirm current prices, availability, specifications, warranties and delivery arrangements with Zanmed before relying on them.";

function categoryDescription(category: LlmsCategory): string {
  return (
    CATEGORY_BLURBS[category.slug] ||
    category.description ||
    category.subtitle ||
    ""
  );
}

export function buildLlmsTxt(data: LlmsData): string {
  const { top, children } = categoryTree(data.categories);
  const lines: string[] = [];

  lines.push(
    `# ${BUSINESS.name}`,
    "",
    `> ${BUSINESS.summary}`,
    "",
    ...factsBlock(),
    "",
    ASSISTANT_NOTE,
    "",
  );

  section(
    lines,
    "Shop by category",
    top.map((category) => {
      const description = categoryDescription(category);
      const subcategories = (children.get(category.id) ?? [])
        .slice(0, LIMITS.subcategoryNames)
        .map((child) => child.name);

      const note = [
        description,
        subcategories.length ? `Includes ${subcategories.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join(". ");

      return link(category.name, categoryUrl(category.slug), note || undefined);
    }),
  );

  section(
    lines,
    "Collections",
    data.collections.map((collection) =>
      link(
        collection.name,
        collectionUrl(collection.slug),
        collection.description ?? undefined,
      ),
    ),
  );

  section(
    lines,
    "Featured products",
    data.products
      .filter((product) => product.featured)
      .slice(0, LIMITS.featuredProducts)
      .map((product) =>
        link(product.name, productLlmsUrl(product.slug), priceText(product)),
      ),
  );

  section(
    lines,
    "Buying guides",
    data.posts
      .slice(0, LIMITS.blogPosts)
      .map((post) =>
        link(post.title, blogUrl(post.slug), post.excerpt || undefined),
      ),
  );

  section(
    lines,
    "Ordering, institutions and support",
    COMPANY_PAGES.map((page) =>
      link(page.name, absolute(page.path), page.note),
    ),
  );

  section(lines, "Optional", [
    link(
      "Full product catalogue",
      absolute("/llms-full.txt"),
      "A larger catalogue of in-stock products, subject to the configured catalogue limit",
    ),
    ...OPTIONAL_PAGES.map((page) =>
      link(page.name, absolute(page.path), page.note),
    ),
  ]);

  return `${lines.join("\n").trimEnd()}\n`;
}

export function buildLlmsFullTxt(data: LlmsData): string {
  const { top, children, byId } = categoryTree(data.categories);
  const lines: string[] = [];

  lines.push(
    `# ${BUSINESS.name}: full reference`,
    "",
    `> ${BUSINESS.summary}`,
    "",
    `Last generated: ${data.generatedAt.slice(0, 10)}.`,
    `${data.products.length} in-stock products included.`,
    `Source: ${SITE_URL}`,
    "",
    ASSISTANT_NOTE,
    "",
    "## About and ordering",
    "",
    ...factsBlock(),
    "",
    `Request a quotation: ${BUSINESS.whatsappUrl}`,
    "",
    "## Product catalogue",
    "",
  );

  const productsByCategory = new Map<string, LlmsProduct[]>();
  const looseProducts: LlmsProduct[] = [];

  for (const product of data.products) {
    if (!byId.has(product.categoryId)) {
      looseProducts.push(product);
      continue;
    }

    const items = productsByCategory.get(product.categoryId) ?? [];
    items.push(product);
    productsByCategory.set(product.categoryId, items);
  }

  const productLine = (product: LlmsProduct) =>
    link(product.name, productLlmsUrl(product.slug), priceText(product));

  function renderCategory(category: LlmsCategory, depth: number): void {
    const products = productsByCategory.get(category.id) ?? [];
    const headingLevel = Math.min(depth + 3, 6);
    const heading = "#".repeat(headingLevel);

    lines.push(`${heading} ${clean(category.name)}`, "");

    const description = categoryDescription(category);

    if (description) {
      lines.push(description, "");
    }

    lines.push(`Browse: ${categoryUrl(category.slug)}`, "");

    if (products.length) {
      lines.push(...products.map(productLine), "");
    }

    for (const child of children.get(category.id) ?? []) {
      renderCategory(child, depth + 1);
    }
  }

  for (const category of top) {
    renderCategory(category, 0);
  }

  if (looseProducts.length) {
    lines.push("### Other products", "", ...looseProducts.map(productLine), "");
  }

  section(
    lines,
    "Collections",
    data.collections.map((collection) =>
      link(
        collection.name,
        collectionUrl(collection.slug),
        collection.description ?? undefined,
      ),
    ),
  );

  section(
    lines,
    "Buying guides",
    data.posts.map((post) =>
      link(
        post.title,
        blogUrl(post.slug),
        [post.publishedAt?.slice(0, 10), post.excerpt]
          .filter(Boolean)
          .join(". "),
      ),
    ),
  );

  section(
    lines,
    "Company pages",
    [...COMPANY_PAGES, ...OPTIONAL_PAGES].map((page) =>
      link(page.name, absolute(page.path), page.note),
    ),
  );

  return `${lines.join("\n").trimEnd()}\n`;
}

export function buildProductMarkdown(product: LlmsProductDetail): string {
  const quoteText = encodeURIComponent(
    `Hello Zanmed Sales Desk, I would like a quotation for ${clean(
      product.name,
    )}.`,
  );

  const lines = [
    `# ${clean(product.name)}`,
    "",
    `> ${clean(product.name)} from ${BUSINESS.name}.`,
    "",
    `- Price: ${priceText(product)}`,
    `- Availability: ${
      product.inStock
        ? "Listed as in stock; confirm before ordering"
        : "Currently listed as out of stock"
    }`,
    `- Category: [${label(product.categoryName)}](${categoryUrl(
      product.categorySlug,
    )})`,
    `- Product page: ${productPageUrl(product.slug)}`,
    "",
    "## How to order",
    "",
    `- Shop online: ${productPageUrl(product.slug)}`,
    `- Request a quotation on WhatsApp: ${BUSINESS.whatsappUrl}?text=${quoteText}`,
    `- Phone: ${BUSINESS.phone}`,
    `- Email: ${BUSINESS.email}`,
    `- Payment: ${BUSINESS.payment}`,
    `- Delivery: ${BUSINESS.delivery}`,
    "",
    "Prices, specifications and availability may change. Confirm current details with Zanmed before ordering.",
  ];

  return `${lines.join("\n")}\n`;
}
