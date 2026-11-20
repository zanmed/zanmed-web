import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
  parseAsStringLiteral,
} from "nuqs/server";
import { PRODUCT_CONDITIONS } from "./product-condition";

export const sortValues = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
] as const;

export type SpecEntry = {
  label: string;
  value: string;
};

const RESERVED_PARAM_KEYS = new Set([
  "category",
  "collection",
  "condition",
  "q",
  "sort",
  "maxPrice",
  "page",
]);

export const productFiltersParsers = {
  category: parseAsString,
  collection: parseAsString,
  condition: parseAsStringLiteral(PRODUCT_CONDITIONS),
  q: parseAsString,
  sort: parseAsStringLiteral(sortValues).withDefault("featured"),
  maxPrice: parseAsInteger,
  page: parseAsInteger.withDefault(1),
};

export const productSearchParamsCache = createSearchParamsCache(
  productFiltersParsers,
);

export function groupSpecEntries(
  entries: SpecEntry[],
): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  for (const { label, value } of entries) {
    (grouped[label] ??= []).push(value);
  }
  return grouped;
}

export function parseSpecEntriesFromRaw(
  raw: Record<string, string | string[] | undefined>,
  validLabels: ReadonlySet<string>,
): SpecEntry[] {
  const entries: SpecEntry[] = [];
  for (const [key, value] of Object.entries(raw)) {
    if (RESERVED_PARAM_KEYS.has(key) || !validLabels.has(key)) continue;
    if (value === undefined) continue;
    for (const v of Array.isArray(value) ? value : [value]) {
      if (v) entries.push({ label: key, value: v });
    }
  }
  return entries;
}

export function parseSpecEntriesFromParams(
  params: URLSearchParams,
  validLabels: ReadonlySet<string>,
): SpecEntry[] {
  const entries: SpecEntry[] = [];
  for (const key of new Set(params.keys())) {
    if (RESERVED_PARAM_KEYS.has(key) || !validLabels.has(key)) continue;
    for (const value of params.getAll(key)) {
      if (value) entries.push({ label: key, value });
    }
  }
  return entries;
}

export function clearSpecParams(
  params: URLSearchParams,
  validLabels: ReadonlySet<string>,
) {
  for (const key of [...params.keys()]) {
    if (!RESERVED_PARAM_KEYS.has(key) && validLabels.has(key)) {
      params.delete(key);
    }
  }
}
