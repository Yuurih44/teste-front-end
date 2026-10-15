import { useStore } from "../hooks/useStore";
import { money, type Product } from "../services/products";
import Dialog from "./Dialog";
import ProductImage from "./ProductImage";
import Icon from "./Icon";
export default function FavoritesDialog({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (product: Product) => void;
}) {
  const { favorites, toggleFavorite } = useStore();
  return (
    <Dialog
      className="shopping-dialog"
      titleId="favorites-title"
      closeLabel="Fechar favoritos"
      onClose={onClose}
    >
      <div className="shopping-dialog__heading">
        <Icon name="heart" size={28} />
        <div>
          <h2 id="favorites-title">Meus favoritos</h2>
          <p>Seus produtos salvos para depois</p>
        </div>
      </div>
      {favorites.length === 0 ? (
        <div className="shopping-empty">
          <Icon name="heart" size={48} />
          <h3>Sua lista começa com um favorito</h3>
          <p>
            Abra um produto e use “Veja mais detalhes” para salvá-lo nos
            favoritos.
          </p>
          <button className="primary-button" onClick={onClose}>
            Encontrar produtos
          </button>
        </div>
      ) : (
        <ul className="shopping-list">
          {favorites.map((product) => (
            <li key={product.productName}>
              <div className="shopping-list__image">
                <ProductImage product={product} />
              </div>
              <div className="shopping-list__content">
                <h3>{product.productName}</h3>
                <strong>{money(product.price)}</strong>
                <div className="favorite-actions">
                  <button
                    className="primary-button"
                    onClick={() => onSelect(product)}
                  >
                    Ver produto
                    <span className="sr-only"> {product.productName}</span>
                  </button>
                  <button
                    className="text-button"
                    aria-label={`Remover ${product.productName} dos favoritos`}
                    onClick={() => toggleFavorite(product)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}
