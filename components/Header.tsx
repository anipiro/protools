"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { useShop } from "./ShopProvider";

interface NavItem {
  href: string;
  label: string;
}

const languages: { locale: Locale; label: string }[] = [
  { locale: "en", label: "English" },
  { locale: "ka", label: "ქართული" },
];

function LanguageLinks({ current, suffix }: { current: Locale; suffix: (locale: Locale) => string }) {
  return (
    <>
      {languages.map(({ locale, label }) => (
        <Link
          key={locale}
          href={suffix(locale)}
          lang={locale}
          hrefLang={locale}
          aria-current={locale === current ? "true" : undefined}
          className="lang-link"
        >
          {label}
        </Link>
      ))}
    </>
  );
}

/** Switches language and keeps the visitor on the same page with the same filters. */
function LanguageSwitch({ current }: { current: Locale }) {
  const pathname = usePathname();
  // Keep commas readable: ?brand=a,b rather than ?brand=a%2Cb.
  const search = useSearchParams().toString().replace(/%2C/gi, ",");
  const rest = pathname.split("/").slice(2).join("/");
  return (
    <LanguageLinks
      current={current}
      suffix={(locale) => `/${locale}${rest ? `/${rest}` : ""}${search ? `?${search}` : ""}`}
    />
  );
}

export function Header({ locale, t, nav }: { locale: Locale; t: Dictionary; nav: NavItem[] }) {
  const pathname = usePathname();
  const { ready, cartCount, wishlist } = useShop();

  return (
    <header className="site-header">
      <div className="demo-strip">
        <div className="wrap demo-strip-inner">
          <p className="demo-label">{t.demoLabel}</p>
          <nav className="lang" aria-label={t.language}>
            <Suspense fallback={<LanguageLinks current={locale} suffix={(l) => `/${l}`} />}>
              <LanguageSwitch current={locale} />
            </Suspense>
          </nav>
        </div>
      </div>

      <div className="wrap header-main">
        <Link href={`/${locale}`} className="wordmark" aria-label={`Toolyard, ${t.home}`}>
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path d="M16 2l12 7v14l-12 7-12-7V9z" fill="currentColor" />
            <circle cx="16" cy="16" r="5.5" fill="var(--paper)" />
          </svg>
          <span>Toolyard</span>
        </Link>

        <form className="search" role="search" action={`/${locale}/search`}>
          <label htmlFor="site-search" className="visually-hidden">
            {t.searchLabel}
          </label>
          <input id="site-search" name="q" type="search" placeholder={t.searchPlaceholder} autoComplete="off" />
          <button type="submit">{t.searchButton}</button>
        </form>

        <div className="header-actions">
          <Link href={`/${locale}/wishlist`} className="action-link">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 1.9c0 6.100-8.500 11.600-8.500 11.600z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <span className="action-text">{t.wishlist}</span>
            {ready && wishlist.length > 0 && <span className="count">{wishlist.length}</span>}
          </Link>
          <Link href={`/${locale}/cart`} className="action-link action-cart">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M3 4h2.500l2.200 11h10.600l2-8H7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx="9" cy="19.500" r="1.500" fill="currentColor" />
              <circle cx="17" cy="19.500" r="1.500" fill="currentColor" />
            </svg>
            <span className="action-text">{t.cart}</span>
            {ready && cartCount > 0 && (
              <span className="count" data-testid="cart-count">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className="cat-nav" aria-label={t.categories}>
        <ul className="wrap">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
