// Pure cart arithmetic and money formatting.
// Amounts are handled in tetri (1 GEL = 100 tetri) so totals never pick up
// floating-point error.

import type { Locale } from "./types.ts";

export interface CartLine {
  id: string;
  qty: number;
}

export interface Priced {
  price: number;
  salePrice: number | null;
  stock?: number;
}

export interface CartLineTotal {
  id: string;
  qty: number;
  /** Price paid per unit, in tetri. */
  unit: number;
  /** Regular price per unit, in tetri. */
  unitRegular: number;
  lineTotal: number;
  lineSavings: number;
}

export interface CartTotals {
  lines: CartLineTotal[];
  /** Number of units, not number of distinct products. */
  itemCount: number;
  /** Sum at regular prices. */
  regularTotal: number;
  /** Amount taken off by sale prices. */
  savings: number;
  /** Amount to pay. */
  total: number;
}

export function toTetri(gel: number): number {
  return Math.round(gel * 100);
}

/** Whole, positive quantity, capped at the stock level when one is given. */
export function clampQty(qty: number, stock?: number): number {
  const whole = Number.isFinite(qty) ? Math.floor(qty) : 0;
  const capped = stock === undefined ? whole : Math.min(whole, stock);
  return Math.max(0, capped);
}

/**
 * Totals for a cart. Lines whose product is unknown, or whose quantity comes
 * out at zero, are left out. A sale price only counts when it is lower than
 * the regular price.
 */
export function cartTotals(lines: CartLine[], lookup: (id: string) => Priced | undefined): CartTotals {
  const out: CartLineTotal[] = [];
  for (const line of lines) {
    const product = lookup(line.id);
    if (!product) continue;
    const qty = clampQty(line.qty, product.stock);
    if (qty === 0) continue;
    const unitRegular = toTetri(product.price);
    const sale = product.salePrice === null ? unitRegular : toTetri(product.salePrice);
    const unit = Math.min(sale, unitRegular);
    out.push({
      id: line.id,
      qty,
      unit,
      unitRegular,
      lineTotal: unit * qty,
      lineSavings: (unitRegular - unit) * qty,
    });
  }
  const sum = (pick: (l: CartLineTotal) => number) => out.reduce((acc, l) => acc + pick(l), 0);
  const savings = sum((l) => l.lineSavings);
  const total = sum((l) => l.lineTotal);
  return { lines: out, itemCount: sum((l) => l.qty), regularTotal: total + savings, savings, total };
}

/** "1,249.50 ₾" in English, "1 249.50 ₾" in Georgian. Whole amounts drop the decimals. */
export function formatTetri(tetri: number, locale: Locale = "en"): string {
  const sign = tetri < 0 ? "-" : "";
  const abs = Math.abs(Math.round(tetri));
  const whole = Math.floor(abs / 100);
  const cents = abs % 100;
  const separator = locale === "ka" ? " " : ",";
  const grouped = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  const decimals = cents === 0 ? "" : `.${String(cents).padStart(2, "0")}`;
  return `${sign}${grouped}${decimals} ₾`;
}

export function formatGel(gel: number, locale: Locale = "en"): string {
  return formatTetri(toTetri(gel), locale);
}

/** Whole-number discount, e.g. 14 for a 265 → 229 price drop. */
export function discountPercent(price: number, salePrice: number | null): number {
  if (salePrice === null || salePrice >= price || price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}
