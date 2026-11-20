"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/require-permission";
import { blogSchema } from "@/lib/validations/blog";
import { fieldErrorsFrom, type ActionState } from "@/lib/utils";
import { sanitizeHtml } from "../sanitize";
import { NO_PERMISSION, SLUG_TAKEN, hasErrorCode } from "./shared";

export type BlogActionState = ActionState;

type PostStatus = "DRAFT" | "PUBLISHED";

function formString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

function parseTags(value: FormDataEntryValue | null): string[] {
  const tags = formString(value)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return [...new Set(tags)];
}

function resolveStatus(intent: string, fallback: PostStatus): PostStatus {
  switch (intent) {
    case "publish":
      return "PUBLISHED";
    case "draft":
    case "unpublish":
      return "DRAFT";
    default:
      return fallback;
  }
}

function parseBlogForm(formData: FormData, status: PostStatus) {
  return blogSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: sanitizeHtml(formString(formData.get("excerpt"))),
    content: sanitizeHtml(formString(formData.get("content"))),
    coverImage: formData.get("coverImage"),
    tags: parseTags(formData.get("tags")),
    status,
    metaTitle: formData.get("metaTitle") || "",
    metaDescription: formData.get("metaDescription") || "",
  });
}

function refreshBlogCaches(...slugs: string[]) {
  updateTag("blogs");
  for (const slug of new Set(slugs)) {
    updateTag(`blog-${slug}`);
    revalidatePath(`/blogs/${slug}`);
  }
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  revalidatePath("/");
}

export async function createBlog(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let session;
  try {
    session = await requirePermission({ blog: ["create"] });
  } catch {
    return NO_PERMISSION;
  }

  const status = resolveStatus(formString(formData.get("intent")), "DRAFT");
  const parsed = parseBlogForm(formData, status);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const existing = await prisma.blog.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });
  if (existing) return SLUG_TAKEN;

  try {
    await prisma.blog.create({
      data: {
        ...parsed.data,
        authorId: session.user.id,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });
  } catch (err) {
    if (hasErrorCode(err, "P2002")) return SLUG_TAKEN;
    throw err;
  }

  refreshBlogCaches(parsed.data.slug);
  redirect("/admin/blogs");
}

export async function updateBlog(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requirePermission({ blog: ["update"] });
  } catch {
    return NO_PERMISSION;
  }

  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) {
    return { status: "error", message: "Post not found." };
  }

  const status = resolveStatus(
    formString(formData.get("intent")),
    existing.status,
  );
  const parsed = parseBlogForm(formData, status);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  if (parsed.data.slug !== existing.slug) {
    const slugTaken = await prisma.blog.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (slugTaken) return SLUG_TAKEN;
  }

  const publishedAt =
    status === "PUBLISHED"
      ? (existing.publishedAt ?? new Date())
      : existing.publishedAt;

  try {
    await prisma.blog.update({
      where: { id },
      data: { ...parsed.data, publishedAt },
    });
  } catch (err) {
    if (hasErrorCode(err, "P2002")) return SLUG_TAKEN;
    if (hasErrorCode(err, "P2025")) {
      return { status: "error", message: "Post not found." };
    }
    throw err;
  }

  refreshBlogCaches(existing.slug, parsed.data.slug);
  redirect("/admin/blogs");
}

export async function deleteBlog(id: string): Promise<ActionState> {
  try {
    await requirePermission({ blog: ["delete"] });
  } catch {
    return NO_PERMISSION;
  }

  try {
    const blog = await prisma.blog.delete({ where: { id } });
    refreshBlogCaches(blog.slug);
  } catch (err) {
    if (hasErrorCode(err, "P2025")) {
      return { status: "error", message: "Post not found." };
    }
    throw err;
  }

  return { status: "success", message: "Post deleted." };
}
