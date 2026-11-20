import AdminPageFrame from "@/components/admin/pages/AdminPageFrame";
import { ProductForm } from "@/components/admin/products/form";
import { createProduct } from "@/lib/actions/products";

import { getAllCategoriesForAdmin } from "@/lib/data/categories";
import { getAllCollectionsForAdmin } from "@/lib/data/collections";

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    getAllCategoriesForAdmin(),
    getAllCollectionsForAdmin(),
  ]);
  return (
    <AdminPageFrame
      eyebrow="Content"
      title="New product"
      description="Create a new product for the store."
    >
      <ProductForm
        action={createProduct}
        categories={categories}
        collections={collections}
      />
    </AdminPageFrame>
  );
}
