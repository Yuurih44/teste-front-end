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
  const mode =
    new URLSearchParams(window.location.search).get("catalog") === "assessment"
      ? "assessment"
      : "real";
  const [department, setDepartment] = useState(
    () =>
      getDepartment(
        new URLSearchParams(window.location.search).get("department"),
      ).id,
  );
  useEffect(() => {
    const syncDepartment = () =>
      setDepartment(
        getDepartment(
          new URLSearchParams(window.location.search).get("department"),
        ).id,
      );
    window.addEventListener("popstate", syncDepartment);
    return () => window.removeEventListener("popstate", syncDepartment);
  }, []);
  function changeDepartment(id: DepartmentId) {
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
      products={[...products, ...demoProducts]}
    >
      <Storefront
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
