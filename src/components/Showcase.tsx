import ProductSkeleton from "./ProductSkeleton";
import { useCarousel } from "../hooks/useCarousel";
import { useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "../services/products";
const categories = [
  "Celular",
  "Acessórios",
  "Tablets",
  "Notebooks",
  "TVs",
  "Ver todos",
];
interface Props {
  id: string;
  products: Product[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onSelect: (product: Product) => void;
  withCategories?: boolean;
  query?: string;
}
export default function Showcase({
  id,
  products,
  loading,
  error,
  onRetry,
  onSelect,
  withCategories = false,
  query = "",
}: Props) {
  const [category, setCategory] = useState("Celular");
  const [sort, setSort] = useState("relevance");
  const filtered =
    category === "Celular" || category === "Ver todos" ? products : [];
  const visible = [...filtered].sort((a, b) =>
    sort === "price-asc"
      ? a.price - b.price
      : sort === "price-desc"
        ? b.price - a.price
        : sort === "name"
          ? a.productName.localeCompare(b.productName, "pt-BR", {
              numeric: true,
            })
          : 0,
  );
  const { track, canScroll, scroll } = useCarousel(visible.length);
  return (
    <section
      className="showcase container"
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <h2 className="section-title" id={`${id}-title`}>
        <span>Produtos relacionados</span>
      </h2>
      {withCategories ? (
        <nav className="categories" aria-label="Categorias de produtos">
          {categories.map((item) => (
            <button
              key={item}
              aria-pressed={category === item}
              className={category === item ? "active" : ""}
              onClick={() => {
                setCategory(item);
                track.current?.scrollTo({ left: 0 });
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      ) : (
        <button
          className="see-all"
          onClick={() => {
            setCategory("Ver todos");
            track.current?.scrollTo({ left: 0 });
          }}
        >
          Ver todos
        </button>
      )}
      {withCategories && query && !loading && !error && (
        <div className="catalog-toolbar">
          <p aria-live="polite">
            {visible.length} {visible.length === 1 ? "produto" : "produtos"}
            {query ? ` para “${query}”` : ""}
          </p>
          <label htmlFor={`${id}-sort`}>
            Ordenar por{" "}
            <select
              id={`${id}-sort`}
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                track.current?.scrollTo({ left: 0 });
              }}
            >
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">Nome</option>
            </select>
          </label>
        </div>
      )}
      {loading ? (
        <ProductSkeleton />
      ) : error ? (
        <div className="state" role="alert">
          <p>
            Não foi possível carregar os produtos. Verifique sua conexão e tente
            novamente.
          </p>
          <button className="primary-button" onClick={onRetry}>
            Tentar novamente
          </button>
        </div>
      ) : visible.length === 0 ? (
        <p className="state" role="status">
          {query
            ? "Nenhum produto encontrado para esta busca."
            : "Nenhum produto disponível nesta categoria."}
        </p>
      ) : (
        <div className="carousel" aria-label="Vitrine de produtos">
          <button
            className="carousel__arrow carousel__arrow--previous"
            onClick={() => scroll(-1)}
            aria-label="Produtos anteriores"
            disabled={!canScroll.previous}
          >
            ‹
          </button>
          <ul
            className="product-list"
            ref={track}
            tabIndex={0}
            aria-label="Produtos — use as setas para navegar"
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return;
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                scroll(event.key === "ArrowLeft" ? -1 : 1);
              }
            }}
          >
            {visible.map((product, index) => (
              <li key={`${product.productName}-${index}`}>
                <ProductCard product={product} onSelect={onSelect} />
              </li>
            ))}
          </ul>
          <button
            className="carousel__arrow carousel__arrow--next"
            onClick={() => scroll(1)}
            aria-label="Próximos produtos"
            disabled={!canScroll.next}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
