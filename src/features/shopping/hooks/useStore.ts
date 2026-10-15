import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("StoreProvider ausente.");
  return store;
}
