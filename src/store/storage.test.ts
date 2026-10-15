import { test, expect } from "vitest";
import { readStore } from "./storage";
test("recupera armazenamento inválido sem travar a loja", () => {
  localStorage.setItem("store", "{quebrado");
  expect(readStore("store")).toEqual({ cart: {}, favorites: [] });
});
test("não restaura quantidades inválidas nem favoritos duplicados", () => {
  localStorage.setItem(
    "store",
    JSON.stringify({
      cart: { A: 2, B: -1, C: NaN, D: 100, E: "3" },
      favorites: ["A", "A", 1, "B"],
    }),
  );
  expect(readStore("store")).toEqual({ cart: { A: 2 }, favorites: ["A", "B"] });
});
