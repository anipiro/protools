import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/BuyBox";
import { Price, ProductCard, StockNote } from "@/components/ProductCard";
import { ToolArt } from "@/components/ToolArt";
import { discountPercent } from "@/lib/cart";
import { getCategory, getProduct, productName, products } from "@/lib/catalog-data";
import { fill, getDictionary, isLocale, specLabel, specValue } from "@/lib/i18n";
import { toView } from "@/lib/view";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const product = getProduct(id);
  return product && isLocale(locale) ? { title: productName(product, locale) } : {};
}

export default async function ProductPage({ params }: Props) {
  const { locale, id } = await params;
  const found = getProduct(id);
  if (!isLocale(locale) || !found) notFound();
  const t = getDictionary(locale);
  const product = toView(found, locale);
  const category = getCategory(product.category)!;
  const percent = discountPercent(product.price, product.salePrice);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="wrap page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href={`/${locale}`}>{t.home}</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/${locale}/category/${category.id}`}>{category.name[locale]}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.model}</span>
      </nav>

      <article className="product">
        <div className="peg product-art">
          <ToolArt type={product.type} color={product.brandColor} />
          {percent > 0 && (
            <span className="sale-tag">
              <span className="visually-hidden">{t.sale} </span>−{percent}%
            </span>
          )}
        </div>

        <div className="product-info">
          <p className="product-brand">
            <span className="swatch" style={{ background: product.brandColor }} aria-hidden="true" />
            {product.brandName}
          </p>
          <h1>{product.name}</h1>
          <p className="lede">{category.blurb[locale]}</p>

          <div className="product-price">
            <Price price={product.price} salePrice={product.salePrice} locale={locale} t={t} />
            <StockNote stock={product.stock} t={t} />
          </div>

          <BuyBox id={product.id} name={product.name} stock={product.stock} locale={locale} t={t} />

          <h2 className="spec-title">{t.specifications}</h2>
          <dl className="specs">
            <div>
              <dt>{t.model}</dt>
              <dd>{product.model}</dd>
            </div>
            <div>
              <dt>{t.brand}</dt>
              <dd>{product.brandName}</dd>
            </div>
            {product.specs.map((spec) => (
              <div key={spec.key}>
                <dt>{specLabel(spec.key, locale)}</dt>
                <dd>{specValue(spec.value, spec.unit, locale)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>

      <section className="section" aria-labelledby="related-title">
        <h2 id="related-title">{fill(t.moreFrom, { name: category.name[locale] })}</h2>
        <ul className="grid grid-four">
          {related.map((p) => (
            <ProductCard key={p.id} product={toView(p, locale)} locale={locale} t={t} />
          ))}
        </ul>
      </section>
    </div>
  );
}
