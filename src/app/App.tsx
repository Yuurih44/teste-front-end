import { useEffect, useState } from "react";
import {
  demoProducts,
  getDepartment,
  type DepartmentId,
} from "../features/catalog/model/departments";
import { useProducts } from "../features/catalog/hooks/useProducts";
import StoreProvider from "../features/shopping/context/StoreProvider";
import Storefront from "./Storefront";
export default function App() {
  const params = new URLSearchParams(window.location.search);
  const expanded = params.get("versao") !== "teste";
  const mode =
    expanded && params.get("catalog") === "real" ? "real" : "assessment";
  const [department, setDepartment] = useState(
    () =>
      expanded
        ? getDepartment(params.get("department")).id
        : "tecnologia",
  );
  useEffect(() => {
    const syncDepartment = () => {
      const current = new URLSearchParams(window.location.search);
      setDepartment(
        current.get("versao") === "teste"
          ? "tecnologia"
          : getDepartment(current.get("department")).id,
      );
    };
    window.addEventListener("popstate", syncDepartment);
    return () => window.removeEventListener("popstate", syncDepartment);
  }, []);
  function changeDepartment(id: DepartmentId) {
    if (!expanded && id !== "tecnologia") return;
    const url = new URL(window.location.href);
    if (id === "tecnologia") url.searchParams.delete("department");
    else url.searchParams.set("department", id);
    if (url.href !== window.location.href)
      window.history.pushState(null, "", url);
    setDepartment(id);
  }
  const { products, loading, error, retry } = useProducts(mode);
  return (
    <StoreProvider
      key={mode}
      mode={mode}
      products={expanded ? [...products, ...demoProducts] : products}
    >
      <Storefront
        expanded={expanded}
        departmentId={department}
        onDepartmentChange={changeDepartment}
        products={products}
        loading={loading}
        error={error}
        retry={retry}
      />
    </StoreProvider>
  );
}
