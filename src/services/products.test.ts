import { test, expect, vi } from "vitest";
import { getProducts } from "./products";
test.each([
  { success: false, products: [] },
  {
    success: true,
    products: [
      {
        productName: "Produto",
        descriptionShort: "",
        photo: "javascript:alert(1)",
        price: 10,
      },
    ],
  },
  {
    success: true,
    products: [
      {
        productName: "Produto",
        descriptionShort: "",
        photo: "https://example.com/a.png",
        price: -1,
      },
    ],
  },
])("rejeita contrato inválido: %j", async (data) => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => data })),
  );
  await expect(getProducts()).rejects.toThrow();
});

test("não altera preços nem fotos retornados pela API da empresa", async () => {
  const product = {
    productName: "IPHONE 13 MINI 1",
    descriptionShort: "Descrição original",
    photo: "https://example.com/foto.png",
    price: 9000,
  };
  const fetch = vi.fn(async () => ({
    ok: true,
    json: async () => ({ success: true, products: [product] }),
  }));
  vi.stubGlobal("fetch", fetch);
  expect(await getProducts()).toEqual([product]);
  expect(fetch).toHaveBeenCalledWith("/api/products", { signal: undefined });
});

test("catálogo real exige fonte verificável e data válida", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({
        success: true,
        products: [
          {
            productName: "Modelo",
            descriptionShort: "Seminovo",
            photo: "/images/phones/1.webp",
            price: 1500,
            reference: {
              url: "javascript:alert(1)",
              checkedAt: "ontem",
              available: true,
            },
          },
        ],
      }),
    })),
  );
  await expect(getProducts(undefined, "real")).rejects.toThrow(
    "Fonte do preço inválida",
  );
});
