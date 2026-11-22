"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n";
import { SORT_KEYS, hasActiveFilters, toQueryString } from "@/lib/query";
import type { CatalogQuery, SortKey } from "@/lib/query";
import type { BrandId } from "@/lib/types";

interface BrandOption {
  id: BrandId;
  name: string;
  count: number;
}

/** Pushes a new query into the URL. The page re-renders on the server from it. */
function useQueryNavigation(basePath: string, query: CatalogQuery) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  // Shown immediately while the server responds; reset whenever the URL changes.
  const key = toQueryString(query);
  const [shown, setShown] = useState({ key, query });
  if (shown.key !== key) setShown({ key, query });

  const go = (next: CatalogQuery) => {
    setShown({ key, query: next });
    startTransition(() => router.push(`${basePath}${toQueryString(next)}`, { scroll: false }));
  };
  return { shown: shown.query, go, pending, key };
}

export function Filters({
  t,
  basePath,
  query,
  brands,
  bounds,
}: {
  t: Dictionary;
  basePath: string;
  query: CatalogQuery;
  brands: BrandOption[];
  bounds: { min: number; max: number } | null;
}) {
  const { shown, go, pending, key } = useQueryNavigation(basePath, query);
  const [open, setOpen] = useState(false);

  const priceText = (value: number | null) => (value === null ? "" : String(value));
  const [price, setPrice] = useState({ key, min: priceText(query.min), max: priceText(query.max) });
  if (price.key !== key) setPrice({ key, min: priceText(query.min), max: priceText(query.max) });

  const toggleBrand = (id: BrandId) => {
    const selected = shown.brands.includes(id) ? shown.brands.filter((b) => b !== id) : [...shown.brands, id];
    // Keep the catalogue's brand order so equal selections give equal URLs.
    go({ ...shown, brands: brands.map((b) => b.id).filter((b) => selected.includes(b)) });
  };

  const applyPrice = (event: FormEvent) => {
    event.preventDefault();
    const read = (text: string) => {
      const n = Number(text);
      return text.trim() !== "" && Number.isFinite(n) && n >= 0 ? n : null;
    };
    let min = read(price.min);
    let max = read(price.max);
    if (min !== null && max !== null && min > max) [min, max] = [max, min];
    go({ ...shown, min, max });
  };

  return (
    <aside className="filters" aria-label={t.filters} data-pending={pending || undefined}>
      <button type="button" className="filters-toggle" aria-expanded={open} aria-controls="filters-panel" onClick={() => setOpen(!open)}>
        {open ? t.hideFilters : t.showFilters}
      </button>

      <div id="filters-panel" className={`filters-panel${open ? " is-open" : ""}`}>
        <fieldset>
          <legend>{t.availability}</legend>
          <label className="check">
            <input type="checkbox" name="stock" checked={shown.inStock} onChange={() => go({ ...shown, inStock: !shown.inStock })} />
            <span>{t.inStockOnly}</span>
          </label>
          <label className="check">
            <input type="checkbox" name="sale" checked={shown.onSale} onChange={() => go({ ...shown, onSale: !shown.onSale })} />
            <span>{t.onSaleOnly}</span>
          </label>
        </fieldset>

        <fieldset>
          <legend>{t.brand}</legend>
          {brands.map((brand) => {
            const checked = shown.brands.includes(brand.id);
            return (
              <label key={brand.id} className={`check${brand.count === 0 && !checked ? " check-empty" : ""}`}>
                <input type="checkbox" name="brand" value={brand.id} checked={checked} onChange={() => toggleBrand(brand.id)} />
                <span>{brand.name}</span>
                <span className="check-count">{brand.count}</span>
              </label>
            );
          })}
        </fieldset>

        <form className="price-form" onSubmit={applyPrice}>
          <fieldset>
            <legend>{t.price}</legend>
            <div className="price-fields">
              <label>
                <span>{t.priceMin}</span>
                <input
                  type="number"
                  name="min"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  placeholder={bounds ? String(bounds.min) : undefined}
                  value={price.min}
                  onChange={(e) => setPrice({ ...price, min: e.target.value })}
                />
              </label>
              <label>
                <span>{t.priceMax}</span>
                <input
                  type="number"
                  name="max"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  placeholder={bounds ? String(bounds.max) : undefined}
                  value={price.max}
                  onChange={(e) => setPrice({ ...price, max: e.target.value })}
                />
              </label>
            </div>
            <button type="submit" className="btn btn-quiet">
              {t.apply}
            </button>
          </fieldset>
        </form>

        {hasActiveFilters(shown) && (
          <button type="button" className="link-button" onClick={() => go({ ...shown, brands: [], inStock: false, onSale: false, min: null, max: null })}>
            {t.clearFilters}
          </button>
        )}
      </div>
    </aside>
  );
}

export function SortSelect({ t, basePath, query }: { t: Dictionary; basePath: string; query: CatalogQuery }) {
  const { shown, go } = useQueryNavigation(basePath, query);
  const labels: Record<SortKey, string> = {
    newest: t.sortNewest,
    "price-asc": t.sortPriceAsc,
    "price-desc": t.sortPriceDesc,
    name: t.sortName,
  };
  return (
    <label className="sort">
      <span>{t.sortBy}</span>
      <select name="sort" value={shown.sort} onChange={(e) => go({ ...shown, sort: e.target.value as SortKey })}>
        {SORT_KEYS.map((key) => (
          <option key={key} value={key}>
            {labels[key]}
          </option>
        ))}
      </select>
    </label>
  );
}
