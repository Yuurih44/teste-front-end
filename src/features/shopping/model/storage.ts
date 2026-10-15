export interface SavedStore {
  cart: Record<string, number>;
  favorites: string[];
}
export function readStore(key: string): SavedStore {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) || "null");
    if (!data || typeof data !== "object") return { cart: {}, favorites: [] };
    const value = data as Record<string, unknown>;
    const cart: Record<string, number> = {};
    if (
      value.cart &&
      typeof value.cart === "object" &&
      !Array.isArray(value.cart)
    ) {
      for (const [name, quantity] of Object.entries(value.cart).slice(0, 500)) {
        if (
          name !== "__proto__" &&
          name.length < 500 &&
          typeof quantity === "number" &&
          Number.isInteger(quantity) &&
          quantity > 0 &&
          quantity <= 99
        )
          cart[name] = quantity;
      }
    }
    const favorites = Array.isArray(value.favorites)
      ? [
          ...new Set(
            value.favorites.filter(
              (name): name is string =>
                typeof name === "string" && name.length < 500,
            ),
          ),
        ].slice(0, 500)
      : [];
    return { cart, favorites };
  } catch {
    return { cart: {}, favorites: [] };
  }
}
