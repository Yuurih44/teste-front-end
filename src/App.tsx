import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { goToProducts } from "./utils/navigation";
import { useProducts } from "./hooks/useProducts";
import DepartmentTiles from "./components/DepartmentTiles";
import Showcase from "./components/Showcase";
import Partners from "./components/Partners";
import Brands from "./components/Brands";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import InfoModal from "./components/InfoModal";
import ProductModal from "./components/ProductModal";
import { type Product } from "./services/products";
import StoreProvider from "./store/StoreProvider";
import { useStore } from "./hooks/useStore";
import CartDialog from "./components/CartDialog";
import FavoritesDialog from "./components/FavoritesDialog";
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
function Storefront({
  products,
  loading,
  error,
  retry,
}: {
  products: Product[];
  loading: boolean;
  error: boolean;
  retry: () => void;
}) {
  const { addToCart } = useStore();
  const [panel, setPanel] = useState<"cart" | "favorites" | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  const filtered = products.filter((product) =>
    normalize(product.productName + " " + product.descriptionShort).includes(
      normalize(query),
    ),
  );
  const showcaseProps = {
    products,
    loading,
    error,
    onRetry: retry,
    onSelect: setSelected,
  };
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header
        query={searchInput}
        onQueryChange={setSearchInput}
        onCart={() => setPanel("cart")}
        onFavorites={() => setPanel("favorites")}
        onInfo={setInfo}
        onSearch={(value) => {
          setQuery(value);
          setSearchInput(value);
          goToProducts();
        }}
      />
      <main id="conteudo">
        <Hero />
        <DepartmentTiles onInfo={setInfo} />
        <Showcase
          key={query}
          {...showcaseProps}
          products={filtered}
          query={query}
          id="produtos"
          withCategories
        />
        <Partners id="parceiros" />
        <Showcase {...showcaseProps} id="destaques" />
        <Partners id="mais-parceiros" />
        <Brands />
        <Showcase {...showcaseProps} id="mais-produtos" />
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
      {info && <InfoModal title={info} onClose={() => setInfo(null)} />}
    </>
  );
}
