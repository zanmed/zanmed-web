import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronDown,
  Stethoscope,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
  HelpCircle,
} from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, SITE } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Support & Help Center | ${SITE.name}`,
  description: `Find answers regarding medical equipment orders, quotations, nationwide delivery, biomedical warranty, and hospital procurement at ${SITE.name}.`,
  alternates: { canonical: "/support" },
};

const shippingAnswer =
  FREE_SHIPPING_THRESHOLD > 0
    ? `Your cart displays an estimated freight cost prior to checkout. Orders of ${formatCurrency(FREE_SHIPPING_THRESHOLD)} or more qualify for free delivery across Kenya. For heavy diagnostic machinery (e.g., CT Scanners, X-Rays), specialized transport logistics are confirmed with your order.`
    : "Your cart displays an estimated shipping cost before checkout. Final delivery costs and specialized transport for heavy medical equipment are confirmed directly via our sales desk.";

const groups = [
  {
    id: "orders",
    title: "Orders, Quotes & Payment",
    summary: "Placing orders, proforma invoices, and payment options",
    icon: ShoppingBag,
    faqs: [
      {
        q: "How do I place an order or request a quotation?",
        a: `Add medical products to your cart and select Checkout via WhatsApp or request an official proforma invoice. Your itemized request will send directly to our sales team. You can also visit our Nairobi showroom at ${SITE.address}.`,
      },
      {
        q: "When is my medical procurement order confirmed?",
        a: "An order is confirmed once accepted by our sales desk—typically upon issuance of an official quotation, proforma invoice, or written order confirmation via email or WhatsApp.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept M-Pesa, bank wire transfers, and cash. Corporate purchase orders (LPOs) and structured invoice payment terms are available for accredited hospitals, clinics, and government institutions.",
      },
      {
        q: "Can I modify or cancel an order after submission?",
        a: "Please contact our order desk immediately. Orders for stocked consumables can be updated prior to dispatch. Orders for customized machinery or specialized hospital furniture cannot be canceled once fabrication or transit begins.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Logistics & Delivery",
    summary: "Nationwide logistics, cold-chain, and dispatch timelines",
    icon: Truck,
    faqs: [
      {
        q: "Where do you deliver?",
        a: "We deliver across all 47 counties in Kenya and coordinate regional shipping into neighboring East African healthcare facilities.",
      },
      {
        q: "How are temperature-sensitive reagents and vaccines delivered?",
        a: "Laboratory reagents and temperature-sensitive supplies are transported in certified cold-chain insulated packaging to ensure product integrity upon arrival.",
      },
      {
        q: "How long does delivery take?",
        a: "Consumables and in-stock supplies in Nairobi ship within 24–48 hours. Heavy medical machinery or turnkey hospital furniture deliveries are scheduled based on site readiness.",
      },
      {
        q: "How much does delivery cost?",
        a: shippingAnswer,
      },
    ],
  },
  {
    id: "warranty",
    title: "Warranty & Biomedical Servicing",
    summary: "Equipment warranties, calibration, and returns",
    icon: ShieldCheck,
    faqs: [
      {
        q: "Do medical machines come with a warranty?",
        a: "Yes. All diagnostic equipment, imaging machinery (CT, X-Ray, Ultrasound), dental units, and lab analyzers come with written manufacturer or distributor warranties along with preventive maintenance options.",
      },
      {
        q: "What is your return policy for consumables?",
        a: "Unopened, non-perishable consumables and gear can be returned within 14 days of delivery. Sterile supplies, opened reagents, and personalized PPE cannot be returned once unsealed.",
      },
      {
        q: "What should I do if equipment arrives damaged or faulty?",
        a: "Contact our technical support desk immediately with your invoice number and photos/video of the issue. Our biomedical engineers will arrange repair, replacement, or technical inspection.",
      },
    ],
  },
  {
    id: "products",
    title: "Equipment Selection & Facility Setup",
    summary: "Assistance with machinery specs and clinic setup",
    icon: Stethoscope,
    faqs: [
      {
        q: "I need help choosing equipment or outfitting a clinic.",
        a: "Our biomedical engineering team offers technical consultation for clinic setups, ICU outfitting, dental suites, and laboratory machinery. Contact us via phone, email, or WhatsApp for custom proposals.",
      },
      {
        q: "Are all products genuine and compliant with Kenyan medical standards?",
        a: "Yes. All products and equipment supplied by Zanmed are authentic, ISO-certified, and compliant with Ministry of Health (MOH) and Pharmacy and Poisons Board (PPB) regulations.",
      },
      {
        q: "Can I order items that are out of stock?",
        a: "Out-of-stock equipment or specialized medical machinery can be ordered on lead time. Contact our sales desk for expected arrival dates or alternative equivalents.",
      },
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groups.flatMap((group) =>
    group.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  ),
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function SupportPage() {
  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
    },
    {
      icon: Phone,
      label: "Sales & Technical Desk",
      value: SITE.phone,
      href: `tel:${SITE.phone.replace(/[^\d+]/g, "")}`,
    },
    {
      icon: MapPin,
      label: "Showroom & Depot",
      value: SITE.address,
      href: undefined,
    },
  ];

  return (
    <main className="bg-background font-sans text-foreground py-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <HelpCircle size={13} /> Help & Customer Care
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Support Center
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Frequently asked questions regarding medical supplies, machinery
            procurement, nationwide delivery, and warranty support.
          </p>
        </div>

        {/* Quick Topic Cards */}
        <nav aria-label="Support topics" className="mt-6">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map(({ id, title, summary, icon: Icon }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`group flex h-full items-start gap-3 rounded-md border border-border bg-card p-3.5 transition-all hover:border-primary ${focusRing}`}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-foreground">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                      {summary}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {groups.map((group) => (
              <section
                key={group.id}
                id={group.id}
                aria-labelledby={`${group.id}-heading`}
                className="scroll-mt-24"
              >
                <h2
                  id={`${group.id}-heading`}
                  className="text-base font-bold tracking-tight text-foreground"
                >
                  {group.title}
                </h2>
                <div className="mt-3 divide-y divide-border rounded-md border border-border bg-card">
                  {group.faqs.map((faq) => (
                    <details key={faq.q} className="group">
                      <summary
                        className={`flex cursor-pointer list-none items-center justify-between gap-3 p-3.5 text-xs font-semibold text-foreground transition-colors hover:bg-soft [&::-webkit-details-marker]:hidden ${focusRing}`}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          size={14}
                          aria-hidden="true"
                          className="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                        />
                      </summary>
                      <p className="px-3.5 pb-3.5 text-xs leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4">
            <div className="rounded-md border border-border bg-card p-4 lg:sticky lg:top-24">
              <h2 className="text-sm font-bold text-foreground">
                Need Direct Assistance?
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Our sales reps and biomedical engineers are available to help
                with your procurement needs.
              </p>

              <ul className="mt-4 space-y-3">
                {contactMethods.map(({ icon: Icon, label, value, href }) => {
                  const body = (
                    <>
                      <Icon
                        size={15}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      <span className="min-w-0">
                        <span className="block text-[10px] uppercase font-semibold text-muted-foreground">
                          {label}
                        </span>
                        <span className="block wrap-break-word text-xs font-medium text-foreground">
                          {value}
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          className={`flex gap-2.5 transition-colors hover:text-primary ${focusRing}`}
                        >
                          {body}
                        </a>
                      ) : (
                        <div className="flex gap-2.5">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/contact"
                className={`mt-5 inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 ${focusRing}`}
              >
                Contact Sales Team
              </Link>

              <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
                Read our{" "}
                <Link
                  href="/terms"
                  className={`text-primary underline underline-offset-2 ${focusRing}`}
                >
                  Terms of Service
                </Link>{" "}
                for full medical equipment warranty and delivery policies.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
