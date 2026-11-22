import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/CatalogView";
import { parseQuery } from "@/lib/catalog";
import { getCategory, products } from "@/lib/catalog-data";
import { getDictionary, isLocale } from "@/lib/i18n";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = getCategory(slug);
  return category && isLocale(locale) ? { title: category.name[locale] } : {};
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const category = getCategory(slug);
  if (!isLocale(locale) || !category) notFound();
  const t = getDictionary(locale);
  // A category page has no text search, so a stray ?q= is ignored.
  const query = { ...parseQuery(await searchParams), q: "" };

  return (
    <CatalogView
      locale={locale}
      t={t}
      basePath={`/${locale}/category/${category.id}`}
      list={products.filter((p) => p.category === category.id)}
      query={query}
      title={category.name[locale]}
      intro={category.blurb[locale]}
      crumbs={
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={`/${locale}`}>{t.home}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{category.name[locale]}</span>
        </nav>
      }
    />
  );
}
