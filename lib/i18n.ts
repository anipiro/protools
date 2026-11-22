import type { Locale, SpecKey, Unit } from "./types.ts";

export const locales: Locale[] = ["en", "ka"];

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "ka";
}

const en = {
  demoLabel: "Portfolio demo — not the real Protools shop",
  demoNote: "Brands, products and prices on this site are invented. Nothing here can be ordered.",
  skipToContent: "Skip to content",
  home: "Home",
  allTools: "All tools",
  categories: "Categories",
  brands: "Brands",
  language: "Language",
  searchLabel: "Search tools",
  searchPlaceholder: "Name or model code",
  searchButton: "Search",
  searchResultsFor: "Results for “{q}”",
  cart: "Cart",
  wishlist: "Wishlist",
  heroTitle: "Tools that earn their place on the wall.",
  heroText: "Take a category off the board, or go straight to a brand you already trust.",
  shopByBrand: "Shop by brand",
  onSaleNow: "On sale now",
  seeAllOnSale: "See everything on sale",
  productCountOne: "{n} product",
  productCountOther: "{n} products",
  filters: "Filters",
  showFilters: "Show filters",
  hideFilters: "Hide filters",
  availability: "Availability",
  inStockOnly: "In stock",
  onSaleOnly: "On sale",
  brand: "Brand",
  price: "Price",
  priceMin: "From, ₾",
  priceMax: "To, ₾",
  apply: "Apply price",
  clearFilters: "Clear filters",
  removeFilter: "Remove filter: {name}",
  sortBy: "Sort by",
  sortNewest: "Newest",
  sortPriceAsc: "Price, low to high",
  sortPriceDesc: "Price, high to low",
  sortName: "Name",
  emptyTitle: "Nothing matches these filters",
  emptyText: "Widen the price range or untick a brand to see more tools.",
  emptySearchText: "Check the spelling, or search by model code such as TD-750.",
  inStock: "In stock",
  outOfStock: "Out of stock",
  lowStock: "Only {n} left",
  sale: "Sale",
  model: "Model",
  specifications: "Specifications",
  quantity: "Quantity",
  decrease: "Decrease quantity",
  increase: "Increase quantity",
  addToCart: "Add to cart",
  addedToCart: "Added to cart",
  inCart: "{n} in your cart",
  viewCart: "View cart",
  addToWishlist: "Add to wishlist",
  removeFromWishlist: "Remove from wishlist",
  saved: "Saved to wishlist",
  remove: "Remove",
  cartTitle: "Your cart",
  cartEmptyTitle: "Your cart is empty",
  cartEmptyText: "Add a tool from any product page and it will wait here.",
  browseTools: "Browse tools",
  each: "{price} each",
  regularTotal: "Regular price",
  savings: "Sale savings",
  total: "Total",
  checkoutNote: "Checkout is not part of this demo.",
  wishlistTitle: "Your wishlist",
  wishlistEmptyTitle: "Your wishlist is empty",
  wishlistEmptyText: "Tap the heart on any tool to keep it here.",
  loading: "Loading…",
  notFoundTitle: "This page is not on the shelf",
  notFoundText: "The link may be old, or the product may have been removed.",
  moreFrom: "More in {name}",
};

export type Dictionary = { [K in keyof typeof en]: string };

const ka: Dictionary = {
  demoLabel: "პორტფოლიოს დემო — ეს არ არის Protools-ის ნამდვილი მაღაზია",
  demoNote: "ბრენდები, პროდუქტები და ფასები გამოგონილია. შეკვეთა შეუძლებელია.",
  skipToContent: "მთავარ შინაარსზე გადასვლა",
  home: "მთავარი",
  allTools: "ყველა ინსტრუმენტი",
  categories: "კატეგორიები",
  brands: "ბრენდები",
  language: "ენა",
  searchLabel: "ინსტრუმენტების ძებნა",
  searchPlaceholder: "სახელი ან მოდელის კოდი",
  searchButton: "ძებნა",
  searchResultsFor: "ძებნის შედეგები: „{q}“",
  cart: "კალათა",
  wishlist: "სურვილების სია",
  heroTitle: "პროფესიონალური ინსტრუმენტები.",
  heroText: "აირჩიეთ კატეგორია ან ბრენდი.",
  shopByBrand: "ბრენდის მიხედვით",
  onSaleNow: "ფასდაკლება",
  seeAllOnSale: "ყველა ფასდაკლებული პროდუქტი",
  productCountOne: "{n} პროდუქტი",
  productCountOther: "{n} პროდუქტი",
  filters: "ფილტრები",
  showFilters: "ფილტრების ჩვენება",
  hideFilters: "ფილტრების დამალვა",
  availability: "ხელმისაწვდომობა",
  inStockOnly: "მარაგშია",
  onSaleOnly: "ფასდაკლებით",
  brand: "ბრენდი",
  price: "ფასი",
  priceMin: "დან, ₾",
  priceMax: "მდე, ₾",
  apply: "ფასის გამოყენება",
  clearFilters: "ფილტრების გასუფთავება",
  removeFilter: "ფილტრის მოხსნა: {name}",
  sortBy: "დალაგება",
  sortNewest: "ახალი",
  sortPriceAsc: "ფასი: ზრდადობით",
  sortPriceDesc: "ფასი: კლებადობით",
  sortName: "სახელით",
  emptyTitle: "ამ ფილტრებით პროდუქტი ვერ მოიძებნა",
  emptyText: "გააფართოვეთ ფასის დიაპაზონი ან მოხსენით ბრენდი.",
  emptySearchText: "შეამოწმეთ მართლწერა ან მოძებნეთ მოდელის კოდით, მაგალითად TD-750.",
  inStock: "მარაგშია",
  outOfStock: "არ არის მარაგში",
  lowStock: "დარჩენილია {n} ცალი",
  sale: "ფასდაკლება",
  model: "მოდელი",
  specifications: "მახასიათებლები",
  quantity: "რაოდენობა",
  decrease: "რაოდენობის შემცირება",
  increase: "რაოდენობის გაზრდა",
  addToCart: "კალათაში დამატება",
  addedToCart: "დაემატა კალათაში",
  inCart: "კალათაშია: {n}",
  viewCart: "კალათის ნახვა",
  addToWishlist: "სურვილების სიაში დამატება",
  removeFromWishlist: "სურვილების სიიდან წაშლა",
  saved: "სურვილების სიაშია",
  remove: "წაშლა",
  cartTitle: "თქვენი კალათა",
  cartEmptyTitle: "კალათა ცარიელია",
  cartEmptyText: "დაამატეთ ინსტრუმენტი პროდუქტის გვერდიდან.",
  browseTools: "ინსტრუმენტების ნახვა",
  each: "ცალის ფასი: {price}",
  regularTotal: "ჩვეულებრივი ფასი",
  savings: "დანაზოგი",
  total: "სულ",
  checkoutNote: "შეკვეთის გაფორმება ამ დემოში არ არის.",
  wishlistTitle: "თქვენი სურვილების სია",
  wishlistEmptyTitle: "სურვილების სია ცარიელია",
  wishlistEmptyText: "დააჭირეთ გულს პროდუქტზე და ის აქ შეინახება.",
  loading: "იტვირთება…",
  notFoundTitle: "გვერდი ვერ მოიძებნა",
  notFoundText: "ბმული შეიძლება მოძველებული იყოს ან პროდუქტი წაშლილია.",
  moreFrom: "სხვა პროდუქტები: {name}",
};

const dictionaries: Record<Locale, Dictionary> = { en, ka };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Fills {placeholders} in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

export function productCount(t: Dictionary, n: number): string {
  return fill(n === 1 ? t.productCountOne : t.productCountOther, { n });
}

const specLabels: Record<SpecKey, Record<Locale, string>> = {
  power: { en: "Power", ka: "სიმძლავრე" },
  voltage: { en: "Voltage", ka: "ძაბვა" },
  weight: { en: "Weight", ka: "წონა" },
  disc: { en: "Disc diameter", ka: "დისკის დიამეტრი" },
  length: { en: "Length", ka: "სიგრძე" },
  pieces: { en: "Pieces in the set", ka: "რაოდენობა ნაკრებში" },
  compartments: { en: "Compartments", ka: "განყოფილებები" },
  drawers: { en: "Drawers", ka: "უჯრები" },
  capacity: { en: "Capacity", ka: "ტევადობა" },
  range: { en: "Range", ka: "მანძილი" },
  accuracy: { en: "Accuracy", ka: "სიზუსტე" },
};

const unitLabels: Record<Unit, Record<Locale, string>> = {
  W: { en: "W", ka: "ვტ" },
  V: { en: "V", ka: "ვ" },
  kg: { en: "kg", ka: "კგ" },
  mm: { en: "mm", ka: "მმ" },
  m: { en: "m", ka: "მ" },
  L: { en: "L", ka: "ლ" },
  "": { en: "", ka: "" },
};

export function specLabel(key: SpecKey, locale: Locale): string {
  return specLabels[key][locale];
}

export function specValue(value: number, unit: Unit, locale: Locale): string {
  const label = unitLabels[unit][locale];
  return label ? `${value} ${label}` : String(value);
}
