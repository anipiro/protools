import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/CatalogView";
import { parseQuery } from "@/lib/catalog";
import { products } from "@/lib/catalog-data";
import { fill, getDictionary, isLocale } from "@/lib/i18n";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).allTools } : {};
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const query = parseQuery(await searchParams);

  return (
    <CatalogView
      locale={locale}
      t={t}
      basePath={`/${locale}/search`}
      list={products}
      query={query}
      title={query.q ? fill(t.searchResultsFor, { q: query.q }) : t.allTools}
      crumbs={
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={`/${locale}`}>{t.home}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{query.q ? t.searchButton : t.allTools}</span>
        </nav>
      }
    />
  );
}
