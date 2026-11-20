import Link from "next/link";
import { PackageX, ArrowUpRight } from "lucide-react";

interface StockAlertRow {
  id: string;
  name: string;
  category: { name: string } | null;
}

export function StockAlertsPanel({ products }: { products: StockAlertRow[] }) {
  return (
    <section className="border border-border bg-white/40">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
        <h3 className="font-serif text-lg sm:text-xl">Out of stock</h3>
        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-bronze-dark hover:text-ink"
        >
          Manage <ArrowUpRight size={12} />
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-ink/50">
          Everything is in stock.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center gap-3 px-4 py-3 sm:px-5"
            >
              <PackageX size={16} className="shrink-0 text-red-500" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="truncate text-[11px] text-ink/50">
                  {[product.category?.name].filter(Boolean).join(" · ") ||
                    "Unassigned"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
