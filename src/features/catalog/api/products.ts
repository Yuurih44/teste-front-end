import type { Product, ProductReference, CatalogMode } from "../model/product";
const baseUrl = import.meta.env.BASE_URL;
export const PRODUCTS_URL = `${baseUrl}api/products`;
export async function getProducts(
  signal?: AbortSignal,
  mode: CatalogMode = "assessment",
): Promise<Product[]> {
  const response = await fetch(
    mode === "real" ? `${baseUrl}data/products-real.json` : PRODUCTS_URL,
    { signal },
  );
  if (!response.ok) throw new Error("Não foi possível carregar os produtos.");
  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("success" in data) ||
    data.success !== true ||
    !("products" in data) ||
    !Array.isArray(data.products)
  )
    throw new Error("Resposta de produtos inválida.");
  return data.products.map((product: unknown) => {
    if (!product || typeof product !== "object")
      throw new Error("Produto inválido.");
    const p = product as Record<string, unknown>;
    if (
      typeof p.productName !== "string" ||
      typeof p.descriptionShort !== "string" ||
      typeof p.photo !== "string" ||
      !/^(https?:\/\/|\/images\/)/.test(p.photo) ||
      typeof p.price !== "number" ||
      !Number.isFinite(p.price) ||
      p.price < 0
    )
      throw new Error("Produto inválido.");
    let reference: ProductReference | undefined;
    if (mode === "real") {
      const value = p.reference;
      if (!value || typeof value !== "object")
        throw new Error("Fonte do preço inválida.");
      const source = value as Record<string, unknown>;
      if (
        typeof source.url !== "string" ||
        !source.url.startsWith("https://www.trocafone.com.br/") ||
        typeof source.checkedAt !== "string" ||
        !Number.isFinite(Date.parse(source.checkedAt)) ||
        typeof source.available !== "boolean"
      )
        throw new Error("Fonte do preço inválida.");
      reference = {
        url: source.url,
        checkedAt: source.checkedAt,
        available: source.available,
      };
    }
    return {
      productName: p.productName,
      descriptionShort: p.descriptionShort,
      photo: p.photo,
      price: p.price,
      ...(reference ? { reference } : {}),
    };
  });
}
