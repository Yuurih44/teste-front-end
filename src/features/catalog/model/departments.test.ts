import { expect, test } from "vitest";
import {
  departments,
  demoProducts,
  getDepartment,
  getDepartmentProducts,
} from "./departments";

test("endereço desconhecido volta para Tecnologia e mantém o catálogo original", () => {
  expect(getDepartment("inexistente").id).toBe("tecnologia");
  expect(getDepartment(null).id).toBe("tecnologia");
  const products = [
    {
      productName: "Original",
      descriptionShort: "",
      photo: "/images/a.png",
      price: 9000,
    },
  ];
  expect(getDepartmentProducts("tecnologia", products)).toBe(products);
});

test("departamentos têm seis filtros e produtos locais com identidades distintas", () => {
  expect(new Set(demoProducts.map((product) => product.productName)).size).toBe(
    demoProducts.length,
  );
  for (const department of departments) {
    expect(department.categories).toHaveLength(6);
    if (department.id === "tecnologia") continue;
    const products = getDepartmentProducts(department.id, []);
    expect(products.length).toBeGreaterThanOrEqual(4);
    for (const product of products) {
      expect(product.demonstration).toBe(true);
      expect(product.photo).toMatch(/^\/images\/catalog\//);
      expect(department.categories).toContain(product.category);
      expect(product.price).toBeGreaterThan(0);
    }
  }
});
