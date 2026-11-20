"use server";

import { after } from "next/server"; // CHANGED
import { prisma } from "@/lib/prisma";
import {
  buildWhatsAppLink,
  buildProductWhatsAppMessage,
} from "@/lib/constants";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { productSchema } from "@/lib/validations/product";
import { fieldErrorsFrom, linesToArray, type ActionState } from "@/lib/utils";

const SLUG_TAKEN: ActionState = {
  status: "error",
  message: "That slug is already in use.",
  fieldErrors: { slug: "This slug is already taken." },
};

// CHANGED: friendly messages for failures that used to surface as a 500
const DB_TIMEOUT: ActionState = {
  status: "error",
  message: "The database took too long to respond. Please try again.",
};

const RELATION_MISSING: ActionState = {
  status: "error",
  message:
    "A selected category or collection (or this product) no longer exists. Reload the page and try again.",
};

// CHANGED: every statement is a network round trip to a remote database, so
// multi-statement transactions need more room than Prisma's 2s / 5s defaults.
const TX_OPTIONS = { maxWait: 15_000, timeout: 30_000 };

function hasErrorCode(err: unknown, code: string) {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === code
  );
}

// CHANGED: maps a failed create/update to a form message, or null if the
// error isn't one we recognise (the caller rethrows those).
function writeErrorState(err: unknown): ActionState | null {
  if (hasErrorCode(err, "P2002")) return SLUG_TAKEN;
  if (hasErrorCode(err, "P2028")) return DB_TIMEOUT;
  if (hasErrorCode(err, "P2025") || hasErrorCode(err, "P2003")) {
    return RELATION_MISSING;
  }
  return null;
}

// CHANGED: collection pages and counts depend on which products belong to
// them, so every product write refreshes the collections tag too.
function revalidateCatalog() {
  revalidateTag("products", "default");
  revalidateTag("collections", "default");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

function parseSpecsField(value: FormDataEntryValue | null) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value as string);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    price: formData.get("price") || "",
    compareAtPrice: formData.get("compareAtPrice") || "",
    image: formData.get("image"),
    gallery: linesToArray(formData.get("gallery")),
    featured:
      formData.get("featured") === "on" || formData.get("featured") === "true",
    inStock: formData.get("inStock") !== "false",
    condition: formData.get("condition") || "NEW",
    categoryId: formData.get("categoryId") || "",
    collectionIds: formData
      .getAll("collectionIds")
      .filter((v): v is string => typeof v === "string" && v !== ""),
    specs: parseSpecsField(formData.get("specs")),
  });
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requirePermission({ product: ["create"] });
  } catch {
    return {
      status: "error",
      message: "You don't have permission to do this.",
    };
  }

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const existing = await prisma.product.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) return SLUG_TAKEN;

  const { specs, categoryId, collectionIds, compareAtPrice, ...rest } =
    parsed.data;

  try {
    await prisma.product.create({
      data: {
        ...rest,
        compareAtPrice: compareAtPrice ?? null,
        categoryId,
        collections: { connect: collectionIds.map((id) => ({ id })) },
        ...(specs.length > 0 && { specs: { createMany: { data: specs } } }),
      },
    });
  } catch (err) {
    const state = writeErrorState(err);
    if (state) return state;
    throw err;
  }

  revalidateCatalog(); // CHANGED
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requirePermission({ product: ["update"] });
  } catch {
    return {
      status: "error",
      message: "You don't have permission to do this.",
    };
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return { status: "error", message: "Product not found." };
  }

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const slugChanged = parsed.data.slug !== existing.slug;

  if (slugChanged) {
    const slugTaken = await prisma.product.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (slugTaken) return SLUG_TAKEN;
  }

  const { specs, categoryId, collectionIds, compareAtPrice, ...rest } =
    parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.productSpec.deleteMany({ where: { productId: id } });
      await tx.product.update({
        where: { id },
        data: {
          ...rest,
          compareAtPrice: compareAtPrice ?? null,
          categoryId,
          collections: { set: collectionIds.map((cid) => ({ id: cid })) },
          ...(specs.length > 0 && { specs: { createMany: { data: specs } } }),
        },
      });
    }, TX_OPTIONS);
  } catch (err) {
    const state = writeErrorState(err);
    if (state) return state;
    throw err;
  }

  revalidateCatalog(); // CHANGED
  revalidateTag(`product-${existing.slug}`, "default");
  if (slugChanged) {
    revalidateTag(`product-${parsed.data.slug}`, "default");
    revalidatePath(`/products/${existing.slug}`);
  }
  revalidatePath(`/products/${parsed.data.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  try {
    await requirePermission({ product: ["delete"] });
  } catch {
    return {
      status: "error",
      message: "You don't have permission to do this.",
    };
  }

  let slug: string;
  try {
    const product = await prisma.product.delete({ where: { id } });
    slug = product.slug;
  } catch (err) {
    if (hasErrorCode(err, "P2025")) {
      return { status: "error", message: "Product not found." };
    }
    if (hasErrorCode(err, "P2003")) {
      return {
        status: "error",
        message:
          "This product is part of existing orders, so it can't be deleted. Mark it out of stock instead.",
      };
    }
    throw err;
  }

  revalidateCatalog(); // CHANGED
  revalidateTag(`product-${slug}`, "default");
}

export async function logProductWhatsAppClick(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, slug: true, name: true, price: true },
  });

  if (!product) return { url: null };

  const isQuote = product.price === null;

  const message = isQuote
    ? `Hello, I'd like a quote for *${product.name}*. Please share the price and delivery details.`
    : buildProductWhatsAppMessage({
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
      });

  after(async () => {
    try {
      await prisma.whatsAppOrder.create({
        data: {
          message,
          source: isQuote ? "QUOTE_REQUEST" : "PRODUCT_PAGE",
          status: "CLICKED",
          totalEstimate: product.price,
          items: {
            create: {
              productId: product.id,
              quantity: 1,
              priceAtOrder: product.price,
            },
          },
        },
      });
    } catch (err) {
      console.error("Failed to log WhatsApp order click", err);
    }
  });

  return { url: buildWhatsAppLink(message) };
}
