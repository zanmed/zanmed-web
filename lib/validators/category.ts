import { prisma } from "@/lib/prisma";

export async function assertValidCategoryParent(
  parentId: string | null,
  categoryId?: string,
) {
  if (!parentId) return;

  if (categoryId && parentId === categoryId) {
    throw new Error("A category cannot be its own parent.");
  }

  const parent = await prisma.category.findUnique({
    where: { id: parentId },
    select: { id: true, parentId: true },
  });

  if (!parent) {
    throw new Error("Selected parent category does not exist.");
  }

  if (parent.parentId) {
    throw new Error("Subcategories cannot be nested more than one level deep.");
  }

  if (categoryId) {
    const childCount = await prisma.category.count({
      where: { parentId: categoryId },
    });
    if (childCount > 0) {
      throw new Error(
        "This category already has subcategories and cannot become a subcategory itself.",
      );
    }
  }
}
