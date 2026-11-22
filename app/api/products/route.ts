// Mock catalogue API. Reads the local sample data; there is no database behind it.
//
// GET /api/products?category=saws&brand=tavro,hexmoor&stock=1&sale=1&min=100&max=400&sort=price-asc&q=td-750
// GET /api/products?ids=tavro-td-750,norvane-nv-t8

import { parseQuery, queryCatalog } from "@/lib/catalog";
import { getCategory, productName, products } from "@/lib/catalog-data";
import { isLocale } from "@/lib/i18n";
import { toView } from "@/lib/view";

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const localeParam = params.get("locale") ?? "en";
  const locale = isLocale(localeParam) ? localeParam : "en";

  const ids = params.get("ids");
  if (ids !== null) {
    const wanted = new Set(ids.split(",").slice(0, 100));
    const items = products.filter((p) => wanted.has(p.id)).map((p) => toView(p, locale));
    return Response.json({ items, total: items.length });
  }

  const category = params.get("category");
  if (category !== null && !getCategory(category)) {
    return Response.json({ error: "Unknown category" }, { status: 404 });
  }
  const list = category ? products.filter((p) => p.category === category) : products;
  const query = parseQuery({
    q: params.get("q") ?? undefined,
    brand: params.getAll("brand"),
    stock: params.get("stock") ?? undefined,
    sale: params.get("sale") ?? undefined,
    min: params.get("min") ?? undefined,
    max: params.get("max") ?? undefined,
    sort: params.get("sort") ?? undefined,
  });
  const result = queryCatalog(list, query, (p) => productName(p, locale));
  return Response.json({ ...result, items: result.items.map((p) => toView(p, locale)) });
}
