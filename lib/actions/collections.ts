"use server";

import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/require-permission";
import { collectionSchema } from "@/lib/validations/collection";
import { fieldErrorsFrom, type ActionState } from "@/lib/utils";
import { NO_PERMISSION, SLUG_TAKEN, hasErrorCode } from "./shared";

// Collection.name is @unique, but only the slug was ever checked, so a
// duplicate name hit the database constraint and crashed with a 500.
const NAME_TAKEN: ActionState = {
  status: "error",
  message: "That name is already in use.",
  fieldErrors: { name: "A collection with this name already exists." },
};

const NOT_UNIQUE: ActionState = {
  status: "error",
  message: "A collection with this name or slug already exists.",
};

async function nameInUse(name: string, excludeId?: string) {
  const found = await prisma.collection.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      ...(excludeId && { id: { not: excludeId } }),
    },
    select: { id: true },
  });
  return found !== null;
}

function parseCollectionForm(formData: FormData) {
  return collectionSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description") || "",
    coverImage: formData.get("coverImage") || "",
  });
}

// Product pages and lists show collection names, so products refresh too.
function refreshCollectionCaches(...slugs: string[]) {
  updateTag("collections");
  updateTag("products");
  for (const slug of new Set(slugs)) {
    updateTag(`collection-${slug}`);
    revalidatePath(`/collections/${slug}`);
  }
  revalidatePath("/admin/collections");
  revalidatePath("/collections");
}

export async function createCollection(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requirePermission({ collection: ["create"] });
  } catch {
    return NO_PERMISSION;
  }

  const parsed = parseCollectionForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const slugTaken = await prisma.collection.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });
  if (slugTaken) return SLUG_TAKEN;
  if (await nameInUse(parsed.data.name)) return NAME_TAKEN;

  try {
    await prisma.collection.create({ data: parsed.data });
  } catch (err) {
    if (hasErrorCode(err, "P2002")) return NOT_UNIQUE;
    throw err;
  }

  refreshCollectionCaches(parsed.data.slug);
  return { status: "success", message: "Collection created." };
}

export async function updateCollection(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requirePermission({ collection: ["update"] });
  } catch {
    return NO_PERMISSION;
  }

  const existing = await prisma.collection.findUnique({ where: { id } });
  if (!existing) {
    return { status: "error", message: "Collection not found." };
  }

  const parsed = parseCollectionForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  if (parsed.data.slug !== existing.slug) {
    const slugTaken = await prisma.collection.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (slugTaken) return SLUG_TAKEN;
  }
  if (await nameInUse(parsed.data.name, id)) return NAME_TAKEN;

  try {
    await prisma.collection.update({ where: { id }, data: parsed.data });
  } catch (err) {
    if (hasErrorCode(err, "P2002")) return NOT_UNIQUE;
    if (hasErrorCode(err, "P2025")) {
      return { status: "error", message: "Collection not found." };
    }
    throw err;
  }

  refreshCollectionCaches(existing.slug, parsed.data.slug);
  return { status: "success", message: "Collection updated." };
}

export async function deleteCollection(id: string): Promise<ActionState> {
  try {
    await requirePermission({ collection: ["delete"] });
  } catch {
    return NO_PERMISSION;
  }

  try {
    const collection = await prisma.collection.delete({ where: { id } });
    refreshCollectionCaches(collection.slug);
  } catch (err) {
    if (hasErrorCode(err, "P2025")) {
      return { status: "error", message: "Collection not found." };
    }
    throw err;
  }

  return { status: "success", message: "Collection deleted." };
}
