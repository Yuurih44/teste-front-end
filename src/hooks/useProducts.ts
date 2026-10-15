import { useCallback, useEffect, useState } from "react";
import {
  getProducts,
  type Product,
  type CatalogMode,
} from "../services/products";
type Status = "loading" | "success" | "error";
export function useProducts(mode: CatalogMode = "assessment") {
  const [catalog, setCatalog] = useState<{
    products: Product[];
    status: Status;
  }>({ products: [], status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => {
    setCatalog((previous) => ({ ...previous, status: "loading" }));
    setAttempt((previous) => previous + 1);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    getProducts(controller.signal, mode)
      .then((products) => {
        if (!controller.signal.aborted)
          setCatalog({ products, status: "success" });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setCatalog({ products: [], status: "error" });
      });
    return () => controller.abort();
  }, [attempt, mode]);
  return {
    products: catalog.products,
    loading: catalog.status === "loading",
    error: catalog.status === "error",
    retry,
  };
}
