"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { fill } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { useShop } from "./ShopProvider";
import { WishButton } from "./WishButton";

export function QuantityStepper({
  value,
  max,
  onChange,
  t,
  id,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
  t: Dictionary;
  id: string;
}) {
  const set = (next: number) => onChange(Math.max(1, Math.min(max, Math.floor(next) || 1)));
  return (
    <div className="stepper">
      <button type="button" aria-label={t.decrease} disabled={value <= 1} onClick={() => set(value - 1)}>
        −
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value}
        aria-label={t.quantity}
        onChange={(e) => set(Number(e.target.value))}
      />
      <button type="button" aria-label={t.increase} disabled={value >= max} onClick={() => set(value + 1)}>
        +
      </button>
    </div>
  );
}

export function BuyBox({ id, name, stock, locale, t }: { id: string; name: string; stock: number; locale: Locale; t: Dictionary }) {
  const { ready, cart, addToCart } = useShop();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const inCart = ready ? (cart[id] ?? 0) : 0;
  const room = stock - inCart;

  return (
    <div className="buybox">
      {stock > 0 && (
        <div className="buybox-row">
          <div className="field">
            <label htmlFor="qty">{t.quantity}</label>
            <QuantityStepper id="qty" value={Math.min(qty, Math.max(room, 1))} max={Math.max(room, 1)} onChange={setQty} t={t} />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={room <= 0}
            onClick={() => {
              addToCart(id, Math.min(qty, room), stock);
              setJustAdded(true);
              setQty(1);
            }}
          >
            {t.addToCart}
          </button>
        </div>
      )}

      <p className="buybox-status" role="status">
        {inCart > 0 && (
          <>
            <span>{justAdded ? `${t.addedToCart}. ` : ""}{fill(t.inCart, { n: inCart })}</span>{" "}
            <Link href={`/${locale}/cart`}>{t.viewCart}</Link>
          </>
        )}
      </p>

      <WishButton id={id} name={name} t={t} withText className="wish-wide" />
    </div>
  );
}
