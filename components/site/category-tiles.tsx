import Link from "next/link";

import { getTopLevelCategories } from "@/lib/data/categories";
import { getCategoryIcon } from "@/lib/constants";

export default async function CategoryTiles() {
  "use cache";

  const categories = await getTopLevelCategories();

  return (
    <div
      className="
        mt-4 flex gap-3 overflow-x-auto pb-2 
        scrollbar-none [&::-webkit-scrollbar]:hidden 
        md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0
      "
    >
      {categories.map((category) => {
        const Icon = getCategoryIcon(category.slug);

        return (
          <Link
            prefetch={false}
            key={category.id}
            href={`/products?category=${encodeURIComponent(category.slug)}`}
            className="
              group flex min-h-24 w-44 shrink-0 items-center gap-3 rounded-md
              border border-border bg-card p-3 transition-colors 
              hover:border-primary hover:bg-background md:w-auto md:shrink
            "
          >
            <span className="flex h-16 w-14 shrink-0 items-center justify-center rounded-md bg-soft text-brand transition-transform group-hover:scale-105">
              <Icon size={26} aria-hidden="true" />
            </span>

            <span className="min-w-0 flex-1">
              <strong className="block wrap-break-word text-xs font-semibold leading-snug text-foreground md:text-sm">
                {category.name}
              </strong>

              <span className="mt-1 block wrap-break-word text-[10px] leading-snug text-muted-foreground md:text-xs">
                {category.subtitle}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
