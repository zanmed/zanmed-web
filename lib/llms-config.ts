import { FREE_SHIPPING_THRESHOLD, SITE } from "@/lib/constants";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zanmedmedicalsupplies.co.ke"
).replace(/\/+$/, "");

export const MARKDOWN_TWINS = true;

export const LIMITS = {
  featuredProducts: 15,
  blogPosts: 10,
  maxProducts: 2000,
  subcategoryNames: 8,
} as const;

export const BUSINESS = {
  name: "Zanmed Medical Supplies Ltd",
  summary:
    "Zanmed Medical Supplies Ltd supplies medical, hospital and laboratory equipment and consumables in Kenya. Its customers include hospitals, clinics, schools, laboratories, institutions and individuals. Customers can shop online or request quotations for institutional purchases, subject to availability and confirmation.",
  email: "zanmedmedicalsupplies@gmail.com",
  address: "Scorpion Business Center, Munyu Road, Nairobi, Kenya",
  phone: SITE.phone as string,
  whatsappUrl: "https://wa.me/254757011738",
  freeShippingThreshold: Number(FREE_SHIPPING_THRESHOLD),
  payment:
    "Payment options are confirmed during ordering. Institutional customers can enquire about quotations and LPO orders.",
  delivery:
    "Delivery is available across Kenya, subject to destination, product availability and order confirmation.",
  assurances: [
    "Manufacturer warranties where applicable",
    "Product information and support through the sales team",
  ],
} as const;

/**
 * Optional editorial descriptions keyed by category slug.
 * The actual category names and slugs come from the database.
 */
export const CATEGORY_BLURBS: Record<string, string> = {
  "laboratory-equipment":
    "Laboratory instruments and diagnostic laboratory equipment",
  "lab-consumables-reagents":
    "Laboratory consumables, diagnostic test kits and reagents",
  "medical-equipment": "Medical monitoring and diagnostic equipment",
  "home-care": "Medical equipment and essentials for home-based care",
  "hospital-furniture": "Hospital beds, furniture and patient-care equipment",
  "mobility-aids": "Wheelchairs and mobility support equipment",
  "mortuary-equipment": "Mortuary equipment and related supplies",
  "operating-theatre": "Operating theatre and surgical equipment",
  "dental-equipment": "Dental equipment and supplies",
  "ppe-hygiene": "Personal protective equipment and hygiene supplies",
};

export const COMPANY_PAGES = [
  {
    name: "About Zanmed",
    path: "/about",
    note: "About the company and its products",
  },
  {
    name: "Contact",
    path: "/contact",
    note: "Contact information and business location",
  },
  {
    name: "Warranty and Support",
    path: "/support",
    note: "Product support and applicable warranty information",
  },
] as const;

export const OPTIONAL_PAGES = [
  {
    name: "Sitemap",
    path: "/sitemap",
    note: "Human-readable website directory",
  },
  {
    name: "Privacy Policy",
    path: "/privacy",
    note: "Privacy and personal data handling",
  },
  {
    name: "Terms and Conditions",
    path: "/terms",
    note: "Website and sales terms",
  },
] as const;

// ---------- URL helpers ----------

export function absolute(path: string): string {
  return `${SITE_URL}/${path.replace(/^\/+/, "")}`;
}

export function categoryUrl(slug: string): string {
  return absolute(`/products?category=${encodeURIComponent(slug)}`);
}

export function collectionUrl(slug: string): string {
  return absolute(`/products?collection=${encodeURIComponent(slug)}`);
}

export function productPageUrl(slug: string): string {
  return absolute(`/products/${encodeURIComponent(slug)}`);
}

export function productLlmsUrl(slug: string): string {
  return MARKDOWN_TWINS ? `${productPageUrl(slug)}.md` : productPageUrl(slug);
}

export function blogUrl(slug: string): string {
  return absolute(`/blogs/${encodeURIComponent(slug)}`);
}
