import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { ShopProvider } from "@/components/ShopProvider";
import { categories } from "@/lib/catalog-data";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Toolyard Demo", template: "%s | Toolyard Demo" },
  description: "A portfolio demo of a professional tool shop. Brands, products and prices are invented.",
  robots: { index: false },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  // Pages reject unknown locales with a 404; the frame around them falls back to English.
  const locale = isLocale(raw) ? raw : "en";
  const t = getDictionary(locale);
  const nav = [
    ...categories.map((c) => ({ href: `/${locale}/category/${c.id}`, label: c.name[locale] })),
    { href: `/${locale}/search`, label: t.allTools },
  ];

  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#main">
          {t.skipToContent}
        </a>
        <ShopProvider>
          <Header locale={locale} t={t} nav={nav} />
          <main id="main">{children}</main>
        </ShopProvider>
        <footer className="site-footer">
          <div className="wrap">
            <p className="footer-label">{t.demoLabel}</p>
            <p>{t.demoNote}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
