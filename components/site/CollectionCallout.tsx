import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getAllCollections } from "@/lib/data/collections";

export default async function CollectionCallout() {
  "use cache";

  const collections = await getAllCollections();

  return (
    <section className="flex flex-col justify-between gap-6 border-y border-border py-8 md:flex-row">
      <div className="min-w-0 md:max-w-md lg:max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Quality Care
        </p>

        <h2 className="mt-1 font-sans text-2xl font-medium text-foreground md:text-3xl">
          Shop by collection
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Discover supplies that support healthcare professionals, clinics,
          labs, and home care needs.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:max-w-2xl md:justify-end">
        {collections.map((collection) => (
          <Link
            prefetch={false}
            key={collection.id}
            href={`/products?collection=${encodeURIComponent(collection.slug)}`}
            className="
              group flex items-center gap-2 rounded-md border border-border 
              px-4 py-2.5 text-sm font-medium text-foreground transition-all 
              hover:border-primary hover:bg-soft
            "
          >
            <span>{collection.name}</span>

            <ArrowRight
              size={16}
              className="shrink-0 text-primary transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
