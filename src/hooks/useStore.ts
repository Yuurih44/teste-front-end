import { useContext } from "react";
import { StoreContext } from "../store/StoreContext";
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("StoreProvider ausente.");
  return store;
}
