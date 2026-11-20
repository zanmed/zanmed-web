import type { Metadata } from "next";

import { SITE } from "@/lib/constants";
import { getAllCollectionsForAdmin } from "@/lib/data/collections";
import { CollectionsView } from "@/components/site/collections/collections-view";

export const metadata: Metadata = {
  title: `Collections | ${SITE.name}`,
  description: `Explore our collections of medical products and hospital equipment in Nairobi, Kenya.`,
  alternates: { canonical: "/collections" },
  openGraph: {
    title: `Medical Equipment & Clinical Procurement Insights | Zanmed`,
    description:
      "Technical reviews, hospital outfitting advice, and lab equipment guides written for healthcare professionals in East Africa.",
    type: "website",
  },
};

export default async function CollectionsPage() {
  const collections = await getAllCollectionsForAdmin();
  return <CollectionsView collections={collections} />;
}
