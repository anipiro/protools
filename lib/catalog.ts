// Pure filtering, sorting and query-string helpers for the catalogue.
// Nothing here touches the network, the DOM or the clock.

import { brands, toolTypes } from "./catalog-data.ts";
import { DEFAULT_SORT, EMPTY_QUERY, SORT_KEYS } from "./query.ts";
import type { CatalogQuery, SortKey } from "./query.ts";
import type { BrandId, Product } from "./types.ts";

export { DEFAULT_SORT, EMPTY_QUERY, SORT_KEYS, hasActiveFilters, toQueryString } from "./query.ts";
export type { CatalogQuery, SortKey } from "./query.ts";

export interface BrandCount {
  id: BrandId;
  name: string;
  count: number;
}

export interface CatalogResult {
  items: Product[];
  total: number;
  brandCounts: BrandCount[];
  /** Lowest and highest price in the unfiltered set, for the price inputs. */
  priceBounds: { min: number; max: number } | null;
}

/** The price the customer pays: the sale price when there is one. */
export function effectivePrice(p: Product): number {
  return p.salePrice ?? p.price;
}

export function isOnSale(p: Product): boolean {
  return p.salePrice !== null && p.salePrice < p.price;
}

export function isInStock(p: Product): boolean {
  return p.stock > 0;
}

function normalise(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

/** Every word of the search must appear in the brand, model code or type name. */
export function matchesSearch(p: Product, q: string): boolean {
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const type = toolTypes[p.type].name;
  const brand = brands.find((b) => b.id === p.brand)?.name ?? "";
  const haystack = normalise(`${brand} ${p.model} ${type.en} ${type.ka}`);
  return words.every((word) => {
    const needle = normalise(word);
    return needle === "" || haystack.includes(needle);
  });
}

type FilterPart = "brands" | "stock" | "sale" | "price" | "search";

function applyFilters(list: Product[], query: CatalogQuery, skip?: FilterPart): Product[] {
  return list.filter((p) => {
    if (skip !== "search" && !matchesSearch(p, query.q)) return false;
    if (skip !== "brands" && query.brands.length > 0 && !query.brands.includes(p.brand)) return false;
    if (skip !== "stock" && query.inStock && !isInStock(p)) return false;
    if (skip !== "sale" && query.onSale && !isOnSale(p)) return false;
    if (skip !== "price") {
      const price = effectivePrice(p);
      if (query.min !== null && price < query.min) return false;
      if (query.max !== null && price > query.max) return false;
    }
    return true;
  });
}

export function filterProducts(list: Product[], query: CatalogQuery): Product[] {
  return applyFilters(list, query);
}

/**
 * How many products each brand has under the current filters.
 * The brand filter itself is left out of the count, so the number beside an
 * unticked brand is what ticking it would add.
 */
export function brandCounts(list: Product[], query: CatalogQuery): BrandCount[] {
  const scope = applyFilters(list, query, "brands");
  const inScope = new Set(applyFilters(list, { ...EMPTY_QUERY, q: query.q }).map((p) => p.brand));
  return brands
    .filter((b) => inScope.has(b.id))
    .map((b) => ({ id: b.id, name: b.name, count: scope.filter((p) => p.brand === b.id).length }));
}

export function sortProducts(list: Product[], sort: SortKey, nameOf: (p: Product) => string): Product[] {
  const byName = (a: Product, b: Product) => nameOf(a).localeCompare(nameOf(b), "en", { sensitivity: "base" });
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b) || byName(a, b));
    case "price-desc":
      return sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a) || byName(a, b));
    case "name":
      return sorted.sort(byName);
    case "newest":
      return sorted.sort((a, b) => b.added.localeCompare(a.added) || byName(a, b));
  }
}

export function priceBounds(list: Product[]): { min: number; max: number } | null {
  if (list.length === 0) return null;
  const prices = list.map(effectivePrice);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
}

/** Filter, count and sort in one call. Used by the pages and by the mock API. */
export function queryCatalog(
  list: Product[],
  query: CatalogQuery,
  nameOf: (p: Product) => string = (p) => `${p.brand} ${p.model}`,
): CatalogResult {
  const items = sortProducts(filterProducts(list, query), query.sort, nameOf);
  return {
    items,
    total: items.length,
    brandCounts: brandCounts(list, query),
    priceBounds: priceBounds(applyFilters(list, { ...EMPTY_QUERY, q: query.q })),
  };
}

// ---------------------------------------------------------------------------
// Query string

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function parsePrice(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Reads a query from URL parameters. Unknown or malformed values are dropped. */
export function parseQuery(params: RawParams): CatalogQuery {
  const brandIds = new Set<string>(brands.map((b) => b.id));
  const requested = (Array.isArray(params.brand) ? params.brand : [params.brand ?? ""])
    .flatMap((v) => v.split(","))
    .map((v) => v.trim().toLowerCase());
  const sort = first(params.sort);
  let min = parsePrice(first(params.min));
  let max = parsePrice(first(params.max));
  if (min !== null && max !== null && min > max) [min, max] = [max, min];
  return {
    q: first(params.q).trim().slice(0, 80),
    brands: brands.map((b) => b.id).filter((id) => brandIds.has(id) && requested.includes(id)),
    inStock: first(params.stock) === "1",
    onSale: first(params.sale) === "1",
    min,
    max,
    sort: (SORT_KEYS as readonly string[]).includes(sort) ? (sort as SortKey) : DEFAULT_SORT,
  };
}
