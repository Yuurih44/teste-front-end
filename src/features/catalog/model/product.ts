export type CatalogMode = "assessment" | "real";
export interface ProductReference {
  url: string;
  checkedAt: string;
  available: boolean;
}
export interface Product {
  productName: string;
  descriptionShort: string;
  photo: string;
  price: number;
  reference?: ProductReference;
}
