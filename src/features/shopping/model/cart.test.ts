import { expect, test } from "vitest";
import {
  buildCart,
  cartTotal,
  getSavedQuantity,
  normalizeQuantity,
} from "./cart";
import type { Product } from "../../catalog/model/product";
const product: Product = {
  productName: "Celular",
  descriptionShort: "",
  photo: "/images/a.png",
  price: 0.1,
};

test("nomes herdados do objeto não criam itens fantasmas no carrinho", () => {
  expect(getSavedQuantity({}, "constructor")).toBe(0);
  expect(buildCart([{ ...product, productName: "toString" }], {})).toEqual([]);
  expect(
    buildCart([{ ...product, productName: "constructor" }], { constructor: 2 }),
  ).toEqual([
    { product: { ...product, productName: "constructor" }, quantity: 2 },
  ]);
});

test("ignora produtos antigos e calcula o total em centavos", () => {
  const cart = buildCart([product], { Celular: 3, Removido: 5 });
  expect(cart).toHaveLength(1);
  expect(cartTotal(cart)).toBe(0.3);
});

test.each([
  [0, 1],
  [-3, 1],
  [2.8, 2],
  [100, 99],
  [NaN, 1],
  [Infinity, 1],
])("normaliza quantidade %s para %s", (quantity, expected) => {
  expect(normalizeQuantity(quantity)).toBe(expected);
});
