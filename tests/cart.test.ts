import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { cartTotals, clampQty, discountPercent, formatGel, formatTetri, toTetri } from "../lib/cart.ts";
import type { Priced } from "../lib/cart.ts";

const prices: Record<string, Priced> = {
  drill: { price: 265, salePrice: 229, stock: 6 },
  tape: { price: 29, salePrice: 24.5, stock: 45 },
  hammer: { price: 39, salePrice: null, stock: 40 },
  rare: { price: 415, salePrice: null, stock: 2 },
  odd: { price: 0.1, salePrice: null },
  mispriced: { price: 50, salePrice: 70 },
};
const lookup = (id: string) => prices[id];

describe("cartTotals", () => {
  it("is all zeros for an empty cart", () => {
    assert.deepEqual(cartTotals([], lookup), { lines: [], itemCount: 0, regularTotal: 0, savings: 0, total: 0 });
  });

  it("multiplies regular prices by quantity", () => {
    const totals = cartTotals([{ id: "hammer", qty: 3 }], lookup);
    assert.equal(totals.total, 11700);
    assert.equal(totals.savings, 0);
    assert.equal(totals.itemCount, 3);
  });

  it("charges the sale price and reports the saving", () => {
    const totals = cartTotals([{ id: "drill", qty: 2 }], lookup);
    assert.equal(totals.lines[0].unit, 22900);
    assert.equal(totals.lines[0].unitRegular, 26500);
    assert.equal(totals.total, 45800);
    assert.equal(totals.savings, 7200);
    assert.equal(totals.regularTotal, 53000);
  });

  it("adds mixed lines, including a price with tetri", () => {
    const totals = cartTotals(
      [
        { id: "drill", qty: 1 },
        { id: "tape", qty: 3 },
        { id: "hammer", qty: 2 },
      ],
      lookup,
    );
    assert.equal(totals.total, 22900 + 7350 + 7800);
    assert.equal(totals.savings, 3600 + 1350);
    assert.equal(totals.itemCount, 6);
    assert.equal(totals.regularTotal - totals.savings, totals.total);
  });

  it("stays exact where floating point would drift", () => {
    assert.equal(cartTotals([{ id: "odd", qty: 3 }], lookup).total, 30);
  });

  it("skips unknown products and non-positive quantities", () => {
    const totals = cartTotals(
      [
        { id: "ghost", qty: 2 },
        { id: "hammer", qty: 0 },
        { id: "tape", qty: -1 },
        { id: "drill", qty: 1 },
      ],
      lookup,
    );
    assert.deepEqual(totals.lines.map((l) => l.id), ["drill"]);
    assert.equal(totals.total, 22900);
  });

  it("caps the quantity at the stock level and rounds fractions down", () => {
    assert.equal(cartTotals([{ id: "rare", qty: 5 }], lookup).lines[0].qty, 2);
    assert.equal(cartTotals([{ id: "hammer", qty: 2.9 }], lookup).lines[0].qty, 2);
  });

  it("ignores a sale price that is higher than the regular price", () => {
    const totals = cartTotals([{ id: "mispriced", qty: 1 }], lookup);
    assert.equal(totals.total, 5000);
    assert.equal(totals.savings, 0);
  });
});

describe("clampQty", () => {
  it("keeps whole positive quantities within stock", () => {
    assert.equal(clampQty(3, 10), 3);
    assert.equal(clampQty(12, 10), 10);
    assert.equal(clampQty(-4, 10), 0);
    assert.equal(clampQty(Number.NaN), 0);
    assert.equal(clampQty(7), 7);
  });
});

describe("money formatting", () => {
  it("formats whole amounts without decimals", () => {
    assert.equal(formatTetri(22900), "229 ₾");
    assert.equal(formatGel(19), "19 ₾");
    assert.equal(formatTetri(0), "0 ₾");
  });

  it("keeps two decimals when there are tetri", () => {
    assert.equal(formatGel(24.5), "24.50 ₾");
    assert.equal(formatTetri(7305), "73.05 ₾");
  });

  it("groups thousands with a comma in English and a space in Georgian", () => {
    assert.equal(formatTetri(119000, "en"), "1,190 ₾");
    assert.equal(formatTetri(119000, "ka"), "1 190 ₾");
    assert.equal(formatTetri(123456789, "en"), "1,234,567.89 ₾");
  });

  it("converts GEL to tetri without rounding error", () => {
    assert.equal(toTetri(24.5), 2450);
    assert.equal(toTetri(1.15), 115);
    assert.equal(toTetri(0.29), 29);
  });
});

describe("discountPercent", () => {
  it("rounds to a whole percent", () => {
    assert.equal(discountPercent(265, 229), 14);
    assert.equal(discountPercent(100, 75), 25);
  });

  it("is zero without a real discount", () => {
    assert.equal(discountPercent(100, null), 0);
    assert.equal(discountPercent(100, 120), 0);
  });
});
