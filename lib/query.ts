// The shape of a catalogue query and its URL form. Kept free of catalogue data
// so browser code can build links without bundling the product list.

import type { BrandId } from "./types.ts";

export const SORT_KEYS = ["newest", "price-asc", "price-desc", "name"] as const;
export type SortKey = (typeof SORT_KEYS)[number];
export const DEFAULT_SORT: SortKey = "newest";

export interface CatalogQuery {
  /** Free-text search over brand, model code and tool type. */
  q: string;
  brands: BrandId[];
  inStock: boolean;
  onSale: boolean;
  /** Price bounds in GEL, inclusive, compared against the price the customer pays. */
  min: number | null;
  max: number | null;
  sort: SortKey;
}

export const EMPTY_QUERY: CatalogQuery = {
  q: "",
  brands: [],
  inStock: false,
  onSale: false,
  min: null,
  max: null,
  sort: DEFAULT_SORT,
};

/** Writes a query as a URL query string ("" or "?a=b"). Defaults are left out. */
export function toQueryString(query: CatalogQuery): string {
  const parts: string[] = [];
  if (query.q) parts.push(`q=${encodeURIComponent(query.q)}`);
  if (query.brands.length > 0) parts.push(`brand=${query.brands.join(",")}`);
  if (query.inStock) parts.push("stock=1");
  if (query.onSale) parts.push("sale=1");
  if (query.min !== null) parts.push(`min=${query.min}`);
  if (query.max !== null) parts.push(`max=${query.max}`);
  if (query.sort !== DEFAULT_SORT) parts.push(`sort=${query.sort}`);
  return parts.length > 0 ? `?${parts.join("&")}` : "";
}

/** True when any filter narrows the list (search text and sort do not count). */
export function hasActiveFilters(query: CatalogQuery): boolean {
  return query.brands.length > 0 || query.inStock || query.onSale || query.min !== null || query.max !== null;
}
