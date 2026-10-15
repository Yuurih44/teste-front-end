import demoCatalog from "../data/departments.json";
import type { Product } from "./product";

export const departments = [
  {
    id: "tecnologia",
    title: "Tecnologia",
    categories: [
      "Celular",
      "Acessórios",
      "Tablets",
      "Notebooks",
      "TVs",
      "Ver todos",
    ],
  },
  {
    id: "supermercado",
    title: "Supermercado",
    categories: [
      "Mercado",
      "Frutas",
      "Carnes",
      "Laticínios",
      "Despensa",
      "Ver todos",
    ],
  },
  {
    id: "bebidas",
    title: "Bebidas",
    categories: [
      "Bebidas",
      "Água",
      "Sucos",
      "Cafés",
      "Refrigerantes",
      "Ver todos",
    ],
  },
  {
    id: "ferramentas",
    title: "Ferramentas",
    categories: [
      "Ferramentas",
      "Furadeiras",
      "Alicates",
      "Medição",
      "Manuais",
      "Ver todos",
    ],
  },
  {
    id: "saude",
    title: "Saúde",
    categories: [
      "Cuidados",
      "Rosto",
      "Corpo",
      "Higiene",
      "Hidratação",
      "Ver todos",
    ],
  },
  {
    id: "esportes",
    title: "Esportes e Fitness",
    categories: [
      "Esportes",
      "Futebol",
      "Basquete",
      "Tênis",
      "Vôlei",
      "Ver todos",
    ],
  },
  {
    id: "moda",
    title: "Moda",
    categories: [
      "Moda",
      "Camisas",
      "Vestidos",
      "Calçados",
      "Acessórios",
      "Ver todos",
    ],
  },
] as const;

export type DepartmentId = (typeof departments)[number]["id"];
export const demoProducts: Product[] = Object.values(demoCatalog).flat();

export function getDepartment(id: string | null) {
  return (
    departments.find((department) => department.id === id) ?? departments[0]
  );
}

export function getDepartmentProducts(
  id: DepartmentId,
  technology: Product[],
): Product[] {
  return id === "tecnologia" ? technology : demoCatalog[id];
}
