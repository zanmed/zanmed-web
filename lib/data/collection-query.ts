export const PAGE_SIZE = 10;
export const SORT_KEYS = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
] as const;
export const CONDITIONS = ["NEW", "REFURBISHED", "USED"] as const;

export type SortKey = (typeof SORT_KEYS)[number];
export type ConditionKey = (typeof CONDITIONS)[number];

export interface CollectionQuery {
  page: number;
  sort: SortKey;
  brand?: string;
  condition?: ConditionKey;
  inStock: boolean;
}

type RawParams = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export function parseCollectionQuery(sp: RawParams): CollectionQuery {
  const page = Number.parseInt(first(sp.page) ?? "1", 10);
  const sort = first(sp.sort);
  const condition = first(sp.condition);

  return {
    page: Number.isInteger(page) && page > 0 ? Math.min(page, 1000) : 1,
    sort: SORT_KEYS.find((k) => k === sort) ?? "featured",
    brand: first(sp.brand) || undefined,
    condition: CONDITIONS.find((c) => c === condition),
    inStock: first(sp.stock) === "1",
  };
}

export function buildCollectionHref(base: string, q: Partial<CollectionQuery>) {
  const p = new URLSearchParams();
  if (q.page && q.page > 1) p.set("page", String(q.page));
  if (q.sort && q.sort !== "featured") p.set("sort", q.sort);
  if (q.brand) p.set("brand", q.brand);
  if (q.condition) p.set("condition", q.condition);
  if (q.inStock) p.set("stock", "1");
  const qs = p.toString();
  return qs ? `${base}?${qs}` : base;
}
