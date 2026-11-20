import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Category } from "@/generated/prisma/client";

/**
 * Database errors that commonly occur when the schema is missing,
 * the database is unavailable, or the schema is out of sync.
 */
type DatabaseError = Error & {
  code?: string;
  meta?: {
    modelName?: string;
    table?: string;
    column?: string;
  };
};

function logCategoryError(operation: string, error: unknown): void {
  const err = error as DatabaseError;

  console.error(`[Categories] ${operation} failed`, {
    message: err?.message ?? "Unknown database error",
    code: err?.code,
    model: err?.meta?.modelName,
    table: err?.meta?.table,
    column: err?.meta?.column,
  });
}

/**
 * Returns true for database errors that may indicate a schema
 * or database connectivity problem.
 */
function isDatabaseUnavailableError(error: unknown): boolean {
  const err = error as DatabaseError;

  return (
    err?.code === "P2021" || // Table does not exist
    err?.code === "P2022" || // Column does not exist
    err?.code === "P1001" || // Cannot reach database server
    err?.code === "P1002" || // Database connection timed out
    err?.code === "P1003" || // Database does not exist
    err?.code === "P1017" || // Server closed the connection
    err?.code === "P2024" || // Connection pool timeout
    err?.code === "P2037" // Too many database connections
  );
}

/**
 * Safely runs a category query.
 *
 * On failure, returns the supplied fallback instead of allowing
 * the database error to crash the calling page.
 */
async function safeCategoryQuery<T>(
  operation: string,
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    logCategoryError(operation, error);

    if (isDatabaseUnavailableError(error)) {
      console.error(
        `[Categories] Database/schema problem detected during "${operation}". ` +
          "Check your DATABASE_URL and Prisma migrations.",
      );
    }

    return fallback;
  }
}

/**
 * All categories for the admin page.
 * Returns [] if the query fails.
 */
export async function getAllCategoriesForAdmin() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  return safeCategoryQuery(
    "getAllCategoriesForAdmin",
    () =>
      prisma.category.findMany({
        orderBy: [{ parentId: "asc" }, { order: "asc" }],
        include: {
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              products: true,
              children: true,
            },
          },
        },
      }),
    [],
  );
}

/**
 * Returns a category when found, or null when it does not exist
 * or the database query fails.
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  return safeCategoryQuery(
    "getCategoryById",
    () => prisma.category.findUnique({ where: { id } }),
    null,
  );
}

/**
 * Returns active categories.
 * An empty result is [].
 */
export async function getActiveCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  return safeCategoryQuery(
    "getActiveCategories",
    () =>
      prisma.category.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
    [],
  );
}

/**
 * Returns an active category matching its slug,
 * or null if not found or if the query fails.
 */
export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  "use cache";
  cacheTag("categories", `category-${slug}`);
  cacheLife("hours");

  return safeCategoryQuery(
    "getCategoryBySlug",
    () =>
      prisma.category.findFirst({
        where: {
          slug,
          active: true,
        },
      }),
    null,
  );
}

/**
 * Returns top-level categories.
 * Returns [] if there are no results or the query fails.
 */
export async function getTopLevelCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  return safeCategoryQuery(
    "getTopLevelCategories",
    () =>
      prisma.category.findMany({
        where: { parentId: null },
        orderBy: { order: "asc" },
        take: 5,
      }),
    [],
  );
}

/**
 * Returns active top-level categories and their active children.
 * Returns [] if the query fails.
 */
export async function getCategoryTree() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  return safeCategoryQuery(
    "getCategoryTree",
    () =>
      prisma.category.findMany({
        where: {
          parentId: null,
          active: true,
        },
        orderBy: { order: "asc" },
        include: {
          children: {
            where: { active: true },
            orderBy: { order: "asc" },
          },
        },
      }),
    [],
  );
}
