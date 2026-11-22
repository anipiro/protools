// Mock product API: GET /api/products/tavro-td-750?locale=ka

import { getProduct } from "@/lib/catalog-data";
import { isLocale } from "@/lib/i18n";
import { toView } from "@/lib/view";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return Response.json({ error: "Product not found" }, { status: 404 });
  const localeParam = new URL(request.url).searchParams.get("locale") ?? "en";
  return Response.json(toView(product, isLocale(localeParam) ? localeParam : "en"));
}
