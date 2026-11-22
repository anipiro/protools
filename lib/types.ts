export type Locale = "en" | "ka";

export type CategoryId = "drills" | "grinders" | "saws" | "hand-tools" | "storage" | "measuring";

export type BrandId = "tavro" | "hexmoor" | "norvane" | "brigant" | "ardwell" | "quillon";

export type ToolTypeId =
  | "hammer-drill"
  | "drill-driver"
  | "rotary-hammer"
  | "impact-driver"
  | "angle-grinder"
  | "orbital-sander"
  | "belt-sander"
  | "bench-grinder"
  | "circular-saw"
  | "jigsaw"
  | "recip-saw"
  | "mitre-saw"
  | "hammer"
  | "screwdriver-set"
  | "wrench"
  | "pliers"
  | "toolbox"
  | "tool-bag"
  | "organiser"
  | "cabinet"
  | "tape"
  | "level"
  | "laser-level"
  | "distance-meter";

export type SpecKey =
  | "power"
  | "voltage"
  | "weight"
  | "disc"
  | "length"
  | "pieces"
  | "compartments"
  | "drawers"
  | "capacity"
  | "range"
  | "accuracy";

export type Unit = "W" | "V" | "kg" | "mm" | "m" | "L" | "";

export interface Spec {
  key: SpecKey;
  value: number;
  unit: Unit;
}

export interface Product {
  /** URL-safe id, built from brand and model code. */
  id: string;
  type: ToolTypeId;
  category: CategoryId;
  brand: BrandId;
  model: string;
  /** Regular price in GEL. */
  price: number;
  /** Sale price in GEL, when the product is discounted. */
  salePrice: number | null;
  stock: number;
  /** ISO date the product was added to the catalogue. */
  added: string;
  specs: Spec[];
}

export interface Brand {
  id: BrandId;
  name: string;
  /** Body colour used in the product illustrations. */
  color: string;
}

export interface Category {
  id: CategoryId;
  name: Record<Locale, string>;
  blurb: Record<Locale, string>;
  /** The tool type drawn for this category on the home page. */
  cover: ToolTypeId;
}
