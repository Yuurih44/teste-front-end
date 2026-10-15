import type { Product } from "./product";

export type ProductSort = "relevance" | "price-asc" | "price-desc" | "name";

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function searchProducts(products: Product[], query: string): Product[] {
  const term = normalizeSearch(query);
  if (!term) return products;
  return products.filter((product) =>
    normalizeSearch(
      `${product.productName} ${product.descriptionShort}`,
    ).includes(term),
  );
}

export function sortProducts(
  products: Product[],
  sort: ProductSort,
): Product[] {
  if (sort === "relevance") return products;
  return [...products].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name":
        return a.productName.localeCompare(b.productName, "pt-BR", {
          numeric: true,
        });
    }
  });
}
