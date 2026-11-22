import Link from "next/link";
import type { ReactNode } from "react";
import { formatGel } from "@/lib/cart";
import { hasActiveFilters, queryCatalog, toQueryString } from "@/lib/catalog";
import type { CatalogQuery } from "@/lib/catalog";
import { productName } from "@/lib/catalog-data";
import type { Dictionary } from "@/lib/i18n";
import { fill, productCount } from "@/lib/i18n";
import type { Locale, Product } from "@/lib/types";
import { toView } from "@/lib/view";
import { Filters, SortSelect } from "./Filters";
import { ProductCard } from "./ProductCard";

/** Product grid with filters and sorting. Used by category pages and by search. */
export function CatalogView({
  locale,
  t,
  basePath,
  list,
  query,
  title,
  intro,
  crumbs,
}: {
  locale: Locale;
  t: Dictionary;
  basePath: string;
  list: Product[];
  query: CatalogQuery;
  title: string;
  intro?: string;
  crumbs: ReactNode;
}) {
  const result = queryCatalog(list, query, (p) => productName(p, locale));
  const link = (next: CatalogQuery) => `${basePath}${toQueryString(next)}`;

  const chips: { label: string; href: string }[] = [];
  if (query.inStock) chips.push({ label: t.inStockOnly, href: link({ ...query, inStock: false }) });
  if (query.onSale) chips.push({ label: t.onSaleOnly, href: link({ ...query, onSale: false }) });
  for (const id of query.brands) {
    const name = result.brandCounts.find((b) => b.id === id)?.name ?? id;
    chips.push({ label: name, href: link({ ...query, brands: query.brands.filter((b) => b !== id) }) });
  }
  if (query.min !== null || query.max !== null) {
    const from = query.min !== null ? formatGel(query.min, locale) : "0";
    const to = query.max !== null ? formatGel(query.max, locale) : "…";
    chips.push({ label: `${from} – ${to}`, href: link({ ...query, min: null, max: null }) });
  }

  return (
    <div className="wrap page">
      {crumbs}
      <header className="page-head">
        <h1>{title}</h1>
        {intro && <p className="lede">{intro}</p>}
      </header>

      <div className="catalog">
        <Filters t={t} basePath={basePath} query={query} brands={result.brandCounts} bounds={result.priceBounds} />

        <section className="results" aria-label={title}>
          <div className="toolbar">
            <p className="result-count" role="status" data-testid="result-count">
              {productCount(t, result.total)}
            </p>
            <SortSelect t={t} basePath={basePath} query={query} />
          </div>

          {chips.length > 0 && (
            <ul className="chips">
              {chips.map((chip) => (
                <li key={chip.label}>
                  <Link href={chip.href} scroll={false} aria-label={fill(t.removeFilter, { name: chip.label })}>
                    <span>{chip.label}</span>
                    <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
                      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {result.total === 0 ? (
            <div className="empty">
              <h2>{t.emptyTitle}</h2>
              <p>{hasActiveFilters(query) || !query.q ? t.emptyText : t.emptySearchText}</p>
              {hasActiveFilters(query) && (
                <Link className="btn" href={link({ ...query, brands: [], inStock: false, onSale: false, min: null, max: null })}>
                  {t.clearFilters}
                </Link>
              )}
            </div>
          ) : (
            <ul className="grid">
              {result.items.map((p) => (
                <ProductCard key={p.id} product={toView(p, locale)} locale={locale} t={t} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
