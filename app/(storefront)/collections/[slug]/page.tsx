import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionDetailView } from "@/components/site/collections/collection-detail-view";
import {
  getAllCollections,
  getCollectionBySlug,
  getCollectionProductsPage,
} from "@/lib/data/collections";
import { toStorefrontProduct } from "@/lib/mappers/product";
import { PAGE_SIZE, parseCollectionQuery } from "@/lib/data/collection-query";
import { SITE } from "@/lib/constants";

type SearchParams = Record<string, string | string[] | undefined>;
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateStaticParams() {
  const collections = await getAllCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};

  const { page } = parseCollectionQuery(sp);
  const description =
    collection.description ??
    `Shop the ${collection.name} collection at ${SITE.name}.`;

  return {
    title:
      page > 1
        ? `${collection.name} – Page ${page} | ${SITE.name}`
        : `${collection.name} | ${SITE.name}`,
    description,
    alternates: {
      canonical:
        page > 1
          ? `/collections/${collection.slug}?page=${page}`
          : `/collections/${collection.slug}`,
    },
    openGraph: {
      title: collection.name,
      description,
      images: collection.coverImage ? [collection.coverImage] : undefined,
    },
  };
}

export default function CollectionPage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function CollectionContent({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const query = parseCollectionQuery(sp);

  const [collection, result, all] = await Promise.all([
    getCollectionBySlug(slug),
    getCollectionProductsPage(slug, query),
    getAllCollections(),
  ]);

  if (!collection) notFound();
  if (query.page > result.totalPages) notFound();

  const related = all
    .filter((c) => c.id !== collection.id)
    .map(({ slug, name }) => ({ slug, name }));

  return (
    <CollectionDetailView
      collection={{
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        coverImage: collection.coverImage,
      }}
      products={result.items.map(toStorefrontProduct)}
      related={related}
      query={query}
      total={result.total}
      totalPages={result.totalPages}
      pageSize={PAGE_SIZE}
    />
  );
}

function CollectionSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="h-7 w-56 animate-pulse rounded bg-soft" />
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="aspect-3/4 animate-pulse rounded-xs bg-soft"
          />
        ))}
      </div>
    </div>
  );
}
