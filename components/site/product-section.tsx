import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toStorefrontProduct } from "@/lib/mappers/product";
import { ProductGrid } from "./product-grid";

type StorefrontProduct = ReturnType<typeof toStorefrontProduct>;

export function ProductSection({
  title,
  href = "/products",
  items,
  eyebrow,
}: {
  title: string;
  href?: string;
  items: StorefrontProduct[];
  eyebrow?: string;
}) {
  return (
    <section className="my-8 sm:my-10 space-y-4">
      <div className="flex items-end justify-between border-b border-border pb-3">
        <div className="space-y-0.5">
          {eyebrow && (
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          )}
          <h2 className="font-sans text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
        </div>

        <Link
          href={href}
          className="group relative inline-flex items-center gap-2 border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground transition-all duration-150 hover:border-primary hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
        >
          <span>View All</span>
          <ArrowRight
            size={13}
            className="text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-primary"
          />
        </Link>
      </div>
      <ProductGrid items={items} />
    </section>
  );
}
