import { useProducts } from "../features/catalog/hooks/useProducts";
import StoreProvider from "../features/shopping/context/StoreProvider";
import Storefront from "./Storefront";
export default function App() {
  const mode =
    new URLSearchParams(window.location.search).get("catalog") === "real"
      ? "real"
      : "assessment";
  const { products, loading, error, retry } = useProducts(mode);
  return (
    <StoreProvider key={mode} mode={mode} products={products}>
      <Storefront
        products={products}
        loading={loading}
        error={error}
        retry={retry}
      />
    </StoreProvider>
  );
}
