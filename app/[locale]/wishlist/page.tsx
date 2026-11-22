import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WishlistView } from "@/components/CartView";
import { getDictionary, isLocale } from "@/lib/i18n";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).wishlist } : {};
}

export default async function WishlistPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <div className="wrap page">
      <header className="page-head">
        <h1>{t.wishlistTitle}</h1>
      </header>
      <WishlistView locale={locale} t={t} />
    </div>
  );
}
