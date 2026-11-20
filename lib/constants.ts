import {
  House,
  Tag,
  Truck,
  ShieldCheck,
  Headphones,
  Wallet,
  Accessibility,
  Microscope,
  Stethoscope,
  Building2,
  FlaskConical,
  HandHeart,
  BedDouble,
  Snowflake,
  Scissors,
  Smile,
  type LucideIcon,
} from "lucide-react";

export const SITE_NAME = "Zanmed Medical Supplies Ltd";

export const SITE_TITLE =
  "Zanmed Medical Supplies | Medical & Lab Equipment Kenya";

export const OG_TITLE =
  "Zanmed Medical Supplies | Medical & Lab Equipment Kenya";

export const SITE_DESCRIPTION =
  "Certified medical & laboratory equipment supplier in Kenya. PPB approved hospital furniture, reagents & devices with nationwide delivery.";

export const OG_DESCRIPTION =
  "Certified medical and laboratory equipment supplier in Kenya. PPB approved hospital supplies and reagents with nationwide delivery.";

export const SITE = {
  name: "Zanmed Medical Supplies Ltd",
  shortName: "ZANMED",
  tagline: "Trusted Medical & Laboratory Equipment, Delivered Across Kenya",
  region: "Kenya",
  phone: "+254 757 011 738",
  email: "zanmedmedicalsuppliesltd@yahoo.com",
  privacyemail: "zanmedmedicalsuppliesltd@yahoo.com",
  address: "Scorpio Business Center, Munyu Rd, Nairobi, Kenya",
  siteUrl: "https://zanmedmedicalsupplies.co.ke",
  whatsappNumber: "254757011738",
} as const;

export const LAST_UPDATED = "November 10, 2026";
export const CONSENT_KEY = "zanmed_cookie_consent_v1";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const PRODUCT_CATEGORIES = [
  {
    label: "Laboratory Equipment",
    value: "laboratory-equipment",
    icon: Microscope,
  },
  {
    label: "Lab Consumables & Reagents",
    value: "lab-consumables-reagents",
    icon: FlaskConical,
  },
  { label: "Medical Equipment", value: "medical-equipment", icon: Stethoscope },
  { label: "Home Care", value: "home-care", icon: HandHeart },
  { label: "Hospital Furniture", value: "hospital-furniture", icon: BedDouble },
  { label: "Mobility Aids", value: "mobility-aids", icon: Accessibility },
  { label: "Mortuary Equipment", value: "mortuary-equipment", icon: Snowflake },
  { label: "Operating Theatre", value: "operating-theatre", icon: Scissors },
  { label: "Dental Equipment", value: "dental-equipment", icon: Smile },
  { label: "PPE & Hygiene", value: "ppe-hygiene", icon: ShieldCheck },
] as const;

export const TOPICS = [
  {
    label: "Ask about a product",
    message: "Hello Zanmed Medical Supplies, I'd like help choosing a product.",
  },
  {
    label: "Request a quote",
    message:
      "Hello Zanmed Medical Supplies, I'd like a quotation. Items and quantities: ",
  },
  {
    label: "Delivery and payment",
    message:
      "Hello Zanmed Medical Supplies, I have a question about delivery and payment.",
  },
  {
    label: "Update on my order",
    message: "Hello Zanmed Medical Supplies, I'd like an update on my order.",
  },
];
export const HIDDEN_ON = ["/admin", "/login"];

const HEADER_CATEGORY_COUNT = 6;

export const CATEGORIES = [
  { href: "/products", label: "All", icon: House },
  ...PRODUCT_CATEGORIES.slice(0, HEADER_CATEGORY_COUNT).map((c) => ({
    href: `/products?category=${encodeURIComponent(c.value)}`,
    label: c.label,
    icon: c.icon,
  })),
  { href: "/deals", label: "Offers", icon: Tag },
];

export const CATEGORY_LINKS = CATEGORIES;

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61556699471022",
  instagram: "https://www.instagram.com/zanmedmedicalsuppliesltd",
  tiktok: "https://www.tiktok.com/@zanmedmedicalsuppliesltd",
} as const;

export const DEFAULT_OG_IMAGE = "/og-image.jpg";

export const footerLinks = {
  Shop: PRODUCT_CATEGORIES.slice(0, 4).map(
    (c) =>
      [c.label, `/products?category=${encodeURIComponent(c.value)}`] as const,
  ),
  Company: [
    ["About us", "/about"],
    ["Contact", "/contact"],
    ["Warranty & Support", "/support"],
  ],
} as const;

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppMessage(product: {
  name: string;
  slug: string;
  price: number;
}): string {
  return [
    `Hello Zanmed Medical Supplies, I'd like to order:`,
    `*${product.name}* — KES${product.price.toLocaleString()}`,
    `${SITE.siteUrl}/products/${product.slug}`,
  ].join("\n");
}

export function buildCartWhatsAppMessage(
  items: { name: string; slug: string; price: number; quantity: number }[],
): string {
  const lines = items.map(
    (i) =>
      `• ${i.name} x${i.quantity} — KES${(i.price * i.quantity).toLocaleString()}`,
  );
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return [
    `Hello Zanmed Medical Supplies, I'd like to order:`,
    ...lines,
    ``,
    `Total: KES ${total.toLocaleString()}`,
  ].join("\n");
}

export function buildQuoteWhatsAppMessage(
  items: { name: string; quantity: number }[],
  organisation?: string,
): string {
  return [
    `Hello Zanmed Medical Supplies, I'd like a quotation${organisation ? ` for ${organisation}` : ""}:`,
    ...items.map((i) => `• ${i.name} x${i.quantity}`),
    ``,
    `Please include pricing, availability and delivery timelines.`,
  ].join("\n");
}

export const MAX_STRING_LENGTH = 1000;
export const MAX_CART_ITEMS = 50;
export const TAX_RATE = 0;
export const FREE_SHIPPING_THRESHOLD = 500000;
export const STANDARD_SHIPPING = 500;

export const categoryIcons: Record<string, LucideIcon> = Object.fromEntries(
  PRODUCT_CATEGORIES.map((c) => [c.value, c.icon]),
);

export function getCategoryIcon(slug: string): LucideIcon {
  return categoryIcons[slug] ?? Stethoscope;
}

export const DEFAULT_BACKGROUND_IMAGE = "/hero-bg.jpg";

export const benefits = [
  [
    Truck,
    "Delivery Across Kenya",
    "Nationwide delivery, with an estimate when we confirm your order",
  ],
  [
    Wallet,
    "Flexible Payment",
    "Pay by M-Pesa, bank transfer or cash. Invoices available for institutions",
  ],
  [
    ShieldCheck,
    "Genuine Products",
    "Quality-checked equipment from trusted brands, with warranty where applicable",
  ],
  [
    Building2,
    "Institutional Supply",
    "Quotations for hospitals, clinics, schools, labs and tenders",
  ],
  [
    Headphones,
    "Real Support",
    "Talk to a person on WhatsApp or by phone for help choosing equipment",
  ],
] as const;

export const FAQ_ITEMS = [
  {
    q: "What does Zanmed Medical Supplies Ltd sell?",
    a: "We supply medical and laboratory equipment, including blood pressure monitors, diabetes care products, wheelchairs and mobility aids, therapy devices such as TENS units, microscopes and everyday consumables like colostomy bags.",
  },
  {
    q: "Who do you supply?",
    a: "Hospitals, clinics, schools, diagnostic labs, pharmacies and individuals. Institutions can request a quotation for bulk orders, contracts and tenders.",
  },
  {
    q: "Are your products genuine?",
    a: "Yes. We source from trusted brands and manufacturers, and each product page lists the brand, specifications and condition so you know what you are ordering.",
  },
  {
    q: "Do your products come with a warranty?",
    a: "Equipment such as monitors, microscopes and mobility aids comes with a warranty. The period is listed in each product's specifications and can vary by product and condition.",
  },
  {
    q: "How do I order from Zanmed?",
    a: "Order on WhatsApp from any product page, or add items to your cart and choose Checkout via WhatsApp. You can also visit us at Revlon Plaza, Biashara Street, Nairobi, or call or message +254 757 011 738.",
  },
  {
    q: "How do I request a quotation?",
    a: "Message us on WhatsApp or through the contact page with the items and quantities you need. We will reply with pricing, availability and delivery timelines.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept M-Pesa, bank transfer and cash. Institutions can request an invoice. We confirm the payment details with you when we confirm your order.",
  },
  {
    q: "What is your return policy?",
    a: "Unused items in their original, sealed packaging can be returned within 30 days of delivery. For hygiene and safety reasons, opened consumables and personal-use items cannot be returned unless faulty. Contact us with your order details and we will arrange it.",
  },
  {
    q: "Can I track my order?",
    a: "We send you updates on WhatsApp once your order ships.",
  },
];

export interface CategorySeed {
  name: string;
  icon: string;
  subtitle: string;
  children?: string[];
}

export const CATEGORY_TAXONOMY: CategorySeed[] = [
  {
    name: "Diagnostic & Monitoring",
    icon: "stethoscope",
    subtitle: "Stethoscopes, BP monitors, thermometers and more",
    children: [
      "Stethoscopes",
      "Blood Pressure Monitors",
      "Thermometers",
      "Pulse Oximeters",
      "Weighing Scales",
      "Vein Finders",
    ],
  },
  {
    name: "Diabetes Care",
    icon: "droplet",
    subtitle: "Glucose monitoring and testing supplies",
    children: ["Glucometers", "Test Strips & Lancets"],
  },
  {
    name: "Mobility Aids",
    icon: "accessibility",
    subtitle: "Wheelchairs, walkers and crutches",
    children: ["Wheelchairs", "Walking Frames", "Crutches & Canes"],
  },
  {
    name: "Home Care",
    icon: "house",
    subtitle: "Comfort and safety for care at home",
    children: ["Commode Chairs", "Toilet & Bathroom Aids"],
  },
  {
    name: "Consumables & Infection Control",
    icon: "shield-check",
    subtitle: "Gloves, ostomy care and waste disposal",
    children: [
      "Gloves & PPE",
      "Ostomy & Continence Care",
      "Waste Bins & Sharps",
    ],
  },
  {
    name: "Respiratory & Emergency",
    icon: "wind",
    subtitle: "Oxygen, suction and airway support",
    children: ["Oxygen Concentrators", "Suction Machines", "Nebulisers"],
  },
  {
    name: "Hospital Furniture",
    icon: "bed-double",
    subtitle: "Beds, stands and ward furniture",
    children: ["Hospital Beds", "Drip Stands & Trolleys"],
  },
  {
    name: "Physiotherapy & Rehab",
    icon: "activity",
    subtitle: "Therapy devices and rehabilitation equipment",
    children: [
      "TENS & Therapy Devices",
      "Exercise Equipment",
      "Treatment & Massage Beds",
    ],
  },
  {
    name: "Laboratory",
    icon: "flask-conical",
    subtitle: "Microscopes, centrifuges and lab supplies",
    children: ["Microscopes", "Centrifuges", "Lab Consumables"],
  },
  {
    name: "Operating Theatre",
    icon: "scissors",
    subtitle: "Theatre equipment, lamps and instruments",
    children: [
      "Theatre & Examination Lamps",
      "Surgical Instruments",
      "Theatre Equipment",
    ],
  },
  {
    name: "Dental",
    icon: "smile",
    subtitle: "Dental kits and equipment",
  },
];

export const MIN_CHILD_PRODUCTS = 1;
