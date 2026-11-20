"use server";

import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/require-permission";
import { categorySchema } from "@/lib/validations/category";
import { assertValidCategoryParent } from "@/lib/validators/category";
import { fieldErrorsFrom, type ActionState } from "@/lib/utils";
import { NO_PERMISSION, SLUG_TAKEN, hasErrorCode } from "./shared";

function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    subtitle: formData.get("subtitle") || "",
    icon: formData.get("icon") || "",
    order: formData.get("order") ?? 0,
    active:
      formData.get("active") === "on" || formData.get("active") === "true",
    parentId: formData.get("parentId") || "",
  });
}

function parentError(err: unknown): ActionState {
  const message =
    err instanceof Error ? err.message : "Invalid parent category.";
  return { status: "error", message, fieldErrors: { parentId: message } };
}

// Product lists embed category name/slug, so they refresh too.
function refreshCategoryCaches(...slugs: string[]) {
  updateTag("categories");
  updateTag("products");
  for (const slug of new Set(slugs)) {
    updateTag(`category-${slug}`);
    revalidatePath(`/categories/${slug}`);
  }
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function createCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requirePermission({ category: ["create"] });
  } catch {
    return NO_PERMISSION;
  }

  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const existing = await prisma.category.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });
  if (existing) return SLUG_TAKEN;

  try {
    await assertValidCategoryParent(parsed.data.parentId);
  } catch (err) {
    return parentError(err);
  }

  try {
    await prisma.category.create({ data: parsed.data });
  } catch (err) {
    if (hasErrorCode(err, "P2002")) return SLUG_TAKEN;
    throw err;
  }

  refreshCategoryCaches(parsed.data.slug);
  return { status: "success", message: "Category created." };
}

export async function updateCategory(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requirePermission({ category: ["update"] });
  } catch {
    return NO_PERMISSION;
  }

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return { status: "error", message: "Category not found." };
  }

  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  if (parsed.data.slug !== existing.slug) {
    const slugTaken = await prisma.category.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (slugTaken) return SLUG_TAKEN;
  }

  try {
    await assertValidCategoryParent(parsed.data.parentId, id);
  } catch (err) {
    return parentError(err);
  }

  try {
    await prisma.category.update({ where: { id }, data: parsed.data });
  } catch (err) {
    if (hasErrorCode(err, "P2002")) return SLUG_TAKEN;
    if (hasErrorCode(err, "P2025")) {
      return { status: "error", message: "Category not found." };
    }
    throw err;
  }

  refreshCategoryCaches(existing.slug, parsed.data.slug);
  return { status: "success", message: "Category updated." };
}

// Returns messages instead of throwing: a thrown Error's message is hidden
// in production, so the admin only ever saw a generic failure. Products are
// onDelete: Restrict, so deleting a category in use used to crash with a
// raw foreign-key error.
export async function deleteCategory(id: string): Promise<ActionState> {
  try {
    await requirePermission({ category: ["delete"] });
  } catch {
    return NO_PERMISSION;
  }

  const [childCount, productCount] = await Promise.all([
    prisma.category.count({ where: { parentId: id } }),
    prisma.product.count({ where: { categoryId: id } }),
  ]);

  if (childCount > 0) {
    return {
      status: "error",
      message: `This category has ${childCount} subcategor${childCount === 1 ? "y" : "ies"}. Delete or reassign them first.`,
    };
  }
  if (productCount > 0) {
    return {
      status: "error",
      message: `${productCount} product${productCount === 1 ? " is" : "s are"} still in this category. Move ${productCount === 1 ? "it" : "them"} to another category first.`,
    };
  }

  try {
    const category = await prisma.category.delete({ where: { id } });
    refreshCategoryCaches(category.slug);
  } catch (err) {
    if (hasErrorCode(err, "P2025")) {
      return { status: "error", message: "Category not found." };
    }
    if (hasErrorCode(err, "P2003")) {
      return {
        status: "error",
        message: "This category is still in use and can't be deleted.",
      };
    }
    throw err;
  }

  return { status: "success", message: "Category deleted." };
}
