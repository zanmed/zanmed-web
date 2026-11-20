import { Fragment } from "react";
import { ProductSection } from "@/components/site/product-section";
import { getHomePageSections } from "@/lib/data/products";
import { toStorefrontProduct } from "@/lib/mappers/product";
import CategoryTiles from "@/components/site/category-tiles";

import IdeasSection from "@/components/site/ideas";
import CollectionCallout from "@/components/site/CollectionCallout";
import HeroSection from "@/components/site/hero/hero-slides";

export default async function HomePage() {
  const sections = await getHomePageSections();

  return (
    <main>
      <div className="container">
        <HeroSection />
        <CategoryTiles />
        {sections.map((section, i) => (
          <Fragment key={section.key}>
            <ProductSection
              title={section.title}
              eyebrow={section.eyebrow}
              href={section.href}
              items={section.products.map(toStorefrontProduct)}
            />
          </Fragment>
        ))}
        <IdeasSection />
        <CollectionCallout />
      </div>
    </main>
  );
}
