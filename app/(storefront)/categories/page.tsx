import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Categories | ${SITE.name}`,
  description: `Browse our categories of medical products and hospital equipment in Nairobi, Kenya.`,
  alternates: { canonical: "/categories" },
  openGraph: {
    title: `Medical Equipment & Clinical Procurement Insights | Zanmed`,
    description:
      "Technical reviews, hospital outfitting advice, and lab equipment guides written for healthcare professionals in East Africa.",
    type: "website",
  },
};

export default function CategoriesPage() {
  return <InfoPage kind="categories" />;
}
