import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contact | ${SITE.name}`,
  description: `Get in touch with ${SITE.name} in Nairobi, Kenya, for expert advice on medical equipment and clinical procurement.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Medical Equipment & Clinical Procurement Insights | Zanmed`,
    description:
      "Technical reviews, hospital outfitting advice, and lab equipment guides written for healthcare professionals in East Africa.",
    type: "website",
  },
};

export default function ContactPage() {
  return <InfoPage kind="contact" />;
}
