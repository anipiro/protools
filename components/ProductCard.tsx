import Link from "next/link";
import { discountPercent, formatGel } from "@/lib/cart";
import type { Dictionary } from "@/lib/i18n";
import { fill } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { ToolArt } from "./ToolArt";
import { WishButton } from "./WishButton";

/** The fields a card needs. Both server pages and the mock API produce this shape. */
export interface CardProduct {
  id: string;
  type: Parameters<typeof ToolArt>[0]["type"];
  name: string;
  model: string;
  brandColor: string;
  price: number;
  salePrice: number | null;
  stock: number;
}

export function Price({ price, salePrice, locale, t }: { price: number; salePrice: number | null; locale: Locale; t: Dictionary }) {
  if (salePrice === null) return <span className="price">{formatGel(price, locale)}</span>;
  return (
    <span className="price-group">
      <span className="price price-sale">{formatGel(salePrice, locale)}</span>
      <s className="price-was" aria-label={`${t.regularTotal}: ${formatGel(price, locale)}`}>
        {formatGel(price, locale)}
      </s>
    </span>
  );
}

export function StockNote({ stock, t }: { stock: number; t: Dictionary }) {
  if (stock === 0) return <span className="stock stock-out">{t.outOfStock}</span>;
  if (stock <= 3) return <span className="stock stock-low">{fill(t.lowStock, { n: stock })}</span>;
  return <span className="stock stock-in">{t.inStock}</span>;
}

export function ProductCard({ product, locale, t }: { product: CardProduct; locale: Locale; t: Dictionary }) {
  const percent = discountPercent(product.price, product.salePrice);
  return (
    <li className={`card${product.stock === 0 ? " card-out" : ""}`}>
      <div className="peg card-art">
        <ToolArt type={product.type} color={product.brandColor} />
        {percent > 0 && (
          <span className="sale-tag">
            <span className="visually-hidden">{t.sale} </span>−{percent}%
          </span>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-name">
          <Link href={`/${locale}/product/${product.id}`}>{product.name}</Link>
        </h3>
        <StockNote stock={product.stock} t={t} />
        <Price price={product.price} salePrice={product.salePrice} locale={locale} t={t} />
      </div>
      <WishButton id={product.id} name={product.name} t={t} className="card-wish" />
    </li>
  );
}
