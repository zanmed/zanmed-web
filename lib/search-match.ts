import type { SearchProduct, TermSuggestion } from "./data/search";

export const MIN_QUERY_LENGTH = 2;
const PRODUCT_LIMIT = 6;
const TERM_LIMIT = 3;
const MAX_TOKENS = 6;

export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

interface Prepared<T> {
  item: T;
  name: string;
  padded: string;
  extra: string;
  order: number;
}

const preparedCache = new WeakMap<object, Prepared<unknown>[]>();

function prepare<T>(
  items: readonly T[],
  getName: (item: T) => string,
  getExtra: (item: T) => string,
): Prepared<T>[] {
  const cached = preparedCache.get(items);
  if (cached) return cached as Prepared<T>[];

  const prepared = items.map((item, order) => {
    const name = normalize(getName(item));
    return {
      item,
      name,
      padded: ` ${name}`,
      extra: normalize(getExtra(item)),
      order,
    };
  });

  preparedCache.set(items, prepared);
  return prepared;
}

function tokenize(
  rawQuery: string,
): { phrase: string; tokens: string[] } | null {
  const phrase = normalize(rawQuery);
  if (phrase.length < MIN_QUERY_LENGTH) return null;

  const tokens = [...new Set(phrase.split(" "))].slice(0, MAX_TOKENS);
  return { phrase, tokens };
}

function score(
  entry: Prepared<unknown>,
  tokens: string[],
  phrase: string,
): number {
  let total = 0;

  for (const token of tokens) {
    if (entry.name.startsWith(token)) total += 4;
    else if (entry.padded.includes(` ${token}`)) total += 3;
    else if (entry.name.includes(token)) total += 2;
    else if (entry.extra.includes(token)) total += 1;
    else return -1;
  }

  if (entry.name.startsWith(phrase)) total += 5;
  else if (entry.name.includes(phrase)) total += 2;

  return total;
}

function rank<T>(
  prepared: Prepared<T>[],
  rawQuery: string,
  limit: number,
  filter?: (item: T) => boolean,
): T[] {
  const parsed = tokenize(rawQuery);
  if (!parsed) return [];

  const hits: { entry: Prepared<T>; score: number }[] = [];

  for (const entry of prepared) {
    if (filter && !filter(entry.item)) continue;
    const s = score(entry, parsed.tokens, parsed.phrase);
    if (s >= 0) hits.push({ entry, score: s });
  }

  return hits
    .sort((a, b) => b.score - a.score || a.entry.order - b.entry.order)
    .slice(0, limit)
    .map((hit) => hit.entry.item);
}

export function matchProducts(
  products: SearchProduct[],
  rawQuery: string,
  categorySlug: string | null,
): SearchProduct[] {
  return rank(
    prepare(
      products,
      (product) => product.name,
      (product) => product.categoryName ?? "",
    ),
    rawQuery,
    PRODUCT_LIMIT,
    categorySlug
      ? (product) => product.categorySlug === categorySlug
      : undefined,
  );
}

export function matchTerms(
  terms: TermSuggestion[],
  rawQuery: string,
): TermSuggestion[] {
  return rank(
    prepare(
      terms,
      (term) => term.name,
      () => "",
    ),
    rawQuery,
    TERM_LIMIT,
  );
}
