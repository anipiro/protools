import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  EMPTY_QUERY,
  brandCounts,
  effectivePrice,
  filterProducts,
  hasActiveFilters,
  matchesSearch,
  parseQuery,
  priceBounds,
  queryCatalog,
  sortProducts,
  toQueryString,
} from "../lib/catalog.ts";
import type { CatalogQuery } from "../lib/catalog.ts";
import { brands, categories, products } from "../lib/catalog-data.ts";
import type { BrandId, Product } from "../lib/types.ts";

function item(id: string, brand: BrandId, price: number, salePrice: number | null, stock: number, added: string): Product {
  return { id, type: "hammer-drill", category: "drills", brand, model: id.toUpperCase(), price, salePrice, stock, added, specs: [] };
}

// A small fixed set, so expected results can be read off by eye.
const shelf: Product[] = [
  item("a1", "tavro", 100, null, 5, "2026-01-01"),
  item("a2", "tavro", 300, 240, 0, "2026-03-01"),
  item("b1", "hexmoor", 200, 150, 2, "2026-02-01"),
  item("b2", "hexmoor", 500, null, 0, "2026-05-01"),
  item("c1", "norvane", 250, null, 9, "2026-04-01"),
  item("c2", "norvane", 80, 60, 1, "2026-06-01"),
];

const q = (patch: Partial<CatalogQuery>): CatalogQuery => ({ ...EMPTY_QUERY, ...patch });
const ids = (list: Product[]) => list.map((p) => p.id);
const byId = (p: Product) => p.id;

describe("filterProducts", () => {
  it("returns everything for an empty query", () => {
    assert.equal(filterProducts(shelf, EMPTY_QUERY).length, shelf.length);
  });

  it("filters by one brand and by several", () => {
    assert.deepEqual(ids(filterProducts(shelf, q({ brands: ["tavro"] }))), ["a1", "a2"]);
    assert.deepEqual(ids(filterProducts(shelf, q({ brands: ["tavro", "norvane"] }))), ["a1", "a2", "c1", "c2"]);
  });

  it("keeps only products in stock", () => {
    assert.deepEqual(ids(filterProducts(shelf, q({ inStock: true }))), ["a1", "b1", "c1", "c2"]);
  });

  it("keeps only products on sale", () => {
    assert.deepEqual(ids(filterProducts(shelf, q({ onSale: true }))), ["a2", "b1", "c2"]);
  });

  it("compares the price range against the sale price, bounds included", () => {
    assert.deepEqual(ids(filterProducts(shelf, q({ min: 150, max: 240 }))), ["a2", "b1"]);
    assert.deepEqual(ids(filterProducts(shelf, q({ max: 60 }))), ["c2"]);
    assert.deepEqual(ids(filterProducts(shelf, q({ min: 500 }))), ["b2"]);
  });

  it("combines brand, price and stock", () => {
    const query = q({ brands: ["tavro", "hexmoor"], min: 100, max: 250, inStock: true });
    assert.deepEqual(ids(filterProducts(shelf, query)), ["a1", "b1"]);
  });

  it("combines brand, sale and stock down to nothing", () => {
    assert.deepEqual(filterProducts(shelf, q({ brands: ["tavro"], onSale: true, inStock: true })), []);
  });

  it("does not change the list it was given", () => {
    const before = ids(shelf);
    filterProducts(shelf, q({ brands: ["tavro"], inStock: true }));
    sortProducts(shelf, "price-desc", byId);
    assert.deepEqual(ids(shelf), before);
  });
});

describe("brandCounts", () => {
  const count = (query: CatalogQuery) => Object.fromEntries(brandCounts(shelf, query).map((b) => [b.id, b.count]));

  it("counts every brand when nothing is filtered", () => {
    assert.deepEqual(count(EMPTY_QUERY), { tavro: 2, hexmoor: 2, norvane: 2 });
  });

  it("follows the stock, sale and price filters", () => {
    assert.deepEqual(count(q({ inStock: true })), { tavro: 1, hexmoor: 1, norvane: 2 });
    assert.deepEqual(count(q({ onSale: true, inStock: true })), { tavro: 0, hexmoor: 1, norvane: 1 });
    assert.deepEqual(count(q({ min: 200 })), { tavro: 1, hexmoor: 1, norvane: 1 });
  });

  it("ignores the brand filter itself, so other brands stay selectable", () => {
    assert.deepEqual(count(q({ brands: ["tavro"], inStock: true })), { tavro: 1, hexmoor: 1, norvane: 2 });
  });

  it("adds up to the result total for the selected brands", () => {
    const query = q({ brands: ["tavro", "norvane"], max: 250 });
    const selected = brandCounts(shelf, query).filter((b) => query.brands.includes(b.id));
    const sum = selected.reduce((acc, b) => acc + b.count, 0);
    assert.equal(sum, filterProducts(shelf, query).length);
  });

  it("lists only brands present in the set", () => {
    assert.deepEqual(brandCounts(shelf, EMPTY_QUERY).map((b) => b.name), ["Tavro", "Hexmoor", "Norvane"]);
  });
});

describe("sortProducts", () => {
  it("sorts newest first", () => {
    assert.deepEqual(ids(sortProducts(shelf, "newest", byId)), ["c2", "b2", "c1", "a2", "b1", "a1"]);
  });

  it("sorts by the price paid, low to high and high to low", () => {
    assert.deepEqual(ids(sortProducts(shelf, "price-asc", byId)), ["c2", "a1", "b1", "a2", "c1", "b2"]);
    assert.deepEqual(ids(sortProducts(shelf, "price-desc", byId)), ["b2", "c1", "a2", "b1", "a1", "c2"]);
  });

  it("sorts by name, ignoring case", () => {
    const names: Record<string, string> = { a1: "delta", a2: "Alpha", b1: "charlie", b2: "Bravo", c1: "echo", c2: "Foxtrot" };
    assert.deepEqual(ids(sortProducts(shelf, "name", (p) => names[p.id])), ["a2", "b2", "b1", "a1", "c1", "c2"]);
  });

  it("breaks price ties by name", () => {
    const tied = [item("z", "tavro", 50, null, 1, "2026-01-01"), item("m", "tavro", 50, null, 1, "2026-01-01")];
    assert.deepEqual(ids(sortProducts(tied, "price-asc", byId)), ["m", "z"]);
  });
});

describe("search", () => {
  const drill = products.find((p) => p.model === "TD-750")!;

  it("matches a model code with or without the dash, in any case", () => {
    assert.ok(matchesSearch(drill, "TD-750"));
    assert.ok(matchesSearch(drill, "td750"));
    assert.ok(matchesSearch(drill, "td 750"));
  });

  it("matches brand and type words together, in English and Georgian", () => {
    assert.ok(matchesSearch(drill, "tavro hammer"));
    assert.ok(matchesSearch(drill, "ბურღი"));
    assert.ok(!matchesSearch(drill, "tavro jigsaw"));
  });

  it("finds exactly one product for a full model code", () => {
    assert.deepEqual(ids(filterProducts(products, q({ q: "HX-J80" }))), ["hexmoor-hx-j80"]);
  });
});

describe("queryCatalog", () => {
  it("returns sorted items, the total, counts and price bounds", () => {
    const result = queryCatalog(shelf, q({ brands: ["hexmoor", "norvane"], inStock: true, sort: "price-asc" }), byId);
    assert.deepEqual(ids(result.items), ["c2", "b1", "c1"]);
    assert.equal(result.total, 3);
    assert.deepEqual(result.priceBounds, { min: 60, max: 500 });
    assert.equal(result.brandCounts.find((b) => b.id === "tavro")?.count, 1);
  });

  it("gives null bounds and no brands for an empty set", () => {
    const result = queryCatalog([], EMPTY_QUERY);
    assert.equal(result.total, 0);
    assert.equal(result.priceBounds, null);
    assert.deepEqual(result.brandCounts, []);
  });

  it("uses the sale price for bounds", () => {
    assert.deepEqual(priceBounds([shelf[1]]), { min: 240, max: 240 });
    assert.equal(effectivePrice(shelf[1]), 240);
  });
});

describe("query string", () => {
  it("round-trips a full query", () => {
    const query = q({ q: "drill", brands: ["tavro", "norvane"], inStock: true, onSale: true, min: 50, max: 400, sort: "price-desc" });
    const text = toQueryString(query);
    assert.equal(text, "?q=drill&brand=tavro,norvane&stock=1&sale=1&min=50&max=400&sort=price-desc");
    const parsed = parseQuery(Object.fromEntries(new URLSearchParams(text)));
    assert.deepEqual(parsed, query);
  });

  it("leaves defaults out of the URL", () => {
    assert.equal(toQueryString(EMPTY_QUERY), "");
    assert.equal(toQueryString(q({ sort: "name" })), "?sort=name");
  });

  it("drops unknown brands, bad numbers and unknown sorts", () => {
    const parsed = parseQuery({ brand: "tavro,nobody", min: "abc", max: "-5", sort: "random", stock: "yes" });
    assert.deepEqual(parsed, q({ brands: ["tavro"] }));
  });

  it("accepts repeated brand parameters and swaps a reversed range", () => {
    const parsed = parseQuery({ brand: ["norvane", "tavro"], min: "300", max: "100" });
    assert.deepEqual(parsed.brands, ["tavro", "norvane"]);
    assert.deepEqual([parsed.min, parsed.max], [100, 300]);
  });

  it("knows when filters are active", () => {
    assert.equal(hasActiveFilters(EMPTY_QUERY), false);
    assert.equal(hasActiveFilters(q({ q: "drill", sort: "name" })), false);
    assert.equal(hasActiveFilters(q({ max: 100 })), true);
  });
});

describe("sample catalogue", () => {
  it("has 40 to 60 products across six categories and six brands", () => {
    assert.ok(products.length >= 40 && products.length <= 60);
    assert.equal(new Set(products.map((p) => p.category)).size, categories.length);
    assert.equal(new Set(products.map((p) => p.brand)).size, brands.length);
    assert.equal(categories.length, 6);
    assert.equal(brands.length, 6);
  });

  it("has unique ids and sale prices below regular prices", () => {
    assert.equal(new Set(products.map((p) => p.id)).size, products.length);
    for (const p of products) {
      assert.match(p.id, /^[a-z0-9-]+$/);
      if (p.salePrice !== null) assert.ok(p.salePrice < p.price, p.id);
      assert.ok(p.stock >= 0 && Number.isInteger(p.stock), p.id);
    }
  });

  it("includes sale and out-of-stock products to filter on", () => {
    assert.ok(products.some((p) => p.salePrice !== null));
    assert.ok(products.some((p) => p.stock === 0));
  });
});
