import AdminPageFrame from "@/components/admin/pages/AdminPageFrame";
import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { CategoryPopoverForm } from "@/components/admin/categories/category-popover";
import {
  getAllCategoriesForAdmin,
  getTopLevelCategories,
} from "@/lib/data/categories";

export const instant = false;

export default async function AdminCategoriesPage() {
  const [categories, topLevelCategories] = await Promise.all([
    getAllCategoriesForAdmin(),
    getTopLevelCategories(),
  ]);

  const rows = categories.map((category) => {
    const parentName = category.parent?.name ?? "";
    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      subtitle: category.subtitle,
      icon: category.icon,
      order: category.order,
      active: category.active,
      parentId: category.parentId,
      parent: category.parent ? { name: category.parent.name } : null,
      childCount: category._count.children,
      productCount: category._count.products,
      searchText: `${category.name} ${category.slug} ${parentName}`,
    };
  });

  const parentOptions = topLevelCategories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <AdminPageFrame
      eyebrow="Content"
      title="Categories"
      description="Manage your categories and subcategories."
      action={
        <CategoryPopoverForm mode="create" parentOptions={parentOptions} />
      }
    >
      <CategoriesTable rows={rows} parentOptions={parentOptions} />
    </AdminPageFrame>
  );
}
