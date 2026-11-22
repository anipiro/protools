"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cartTotals, formatTetri } from "@/lib/cart";
import type { Dictionary } from "@/lib/i18n";
import { fill } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import type { ProductView } from "@/lib/view";
import { QuantityStepper } from "./BuyBox";
import { ProductCard, StockNote } from "./ProductCard";
import { useShop } from "./ShopProvider";
import { ToolArt } from "./ToolArt";

/** Loads the products behind a list of ids from the mock API. */
function useProducts(ids: string[], locale: Locale) {
  const key = [...ids].sort().join(",");
  const [state, setState] = useState<{ key: string; items: Record<string, ProductView> } | null>(null);

  useEffect(() => {
    if (key === "") return;
    let cancelled = false;
    fetch(`/api/products?locale=${locale}&ids=${encodeURIComponent(key)}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: { items: ProductView[] }) => {
        if (!cancelled) setState({ key, items: Object.fromEntries(data.items.map((p) => [p.id, p])) });
      })
      .catch(() => {
        if (!cancelled) setState({ key, items: {} });
      });
    return () => {
      cancelled = true;
    };
  }, [key, locale]);

  // Ids whose data has arrived stay usable while a changed list is refetched.
  return { items: state?.items ?? {}, loaded: key === "" || state?.key === key };
}

function EmptyState({ title, text, locale, t }: { title: string; text: string; locale: Locale; t: Dictionary }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="btn btn-primary" href={`/${locale}/search`}>
        {t.browseTools}
      </Link>
    </div>
  );
}

export function CartView({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { ready, cart, setQty, removeFromCart } = useShop();
  const ids = Object.keys(cart);
  const { items, loaded } = useProducts(ids, locale);
  const totals = useMemo(
    () => cartTotals(Object.entries(cart).map(([id, qty]) => ({ id, qty })), (id) => items[id]),
    [cart, items],
  );

  if (!ready || (!loaded && totals.lines.length === 0)) return <p className="loading">{t.loading}</p>;
  if (ids.length === 0 || (loaded && totals.lines.length === 0)) {
    return <EmptyState title={t.cartEmptyTitle} text={t.cartEmptyText} locale={locale} t={t} />;
  }

  return (
    <div className="cart">
      <ul className="cart-lines">
        {totals.lines.map((line) => {
          const p = items[line.id];
          return (
            <li key={line.id} className="cart-line" data-testid="cart-line">
              <div className="peg cart-art">
                <ToolArt type={p.type} color={p.brandColor} />
              </div>
              <div className="cart-info">
                <h2>
                  <Link href={`/${locale}/product/${p.id}`}>{p.name}</Link>
                </h2>
                <StockNote stock={p.stock} t={t} />
                <p className="cart-each">
                  {fill(t.each, { price: formatTetri(line.unit, locale) })}
                  {line.unit < line.unitRegular && <s className="price-was">{formatTetri(line.unitRegular, locale)}</s>}
                </p>
              </div>
              <div className="cart-qty">
                <QuantityStepper id={`qty-${p.id}`} value={line.qty} max={p.stock} onChange={(qty) => setQty(p.id, qty)} t={t} />
                <button type="button" className="link-button" onClick={() => removeFromCart(p.id)} aria-label={`${t.remove}: ${p.name}`}>
                  {t.remove}
                </button>
              </div>
              <p className="cart-line-total">{formatTetri(line.lineTotal, locale)}</p>
            </li>
          );
        })}
      </ul>

      <aside className="summary" aria-label={t.total}>
        <dl>
          {totals.savings > 0 && (
            <>
              <div>
                <dt>{t.regularTotal}</dt>
                <dd>{formatTetri(totals.regularTotal, locale)}</dd>
              </div>
              <div className="summary-savings">
                <dt>{t.savings}</dt>
                <dd>−{formatTetri(totals.savings, locale)}</dd>
              </div>
            </>
          )}
          <div className="summary-total">
            <dt>{t.total}</dt>
            <dd data-testid="cart-total">{formatTetri(totals.total, locale)}</dd>
          </div>
        </dl>
        <p className="summary-note">{t.checkoutNote}</p>
      </aside>
    </div>
  );
}

export function WishlistView({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { ready, wishlist } = useShop();
  const { items, loaded } = useProducts(wishlist, locale);
  const shown = wishlist.map((id) => items[id]).filter(Boolean);

  if (!ready || (!loaded && shown.length === 0)) return <p className="loading">{t.loading}</p>;
  if (shown.length === 0) {
    return <EmptyState title={t.wishlistEmptyTitle} text={t.wishlistEmptyText} locale={locale} t={t} />;
  }
  return (
    <ul className="grid">
      {shown.map((p) => (
        <ProductCard key={p.id} product={p} locale={locale} t={t} />
      ))}
    </ul>
  );
}
