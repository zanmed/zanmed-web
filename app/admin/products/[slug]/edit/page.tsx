import { notFound } from "next/navigation";

import AdminPageFrame from "@/components/admin/pages/AdminPageFrame";
import { ProductForm } from "@/components/admin/products/form";
import { updateProduct } from "@/lib/actions/products";
import { getProductBySlug } from "@/lib/data/products";
import { getAllCategoriesForAdmin } from "@/lib/data/categories";
import { getAllCollectionsForAdmin } from "@/lib/data/collections";
import { Suspense } from "react";

export const instant = false;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [categories, collections] = await Promise.all([
    getAllCategoriesForAdmin(),
    getAllCollectionsForAdmin(),
  ]);

  return (
    <Suspense fallback={<div className="p-5">Loading...</div>}>
      <AdminPageFrame
        eyebrow="Content"
        title="Edit product"
        description={product.name}
      >
        <ProductForm
          action={updateProduct.bind(null, product.id)}
          product={product}
          categories={categories}
          collections={collections}
        />
      </AdminPageFrame>
    </Suspense>
  );
}
