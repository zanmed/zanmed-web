import type { Metadata } from "next";
import { FileText, ShieldCheck, Mail } from "lucide-react";
import { LAST_UPDATED, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE.name}`,
  description: `The terms and conditions governing your use of the ${SITE.name} digital catalog, medical equipment orders, biomedical installation services, and supply contracts.`,
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    body: [
      `By accessing or using the ${SITE.name} website, digital catalog, or procurement desk, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or procurement services.`,
    ],
  },
  {
    id: "products-and-orders",
    title: "Medical Products, Equipment & Quotations",
    body: [
      "We supply medical equipment, laboratory machinery, surgical consumables, dental units, mortuary supplies, and hospital furniture across Kenya. Product descriptions, technical specifications, and prices are provided in good faith but may occasionally contain inadvertent errors; we reserve the right to correct these and to cancel or adjust an order or proforma quotation affected by such an error.",
      "An order or procurement contract is confirmed once accepted by our sales desk—for example, upon issuance of an official quotation, invoice, or written order confirmation via email or WhatsApp. Placing an item in your cart or submitting an inquiry does not guarantee stock reservation or immediate dispatch.",
    ],
  },
  {
    id: "pricing-and-payment",
    title: "Pricing, Quotations & Payment",
    body: [
      `All prices listed on the site or in quotations are in Kenyan Shillings (KES) unless explicitly noted otherwise and are subject to adjustment until an order or contract is formally accepted. Approved payment methods (including M-Pesa, bank wire transfer, or corporate invoice terms) will be detailed on your official invoice.`,
    ],
  },
  {
    id: "delivery-and-installation",
    title: "Delivery & Biomedical Installation",
    body: [
      "We deliver medical supplies and machinery across Kenya. Estimated delivery schedules are provided for guidance; unexpected delays due to logistics, customs processing, or courier timelines outside our reasonable control may occur.",
      "For heavy medical machinery (such as CT Scanners, Digital X-Rays, or Dental Chairs) requiring professional installation or lead shielding preparation, technical site readiness requirements must be fulfilled prior to team dispatch.",
    ],
  },
  {
    id: "warranty-and-returns",
    title: "Warranty, Quality Guarantee & Returns",
    body: [
      "Medical equipment and machinery are covered by manufacturer or distributor warranties as specified in the product documentation or sale contract. Faulty or non-conforming items must be reported to our technical desk promptly upon receipt to facilitate inspection, repair, or replacement.",
      "Sterile consumables, opened reagents, and personal protective equipment (PPE) cannot be returned once opened or unsealed due to health and safety standards.",
    ],
  },
  {
    id: "website-use",
    title: "Website & Catalog Usage",
    body: [
      "You agree to use our website and catalog exclusively for lawful procurement purposes. You may not attempt to gain unauthorized access to any part of our website, servers, or connected systems.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    body: [
      `All website content—including text, branding, graphics, product photography, and documentation—is the property of ${SITE.name} or its licensing partners and is protected under applicable Kenyan and international intellectual property laws.`,
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    body: [
      `To the maximum extent permitted by Kenyan law, ${SITE.name} shall not be liable for any indirect, incidental, or consequential damages resulting from website use, delivery delays, or equipment operation beyond the monetary value of the specific order in question.`,
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law & Jurisdiction",
    body: [
      "These terms are governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes shall be subject to the exclusive jurisdiction of the competent courts of Kenya.",
    ],
  },
  {
    id: "changes",
    title: "Amendments to Terms",
    body: [
      "We reserve the right to revise these Terms of Service at any time. Continued use of our website or procurement services following updates constitutes acceptance of the modified terms.",
    ],
  },
  {
    id: "contact",
    title: "Contact & Legal Inquiries",
    body: [
      `Questions or concerns regarding these terms should be addressed to our legal and customer support desk at ${SITE.email}.`,
    ],
  },
];

const tocLink =
  "block rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors duration-150 hover:bg-[var(--soft)] hover:text-primary";

function TocList() {
  return (
    <ol className="space-y-0.5">
      {sections.map((section, i) => (
        <li key={section.id}>
          <a href={`#${section.id}`} className={tocLink}>
            <span className="font-mono text-primary mr-1">{i + 1}.</span>{" "}
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function TermsOfServicePage() {
  return (
    <main className="bg-background font-sans text-foreground py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <FileText size={13} /> Legal & Compliance
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Terms of Service
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            These terms govern your use of the {SITE.name} website, medical
            product orders, and equipment supply agreements.
          </p>
          <p className="mt-2 text-[10px] font-mono text-muted-foreground">
            Last updated:{" "}
            <time className="text-foreground">{LAST_UPDATED}</time>
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
          <details className="rounded-md border border-border bg-card p-3 lg:hidden">
            <summary className="cursor-pointer text-xs font-bold text-foreground">
              On this page
            </summary>
            <nav aria-label="Terms table of contents" className="mt-2">
              <TocList />
            </nav>
          </details>

          <nav
            aria-label="Terms sections"
            className="hidden self-start lg:sticky lg:top-24 lg:block"
          >
            <p className="px-2 pb-1.5 text-xs font-bold text-foreground">
              On this page
            </p>
            <TocList />
          </nav>

          <div className="max-w-3xl space-y-3">
            {sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-md border border-border bg-card p-3.5 sm:p-4 transition-all hover:border-primary/50"
              >
                <h2 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span className="font-mono text-primary">{i + 1}.</span>{" "}
                  {section.title}
                </h2>
                <div className="mt-1.5 space-y-1.5 text-[11px] sm:text-xs leading-relaxed text-muted-foreground">
                  {section.body.map((paragraph, j) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-6 rounded-md border border-border bg-soft p-4">
              <h2 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-primary" /> Questions
                regarding our terms?
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Our customer and legal compliance representatives are ready to
                assist.
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Mail size={12} /> {SITE.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
