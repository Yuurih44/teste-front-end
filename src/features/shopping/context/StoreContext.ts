import { createContext } from "react";
import type { Product } from "../../catalog/model/product";
import type { CartLine } from "../model/cart";
export interface StoreValue {
  cart: CartLine[];
  favorites: Product[];
  cartCount: number;
  total: number;
  isFavorite: (product: Product) => boolean;
  toggleFavorite: (product: Product) => void;
  addToCart: (product: Product, quantity: number) => void;
  setQuantity: (product: Product, quantity: number) => void;
  removeFromCart: (product: Product) => void;
  clearCart: () => void;
}
export const StoreContext = createContext<StoreValue | null>(null);
