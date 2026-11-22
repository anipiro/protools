// Invented sample catalogue. Brands, model codes and prices are fictional.

import type {
  Brand,
  BrandId,
  Category,
  CategoryId,
  Locale,
  Product,
  Spec,
  SpecKey,
  ToolTypeId,
  Unit,
} from "./types.ts";

export const brands: Brand[] = [
  { id: "tavro", name: "Tavro", color: "#2a7f86" },
  { id: "hexmoor", name: "Hexmoor", color: "#a8432f" },
  { id: "norvane", name: "Norvane", color: "#46524f" },
  { id: "brigant", name: "Brigant", color: "#c28a2c" },
  { id: "ardwell", name: "Ardwell", color: "#2f4a7a" },
  { id: "quillon", name: "Quillon", color: "#6a5a86" },
];

export const categories: Category[] = [
  {
    id: "drills",
    name: { en: "Drills and hammers", ka: "ბურღები და პერფორატორები" },
    blurb: {
      en: "Built for daily drilling in masonry, timber and steel.",
      ka: "ყოველდღიური ბურღვისთვის ბეტონში, ხეში და ლითონში.",
    },
    cover: "hammer-drill",
  },
  {
    id: "grinders",
    name: { en: "Grinders and sanders", ka: "სახეხი მანქანები" },
    blurb: {
      en: "For cutting, grinding and finishing on site or at the bench.",
      ka: "ჭრისთვის, ხეხვისთვის და ზედაპირის დამუშავებისთვის.",
    },
    cover: "angle-grinder",
  },
  {
    id: "saws",
    name: { en: "Saws", ka: "ხერხები" },
    blurb: {
      en: "Clean, straight cuts in timber, board and metal.",
      ka: "სუფთა და სწორი ჭრა ხეში, ფილაში და ლითონში.",
    },
    cover: "circular-saw",
  },
  {
    id: "hand-tools",
    name: { en: "Hand tools", ka: "ხელის ინსტრუმენტები" },
    blurb: {
      en: "Forged steel and comfortable grips for work that lasts all day.",
      ka: "მტკიცე ფოლადი და მოსახერხებელი სახელური ყოველდღიური სამუშაოსთვის.",
    },
    cover: "hammer",
  },
  {
    id: "storage",
    name: { en: "Storage", ka: "შენახვა" },
    blurb: {
      en: "Keeps a full kit organised between the van and the job.",
      ka: "ინსტრუმენტების მოწესრიგებული შენახვა და გადატანა.",
    },
    cover: "toolbox",
  },
  {
    id: "measuring",
    name: { en: "Measuring", ka: "საზომი ინსტრუმენტები" },
    blurb: {
      en: "Accurate layout and measuring, indoors and out.",
      ka: "ზუსტი გაზომვა შენობაში და გარეთ.",
    },
    cover: "tape",
  },
];

interface ToolType {
  category: CategoryId;
  name: Record<Locale, string>;
}

export const toolTypes: Record<ToolTypeId, ToolType> = {
  "hammer-drill": { category: "drills", name: { en: "hammer drill", ka: "დარტყმითი ბურღი" } },
  "drill-driver": { category: "drills", name: { en: "cordless drill driver", ka: "აკუმულატორიანი ბურღი" } },
  "rotary-hammer": { category: "drills", name: { en: "rotary hammer", ka: "პერფორატორი" } },
  "impact-driver": { category: "drills", name: { en: "impact driver", ka: "დარტყმითი სახრახნისი" } },
  "angle-grinder": { category: "grinders", name: { en: "angle grinder", ka: "კუთხსახეხი მანქანა" } },
  "orbital-sander": { category: "grinders", name: { en: "orbital sander", ka: "ორბიტალური სახეხი მანქანა" } },
  "belt-sander": { category: "grinders", name: { en: "belt sander", ka: "ლენტური სახეხი მანქანა" } },
  "bench-grinder": { category: "grinders", name: { en: "bench grinder", ka: "სალესი ჩარხი" } },
  "circular-saw": { category: "saws", name: { en: "circular saw", ka: "ცირკულარული ხერხი" } },
  jigsaw: { category: "saws", name: { en: "jigsaw", ka: "ელექტრო ბეწვა ხერხი" } },
  "recip-saw": { category: "saws", name: { en: "reciprocating saw", ka: "საბლისებრი ხერხი" } },
  "mitre-saw": { category: "saws", name: { en: "mitre saw", ka: "ტორსული ხერხი" } },
  hammer: { category: "hand-tools", name: { en: "claw hammer", ka: "ჩაქუჩი" } },
  "screwdriver-set": { category: "hand-tools", name: { en: "screwdriver set", ka: "სახრახნისების ნაკრები" } },
  wrench: { category: "hand-tools", name: { en: "adjustable wrench", ka: "გასაშლელი გასაღები" } },
  pliers: { category: "hand-tools", name: { en: "combination pliers", ka: "ბრტყელტუჩა" } },
  toolbox: { category: "storage", name: { en: "toolbox", ka: "ინსტრუმენტების ყუთი" } },
  "tool-bag": { category: "storage", name: { en: "tool bag", ka: "ინსტრუმენტების ჩანთა" } },
  organiser: { category: "storage", name: { en: "parts organiser", ka: "ორგანაიზერი" } },
  cabinet: { category: "storage", name: { en: "rolling tool cabinet", ka: "ინსტრუმენტების ურიკა" } },
  tape: { category: "measuring", name: { en: "tape measure", ka: "რულეტი" } },
  level: { category: "measuring", name: { en: "spirit level", ka: "თარაზო" } },
  "laser-level": { category: "measuring", name: { en: "laser level", ka: "ლაზერული თარაზო" } },
  "distance-meter": { category: "measuring", name: { en: "laser distance meter", ka: "ლაზერული მანძილმზომი" } },
};

type SpecTuple = [SpecKey, number, Unit];

function product(
  type: ToolTypeId,
  brand: BrandId,
  model: string,
  price: number,
  salePrice: number | null,
  stock: number,
  added: string,
  specs: SpecTuple[],
): Product {
  return {
    id: `${brand}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    type,
    category: toolTypes[type].category,
    brand,
    model,
    price,
    salePrice,
    stock,
    added,
    specs: specs.map(([key, value, unit]): Spec => ({ key, value, unit })),
  };
}

export const products: Product[] = [
  // Drills and hammers
  product("hammer-drill", "tavro", "TD-750", 189, null, 14, "2026-03-12", [["power", 750, "W"], ["weight", 2.1, "kg"]]),
  product("hammer-drill", "hexmoor", "HX-1010", 265, 229, 6, "2026-09-02", [["power", 1010, "W"], ["weight", 2.6, "kg"]]),
  product("drill-driver", "norvane", "NV-18D", 349, null, 9, "2026-08-18", [["voltage", 18, "V"], ["weight", 1.6, "kg"]]),
  product("drill-driver", "brigant", "BG-12C", 219, 185, 0, "2026-01-22", [["voltage", 12, "V"], ["weight", 1.1, "kg"]]),
  product("rotary-hammer", "ardwell", "AR-3200", 729, null, 4, "2026-10-05", [["power", 1500, "W"], ["weight", 5.4, "kg"]]),
  product("rotary-hammer", "tavro", "TR-2600", 545, 469, 11, "2026-05-30", [["power", 900, "W"], ["weight", 3.1, "kg"]]),
  product("impact-driver", "quillon", "QD-18i", 415, null, 2, "2026-10-20", [["voltage", 18, "V"], ["weight", 1.3, "kg"]]),
  product("impact-driver", "hexmoor", "HX-20i", 389, null, 17, "2026-04-08", [["voltage", 20, "V"], ["weight", 1.5, "kg"]]),

  // Grinders and sanders
  product("angle-grinder", "norvane", "NV-125", 159, null, 22, "2026-02-14", [["power", 900, "W"], ["disc", 125, "mm"]]),
  product("angle-grinder", "brigant", "BG-230", 299, 249, 5, "2026-07-21", [["power", 2200, "W"], ["disc", 230, "mm"]]),
  product("angle-grinder", "tavro", "TG-115", 129, null, 0, "2025-11-03", [["power", 720, "W"], ["disc", 115, "mm"]]),
  product("orbital-sander", "ardwell", "AR-OS5", 175, null, 8, "2026-06-09", [["power", 300, "W"], ["weight", 1.4, "kg"]]),
  product("orbital-sander", "quillon", "QS-150", 239, 199, 3, "2026-09-27", [["power", 350, "W"], ["disc", 150, "mm"]]),
  product("belt-sander", "hexmoor", "HX-B76", 329, null, 7, "2026-03-30", [["power", 1010, "W"], ["weight", 3.5, "kg"]]),
  product("bench-grinder", "brigant", "BG-B200", 385, null, 2, "2026-08-01", [["power", 550, "W"], ["disc", 200, "mm"]]),
  product("bench-grinder", "norvane", "NV-B150", 259, 215, 10, "2026-04-17", [["power", 370, "W"], ["disc", 150, "mm"]]),

  // Saws
  product("circular-saw", "tavro", "TS-190", 315, null, 12, "2026-05-11", [["power", 1400, "W"], ["disc", 190, "mm"]]),
  product("circular-saw", "quillon", "QC-165", 495, 429, 4, "2026-10-12", [["voltage", 18, "V"], ["disc", 165, "mm"]]),
  product("jigsaw", "hexmoor", "HX-J80", 209, null, 15, "2026-02-26", [["power", 650, "W"], ["weight", 2.2, "kg"]]),
  product("jigsaw", "ardwell", "AR-J110", 289, null, 0, "2026-06-23", [["power", 800, "W"], ["weight", 2.5, "kg"]]),
  product("recip-saw", "norvane", "NV-R18", 365, 319, 6, "2026-09-15", [["voltage", 18, "V"], ["weight", 2.9, "kg"]]),
  product("recip-saw", "brigant", "BG-R1200", 279, null, 9, "2026-01-09", [["power", 1200, "W"], ["weight", 3.8, "kg"]]),
  product("mitre-saw", "ardwell", "AR-M254", 899, null, 3, "2026-07-04", [["power", 1800, "W"], ["disc", 254, "mm"]]),
  product("mitre-saw", "tavro", "TS-M216", 649, 579, 5, "2026-10-28", [["power", 1500, "W"], ["disc", 216, "mm"]]),

  // Hand tools
  product("hammer", "brigant", "BG-H450", 39, null, 40, "2025-12-02", [["weight", 0.45, "kg"], ["length", 330, "mm"]]),
  product("hammer", "norvane", "NV-H600", 52, 44, 18, "2026-06-14", [["weight", 0.6, "kg"], ["length", 340, "mm"]]),
  product("screwdriver-set", "quillon", "QH-S12", 68, null, 25, "2026-03-05", [["pieces", 12, ""]]),
  product("screwdriver-set", "tavro", "TH-S32", 119, 95, 7, "2026-08-25", [["pieces", 32, ""]]),
  product("wrench", "hexmoor", "HX-W250", 45, null, 30, "2026-01-30", [["length", 250, "mm"]]),
  product("wrench", "ardwell", "AR-W300", 58, null, 0, "2026-05-19", [["length", 300, "mm"]]),
  product("pliers", "norvane", "NV-P180", 36, null, 21, "2026-04-02", [["length", 180, "mm"]]),
  product("pliers", "quillon", "QH-P200", 42, 35, 13, "2026-09-08", [["length", 200, "mm"]]),

  // Storage
  product("toolbox", "brigant", "BG-T50", 95, null, 16, "2026-02-08", [["capacity", 28, "L"], ["weight", 2.4, "kg"]]),
  product("toolbox", "tavro", "TX-65", 145, 119, 8, "2026-07-13", [["capacity", 41, "L"], ["weight", 3.2, "kg"]]),
  product("tool-bag", "hexmoor", "HX-G40", 129, null, 11, "2026-05-02", [["capacity", 32, "L"]]),
  product("tool-bag", "quillon", "QB-28", 89, null, 1, "2026-10-01", [["capacity", 22, "L"]]),
  product("organiser", "norvane", "NV-O18", 49, null, 33, "2025-12-18", [["compartments", 18, ""]]),
  product("organiser", "ardwell", "AR-O34", 75, 62, 14, "2026-08-09", [["compartments", 34, ""]]),
  product("cabinet", "ardwell", "AR-C7", 1190, null, 2, "2026-09-21", [["drawers", 7, ""], ["weight", 62, "kg"]]),
  product("cabinet", "brigant", "BG-C5", 849, 749, 3, "2026-04-24", [["drawers", 5, ""], ["weight", 48, "kg"]]),

  // Measuring
  product("tape", "tavro", "TM-5", 19, null, 60, "2026-01-15", [["length", 5, "m"]]),
  product("tape", "norvane", "NV-T8", 29, 24.5, 45, "2026-06-30", [["length", 8, "m"]]),
  product("level", "hexmoor", "HX-L600", 55, null, 19, "2026-03-19", [["length", 600, "mm"]]),
  product("level", "brigant", "BG-L1200", 98, null, 0, "2026-07-28", [["length", 1200, "mm"]]),
  product("laser-level", "quillon", "QL-G30", 459, 399, 6, "2026-10-16", [["range", 30, "m"], ["accuracy", 0.3, "mm"]]),
  product("laser-level", "ardwell", "AR-L20", 329, null, 4, "2026-05-25", [["range", 20, "m"], ["accuracy", 0.4, "mm"]]),
  product("distance-meter", "norvane", "NV-D50", 185, null, 12, "2026-08-30", [["range", 50, "m"], ["accuracy", 2, "mm"]]),
  product("distance-meter", "tavro", "TM-D80", 245, 205, 9, "2026-11-04", [["range", 80, "m"], ["accuracy", 1.5, "mm"]]),
];

export function getBrand(id: BrandId): Brand {
  return brands.find((b) => b.id === id)!;
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Display name, e.g. "Tavro TD-750 hammer drill". */
export function productName(p: Product, locale: Locale): string {
  return `${getBrand(p.brand).name} ${p.model} ${toolTypes[p.type].name[locale]}`;
}
