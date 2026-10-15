import AccountDialog from "../features/account/components/AccountDialog";
import SubscriptionDialog from "../features/account/components/SubscriptionDialog";
import {
  getDepartment,
  getDepartmentProducts,
  type DepartmentId,
} from "../features/catalog/model/departments";
import { searchProducts } from "../features/catalog/model/queries";
import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Hero from "../components/sections/Hero";
import { goToProducts } from "../utils/navigation";
import DepartmentTiles from "../components/sections/DepartmentTiles";
import Showcase from "../features/catalog/components/Showcase";
import Partners from "../components/sections/Partners";
import Brands from "../components/sections/Brands";
import Newsletter from "../components/sections/Newsletter";
import Footer from "../components/layout/Footer";
import InfoModal from "../components/ui/InfoModal";
import ProductModal from "../features/catalog/components/ProductModal";
import type { Product } from "../features/catalog/model/product";
import { useStore } from "../features/shopping/hooks/useStore";
import CartDialog from "../features/shopping/components/CartDialog";
import FavoritesDialog from "../features/shopping/components/FavoritesDialog";
export default function Storefront({
  departmentId,
  onDepartmentChange,
  products,
  loading,
  error,
  retry,
}: {
  departmentId: DepartmentId;
  onDepartmentChange: (id: DepartmentId) => void;
  products: Product[];
  loading: boolean;
  error: boolean;
  retry: () => void;
}) {
  const { addToCart } = useStore();
  const [panel, setPanel] = useState<
    "cart" | "favorites" | "account" | "subscription" | null
  >(null);
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const resetNavigation = () => {
      setSearchInput("");
      setQuery("");
      setSelected(null);
      setPanel(null);
      setInfo(null);
    };
    window.addEventListener("popstate", resetNavigation);
    return () => window.removeEventListener("popstate", resetNavigation);
  }, []);
  const department = getDepartment(departmentId);
  const departmentProducts = getDepartmentProducts(departmentId, products);
  const filtered = searchProducts(departmentProducts, query);
  function selectDepartment(id: DepartmentId) {
    setQuery("");
    setSearchInput("");
    setSelected(null);
    onDepartmentChange(id);
  }
  const showcaseProps = {
    products: departmentProducts,
    loading: departmentId === "tecnologia" && loading,
    error: departmentId === "tecnologia" && error,
    categories: department.categories,
    onRetry: retry,
    onSelect: setSelected,
  };
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header
        onDepartment={selectDepartment}
        query={searchInput}
        onQueryChange={setSearchInput}
        onCart={() => setPanel("cart")}
        onFavorites={() => setPanel("favorites")}
        onAccount={() => setPanel("account")}
        onSubscription={() => setPanel("subscription")}
        onInfo={setInfo}
        onSearch={(value) => {
          setQuery(value);
          setSearchInput(value);
          goToProducts();
        }}
      />
      <main id="conteudo">
        <Hero />
        <DepartmentTiles active={departmentId} onSelect={selectDepartment} />
        <Showcase
          key={`${departmentId}:${query}`}
          {...showcaseProps}
          products={filtered}
          query={query}
          id="produtos"
          withCategories
        />
        <Partners id="parceiros" />
        <Showcase
          key={`destaques:${departmentId}`}
          {...showcaseProps}
          id="destaques"
        />
        <Partners id="mais-parceiros" />
        <Brands />
        <Showcase
          key={`mais:${departmentId}`}
          {...showcaseProps}
          id="mais-produtos"
        />
        <Newsletter onTerms={() => setInfo("Termos e Condições")} />
      </main>
      <Footer onInfo={setInfo} />
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={(quantity) => addToCart(selected, quantity)}
          onViewCart={() => {
            setSelected(null);
            setPanel("cart");
          }}
        />
      )}
      {panel === "cart" && <CartDialog onClose={() => setPanel(null)} />}
      {panel === "favorites" && (
        <FavoritesDialog
          onClose={() => setPanel(null)}
          onSelect={(product) => {
            setPanel(null);
            setSelected(product);
          }}
        />
      )}
      {panel === "account" && <AccountDialog onClose={() => setPanel(null)} />}
      {panel === "subscription" && (
        <SubscriptionDialog onClose={() => setPanel(null)} />
      )}
      {info && <InfoModal title={info} onClose={() => setInfo(null)} />}
    </>
  );
}
