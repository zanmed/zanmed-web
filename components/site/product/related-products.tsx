import { toStorefrontProduct } from "@/lib/mappers/product";
import { ProductGrid } from "../product-grid";

interface RelatedProductsProps {
  products: Parameters<typeof toStorefrontProduct>[0][];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  const items = products.map(toStorefrontProduct);

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Related Products
      </h2>
      <ProductGrid items={items} compact />
    </section>
  );
}
