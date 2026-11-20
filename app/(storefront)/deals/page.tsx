import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Deals | ${SITE.name}`,
  description: `Expert buying guides, biomedical maintenance tips, CT/X-Ray selection advice, and hospital construction insights from ${SITE.name} in Nairobi, Kenya.`,
  alternates: { canonical: "/deals" },
  openGraph: {
    title: `Medical Equipment & Clinical Procurement Insights | Zanmed`,
    description:
      "Technical reviews, hospital outfitting advice, and lab equipment guides written for healthcare professionals in East Africa.",
    type: "website",
  },
};
export default function DealsPage() {
  return <InfoPage kind="deals" />;
}
