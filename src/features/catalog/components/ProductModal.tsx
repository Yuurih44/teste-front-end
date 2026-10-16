import { useStore } from "../../shopping/hooks/useStore";
import QuantityControl from "../../../components/ui/QuantityControl";
import Dialog from "../../../components/ui/Dialog";
import { useState } from "react";
import { money } from "../../../utils/currency";
import type { Product } from "../model/product";
import ProductImage from "./ProductImage";
export default function ProductModal({
  expanded,
  product,
  onClose,
  onAdd,
  onViewCart,
}: {
  expanded: boolean;
  product: Product;
  onClose: () => void;
  onAdd: (quantity: number) => void;
  onViewCart: () => void;
}) {
  const { cart, isFavorite, toggleFavorite } = useStore();
  const cartQuantity =
    cart.find((line) => line.product.productName === product.productName)
      ?.quantity || 0;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [details, setDetails] = useState(false);
  return (
    <Dialog
      className={`product-modal${product.reference ? " product-modal--reference" : ""}`}
      titleId="product-title"
      closeLabel="Fechar detalhes do produto"
      onClose={onClose}
    >
      <div className="product-modal__image">
        <ProductImage product={product} />
      </div>
      <div className="product-modal__content">
        <h2 id="product-title">{product.productName}</h2>
        <strong className="product-modal__price">{money(product.price)}</strong>
        <p>{product.descriptionShort}</p>
        <button
          className="details-link"
          aria-expanded={details}
          onClick={() => setDetails((value) => !value)}
        >
          Veja mais detalhes do produto &gt;
        </button>
        {details && (
          <div className="extra-details">
            {expanded && (
              <button
                className="text-button"
                aria-pressed={isFavorite(product)}
                onClick={() => toggleFavorite(product)}
              >
                {isFavorite(product)
                  ? "Remover dos favoritos"
                  : "Salvar nos favoritos"}
              </button>
            )}
            <p className="installments">
              ou 2x de {money(product.price / 2)} sem juros
            </p>
            {product.reference ? (
              <p>Frete a consultar.</p>
            ) : (
              <p className="free-shipping">Frete grátis</p>
            )}
          </div>
        )}
        {expanded && product.reference && (
          <div className="product-source">
            <p>
              Consulta:{" "}
              {new Date(product.reference.checkedAt).toLocaleDateString(
                "pt-BR",
              )}{" "}
              ·{" "}
              {product.reference.available
                ? "Com estoque na consulta"
                : "Sem estoque na consulta"}
            </p>
          </div>
        )}
        <div className="product-modal__actions">
          <QuantityControl
            quantity={quantity}
            onChange={(value) => {
              setQuantity(value);
              setAdded(false);
            }}
          />
          <button
            className="yellow-button"
            onClick={() => {
              onAdd(quantity);
              setAdded(true);
            }}
          >
            Comprar
          </button>
        </div>
        <p className="purchase-feedback" role="status">
          {added
            ? `${cartQuantity} ${cartQuantity === 1 ? "unidade no carrinho" : "unidades no carrinho"}. Total: ${money((Math.round(product.price * 100) * cartQuantity) / 100)}. Compra demonstrativa, sem cobrança.`
            : ""}
        </p>
        {expanded && added && (
          <button className="text-button view-cart" onClick={onViewCart}>
            Ver meu carrinho →
          </button>
        )}
      </div>
    </Dialog>
  );
}
