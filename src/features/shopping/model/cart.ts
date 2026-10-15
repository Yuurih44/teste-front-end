import type { Product } from "../../catalog/model/product";

export interface CartLine {
  product: Product;
  quantity: number;
}

export const MAX_CART_QUANTITY = 99;

export function normalizeQuantity(quantity: number): number {
  return Number.isFinite(quantity)
    ? Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(quantity)))
    : 1;
}

export function getSavedQuantity(
  cart: Record<string, number>,
  name: string,
): number {
  if (!Object.hasOwn(cart, name)) return 0;
  const quantity = cart[name];
  return Number.isInteger(quantity) &&
    quantity > 0 &&
    quantity <= MAX_CART_QUANTITY
    ? quantity
    : 0;
}

export function buildCart(
  products: Product[],
  quantities: Record<string, number>,
): CartLine[] {
  return products.flatMap((product) => {
    const quantity = getSavedQuantity(quantities, product.productName);
    return quantity ? [{ product, quantity }] : [];
  });
}

export function cartTotal(cart: CartLine[]): number {
  return (
    cart.reduce(
      (sum, line) => sum + Math.round(line.product.price * 100) * line.quantity,
      0,
    ) / 100
  );
}
