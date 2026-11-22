import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ToolArt } from "@/components/ToolArt";
import { EMPTY_QUERY, isOnSale, sortProducts, toQueryString } from "@/lib/catalog";
import { brands, categories, productName, products } from "@/lib/catalog-data";
import { getDictionary, isLocale, productCount } from "@/lib/i18n";
import { toView } from "@/lib/view";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const onSale = sortProducts(
    products.filter((p) => isOnSale(p) && p.stock > 0),
    "newest",
    (p) => productName(p, locale),
  ).slice(0, 4);

  return (
    <div className="wrap page home">
      <header className="hero">
        <h1>{t.heroTitle}</h1>
        <p className="lede">{t.heroText}</p>
      </header>

      <section aria-labelledby="wall-title">
        <h2 id="wall-title" className="visually-hidden">
          {t.categories}
        </h2>
        <ul className="peg wall">
          {categories.map((category, i) => {
            const count = products.filter((p) => p.category === category.id).length;
            return (
              <li key={category.id}>
                <Link href={`/${locale}/category/${category.id}`} className="wall-item">
                  <ToolArt type={category.cover} color={brands[i % brands.length].color} className="wall-art" />
                  <span className="wall-plate">
                    <span className="wall-name">{category.name[locale]}</span>
                    <span className="wall-count">{productCount(t, count)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="section" aria-labelledby="brands-title">
        <h2 id="brands-title">{t.shopByBrand}</h2>
        <ul className="brand-row">
          {brands.map((brand) => (
            <li key={brand.id}>
              <Link
                href={`/${locale}/search${toQueryString({ ...EMPTY_QUERY, brands: [brand.id] })}`}
                className="brand-plate"
                style={{ borderLeftColor: brand.color }}
              >
                <span className="brand-name">{brand.name}</span>
                <span className="brand-count">{productCount(t, products.filter((p) => p.brand === brand.id).length)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="sale-title">
        <div className="section-head">
          <h2 id="sale-title">{t.onSaleNow}</h2>
          <Link href={`/${locale}/search${toQueryString({ ...EMPTY_QUERY, onSale: true })}`}>{t.seeAllOnSale}</Link>
        </div>
        <ul className="grid grid-four">
          {onSale.map((p) => (
            <ProductCard key={p.id} product={toView(p, locale)} locale={locale} t={t} />
          ))}
        </ul>
      </section>
    </div>
  );
}
