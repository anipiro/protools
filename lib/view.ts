// Shapes a catalogue product for display in one language.

import { getBrand, productName } from "./catalog-data.ts";
import type { Locale, Product } from "./types.ts";

export interface ProductView extends Product {
  name: string;
  brandName: string;
  brandColor: string;
}

export function toView(p: Product, locale: Locale): ProductView {
  const brand = getBrand(p.brand);
  return { ...p, name: productName(p, locale), brandName: brand.name, brandColor: brand.color };
}
