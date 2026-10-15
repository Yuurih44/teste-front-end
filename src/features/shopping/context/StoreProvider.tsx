import {
  buildCart,
  cartTotal,
  getSavedQuantity,
  normalizeQuantity,
} from "../model/cart";
import { useEffect, useState, type ReactNode } from "react";
import type { Product, CatalogMode } from "../../catalog/model/product";
import { StoreContext } from "./StoreContext";
import { readStore } from "../model/storage";
export default function StoreProvider({
  children,
  products,
  mode,
}: {
  children: ReactNode;
  products: Product[];
  mode: CatalogMode;
}) {
  const key = `econverse:store:${mode}:v1`;
  const [saved, setSaved] = useState(() => readStore(key));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(saved));
    } catch {
      /* A loja continua funcionando em memória quando o armazenamento não está disponível. */
    }
  }, [key, saved]);
  const cart = buildCart(products, saved.cart);
  const favorites = products.filter((product) =>
    saved.favorites.includes(product.productName),
  );
  return (
    <StoreContext.Provider
      value={{
        cart,
        favorites,
        cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
        total: cartTotal(cart),
        isFavorite: (product) => saved.favorites.includes(product.productName),
        toggleFavorite: (product) =>
          setSaved((previous) => ({
            ...previous,
            favorites: previous.favorites.includes(product.productName)
              ? previous.favorites.filter(
                  (name) => name !== product.productName,
                )
              : [...previous.favorites, product.productName],
          })),
        addToCart: (product, quantity) =>
          setSaved((previous) => ({
            ...previous,
            cart: {
              ...previous.cart,
              [product.productName]: normalizeQuantity(
                getSavedQuantity(previous.cart, product.productName) +
                  normalizeQuantity(quantity),
              ),
            },
          })),
        setQuantity: (product, quantity) =>
          setSaved((previous) => ({
            ...previous,
            cart: {
              ...previous.cart,
              [product.productName]: normalizeQuantity(quantity),
            },
          })),
        removeFromCart: (product) =>
          setSaved((previous) => ({
            ...previous,
            cart: Object.fromEntries(
              Object.entries(previous.cart).filter(
                ([name]) => name !== product.productName,
              ),
            ),
          })),
        clearCart: () => setSaved((previous) => ({ ...previous, cart: {} })),
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
