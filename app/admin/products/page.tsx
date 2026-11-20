import Link from "next/link";
import { Plus } from "lucide-react";
import AdminPageFrame from "@/components/admin/pages/AdminPageFrame";
import { DataTable } from "@/components/admin/data-table/data-table";
import { getAllProductsForAdmin } from "@/lib/data/products";

import {
  productColumns,
  productColumnMeta,
  type AdminProductRow,
} from "@/components/admin/products/columns";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  const rows: AdminProductRow[] = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    image: product.image,
    price: Number(product.price),
    inStock: product.inStock,
    featured: product.featured,
    category: product.category ? { name: product.category.name } : null,
  }));

  return (
    <AdminPageFrame
      eyebrow="Content"
      title="Products"
      description="Manage your products and inventory."
      action={
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-ink px-4 py-3 text-[10px] uppercase tracking-widest text-paper"
        >
          <Plus size={15} /> New product
        </Link>
      }
    >
      <DataTable
        columns={productColumns}
        data={rows}
        columnMeta={productColumnMeta}
        searchKeys={["name", "slug", "category.name"]}
        searchPlaceholder="Search products…"
        title="All products"
        description={`${rows.length} total`}
        emptyMessage="No products yet."
      />
    </AdminPageFrame>
  );
}
