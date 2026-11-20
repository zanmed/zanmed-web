import type { Metadata } from "next";
import { LAST_UPDATED, SITE } from "@/lib/constants";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE.name}`,
  description: `How ${SITE.name} collects, uses, and protects personal, medical procurement, and facility information shared with us through our website, WhatsApp, and procurement services in Kenya.`,
  alternates: { canonical: "/privacy" },
};

const sections: LegalSection[] = [
  {
    number: "1",
    title: "Information We Collect",
    body: [
      `We collect information you provide directly to us when inquiring about or ordering medical equipment, hospital furniture, lab consumables, or turnkey facility services. This includes your name, phone number, email address, medical facility/clinic details, delivery address, KRA PIN/tax details, and product inquiry specifications provided via web forms, proforma request tools, or WhatsApp messaging.`,
      "We also automatically collect standard technical metadata when you visit our site (IP address, browser type, device information, and pages viewed) through secure server logs and analytics tools to ensure site performance, security, and catalog availability.",
    ],
  },
  {
    number: "2",
    title: "How We Use Your Information",
    body: [
      "We use your information strictly to process orders, generate medical quotations and proforma invoices, coordinate delivery across Kenya's 47 counties, manage biomedical installation and warranty SLAs, and respond to institutional sales or technical inquiries.",
      "Messages initiated through our WhatsApp integration carry selected item lists, quantities, and page parameters directly to our support desk to facilitate immediate assistance.",
      "We do not sell, rent, or trade your personal or institutional data to third parties.",
    ],
  },
  {
    number: "3",
    title: "Information Sharing & Third Parties",
    body: [
      "We may share necessary procurement details with trusted third-party service providers who assist our operations—such as accredited logistics and courier partners, secure payment gateways, biomedical engineering installation teams, and cloud hosting infrastructure—solely to fulfill your order.",
      `We may also disclose information where mandated by law or regulatory bodies (such as the Pharmacy and Poisons Board or Ministry of Health in Kenya), or to protect the legal rights, safety, and operational integrity of ${SITE.name}, our clients, and the public.`,
    ],
  },
  {
    number: "4",
    title: "Cookies & Consent Management",
    body: [
      "Our website utilizes cookies and local browser storage to maintain cart items, remember session preferences, and ensure seamless navigation across our product catalog.",
      "Essential Cookies: These are strictly necessary for core website functions, including cart retention, session security, and network routing. They are enabled by default and cannot be disabled.",
      "Analytics & Performance Cookies: With your consent, we use privacy-focused analytics tools compliant with Google Consent Mode v2 to analyze visitor traffic and page performance across Kenya. Analytics consent is opt-in and can be customized or revoked at any time via our Cookie Preferences banner.",
    ],
  },
  {
    number: "5",
    title: "Data Retention & Compliance",
    body: [
      "We retain procurement and communication records only for as long as necessary to fulfill orders, maintain warranty and servicing records, and satisfy statutory accounting, tax, and medical equipment regulatory requirements under Kenyan law.",
    ],
  },
  {
    number: "6",
    title: "Your Data Protection Rights",
    body: [
      `In compliance with the Kenya Data Protection Act, 2019 (KDPA), you have the right to request access to, correction of, or deletion of your personal data held by us. You may also object to or request restrictions on data processing. To exercise these rights, please contact our Data Protection Office at ${SITE.privacyemail ?? SITE.email}.`,
    ],
  },
  {
    number: "7",
    title: "Data Security",
    body: [
      "We enforce appropriate technical and organizational safeguards to prevent unauthorized access, alteration, disclosure, or destruction of client and facility data. While we implement industry-standard encryption, SSL/TLS protocols, and secure cloud storage, no electronic transmission system can be guaranteed as 100% immune.",
    ],
  },
  {
    number: "8",
    title: "Policy Updates",
    body: [
      "We may update this Privacy Policy periodically to reflect operational, legal, or regulatory changes. Updated versions will be published on this page with a revised effective date.",
    ],
  },
  {
    number: "9",
    title: "Contact & Data Protection Inquiries",
    body: [
      `If you have questions regarding this Privacy Policy, your rights under the Kenya Data Protection Act, or our data handling practices for medical procurement, please contact us at:`,
      `Email: ${SITE.privacyemail ?? SITE.email}`,
      `Phone: ${SITE.phone}`,
      `Address: ${SITE.address}`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Compliance & Governance"
      heading="Privacy Policy"
      intro={`This policy outlines how ${SITE.name} ("we", "us", or "our") manages and safeguards personal and procurement data collected through our digital catalog, WhatsApp order desk, and customer support.`}
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  );
}
