import { useStore } from "../../shopping/hooks/useStore";
import Icon from "../../../components/ui/Icon";
import { money } from "../../../utils/currency";
import type { Product } from "../model/product";
import ProductImage from "./ProductImage";
export default function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  const { cart, isFavorite, toggleFavorite, addToCart } = useStore();
  const added = cart.some(
    (line) => line.product.productName === product.productName,
  );
  const favorite = isFavorite(product);
  return (
    <article className="product-card">
      <button
        className={`favorite-button${favorite ? " is-favorite" : ""}`}
        aria-label={`${favorite ? "Remover" : "Adicionar"} ${product.productName} ${favorite ? "dos" : "aos"} favoritos`}
        aria-pressed={favorite}
        onClick={() => toggleFavorite(product)}
      >
        <Icon name="heart" size={21} />
      </button>
      <h3 className="product-card__heading">
        <button
          className="product-card__details"
          onClick={() => onSelect(product)}
          aria-label={`Ver detalhes de ${product.productName}`}
        >
          <span className="product-card__image">
            <ProductImage product={product} />
          </span>
          <span>{product.productName}</span>
        </button>
      </h3>
      <div className="product-card__pricing">
        <strong>{money(product.price)}</strong>
        <p>ou 2x de {money(product.price / 2)} sem juros</p>
        {product.reference ? (
          <p className="reference-caption">Preço consultado · Seminovo</p>
        ) : (
          <p className="free-shipping">
            {product.demonstration ? "Preço demonstrativo" : "Frete grátis"}
          </p>
        )}
      </div>
      {product.reference ? (
        <>
          <button
            className="primary-button quick-add"
            aria-label={`Adicionar ${product.productName} ao carrinho`}
            onClick={() => {
              addToCart(product, 1);
            }}
          >
            <Icon name="cart" size={18} />
            Adicionar ao carrinho
          </button>
          <p className="card-feedback" role="status">
            {added ? "Produto no carrinho ✓" : ""}
          </p>
        </>
      ) : (
        <button className="primary-button" onClick={() => onSelect(product)}>
          Comprar<span className="sr-only"> {product.productName}</span>
        </button>
      )}
    </article>
  );
}
