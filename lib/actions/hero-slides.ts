"use server";

import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/require-permission";
import { heroSlideSchema } from "@/lib/validations/hero-slide";
import { fieldErrorsFrom, type ActionState } from "@/lib/utils";
import { NO_PERMISSION, hasErrorCode } from "./shared";

function parseHeroSlideForm(formData: FormData) {
  return heroSlideSchema.safeParse({
    eyebrow: formData.get("eyebrow"),
    title: formData.get("title"),
    accent: formData.get("accent"),
    description: formData.get("description"),
    image: formData.get("image"),
    href: formData.get("href"),
    pillTop: formData.get("pillTop"),
    pillBottom: formData.get("pillBottom"),
    order: formData.get("order") ?? 0,
    active:
      formData.get("active") === "on" || formData.get("active") === "true",
  });
}

function refreshHeroCaches() {
  updateTag("hero-slides");
  revalidatePath("/admin/hero-slides");
  revalidatePath("/");
}

export async function createHeroSlide(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requirePermission({ heroSlide: ["create"] });
  } catch {
    return NO_PERMISSION;
  }

  const parsed = parseHeroSlideForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  await prisma.heroSlide.create({ data: parsed.data });

  refreshHeroCaches();
  return { status: "success", message: "Slide created." };
}

export async function updateHeroSlide(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requirePermission({ heroSlide: ["update"] });
  } catch {
    return NO_PERMISSION;
  }

  const parsed = parseHeroSlideForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  try {
    await prisma.heroSlide.update({ where: { id }, data: parsed.data });
  } catch (err) {
    if (hasErrorCode(err, "P2025")) {
      return { status: "error", message: "Slide not found." };
    }
    throw err;
  }

  refreshHeroCaches();
  return { status: "success", message: "Slide updated." };
}

export async function deleteHeroSlide(id: string): Promise<ActionState> {
  try {
    await requirePermission({ heroSlide: ["delete"] });
  } catch {
    return NO_PERMISSION;
  }

  try {
    await prisma.heroSlide.delete({ where: { id } });
  } catch (err) {
    if (hasErrorCode(err, "P2025")) {
      return { status: "error", message: "Slide not found." };
    }
    throw err;
  }

  refreshHeroCaches();
  return { status: "success", message: "Slide deleted." };
}
