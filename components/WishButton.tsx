"use client";

import type { Dictionary } from "@/lib/i18n";
import { useShop } from "./ShopProvider";

export function WishButton({
  id,
  name,
  t,
  className,
  withText = false,
}: {
  id: string;
  name: string;
  t: Dictionary;
  className?: string;
  withText?: boolean;
}) {
  const { ready, wishlist, toggleWish } = useShop();
  const saved = ready && wishlist.includes(id);
  const label = saved ? t.removeFromWishlist : t.addToWishlist;
  return (
    <button
      type="button"
      className={`wish${saved ? " wish-on" : ""}${className ? ` ${className}` : ""}`}
      aria-pressed={saved}
      aria-label={withText ? undefined : `${label}: ${name}`}
      title={withText ? undefined : label}
      onClick={() => toggleWish(id)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 20.500S3.500 15 3.500 8.900A4.400 4.400 0 0 1 12 7a4.400 4.400 0 0 1 8.500 1.900c0 6.100-8.500 11.600-8.500 11.600z" />
      </svg>
      {withText && <span>{saved ? t.saved : t.addToWishlist}</span>}
    </button>
  );
}
