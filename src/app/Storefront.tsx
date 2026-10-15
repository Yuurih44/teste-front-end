import { searchProducts } from "../features/catalog/model/queries";
import { useState } from "react";
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
  const filtered = searchProducts(products, query);
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
