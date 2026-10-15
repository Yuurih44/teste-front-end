import { expect, test } from "vitest";
import { searchProducts, sortProducts } from "./queries";
import type { Product } from "./product";
const products: Product[] = [
  {
    productName: "Celular 10",
    descriptionShort: "Edição prateada",
    photo: "/images/a.png",
    price: 20,
  },
  {
    productName: "Celular 2",
    descriptionShort: "Modelo azul",
    photo: "/images/b.png",
    price: 10,
  },
];

test("busca ignora acentos, caixa e espaços nas extremidades", () => {
  expect(searchProducts(products, "  EDICAO  ")).toEqual([products[0]]);
  expect(searchProducts(products, "   ")).toEqual(products);
  expect(searchProducts(products, "inexistente")).toEqual([]);
});

test("ordenação não modifica a sequência original do catálogo", () => {
  const original = [...products];
  expect(sortProducts(products, "price-asc")).toEqual([
    products[1],
    products[0],
  ]);
  expect(sortProducts(products, "price-desc")).toEqual(original);
  expect(sortProducts(products, "name")).toEqual([products[1], products[0]]);
  expect(sortProducts(products, "relevance")).toEqual(original);
  expect(products).toEqual(original);
});
