import { useState } from "react";
import { useStore } from "../hooks/useStore";
import { money } from "../../../utils/currency";
import Dialog from "../../../components/ui/Dialog";
import ProductImage from "../../catalog/components/ProductImage";
import QuantityControl from "../../../components/ui/QuantityControl";
import Icon from "../../../components/ui/Icon";
export default function CartDialog({ onClose }: { onClose: () => void }) {
  const { cart, total, cartCount, setQuantity, removeFromCart, clearCart } =
    useStore();
  const [checkout, setCheckout] = useState(false);
  return (
    <Dialog
      className="shopping-dialog"
      titleId="cart-title"
      closeLabel="Fechar carrinho"
      onClose={onClose}
    >
      <div className="shopping-dialog__heading">
        <Icon name="cart" size={28} />
        <div>
          <h2 id="cart-title">Meu carrinho</h2>
          <p>
            {cartCount} {cartCount === 1 ? "item" : "itens"} no carrinho
          </p>
        </div>
      </div>
      {cart.length === 0 ? (
        <div className="shopping-empty">
          <Icon name="cart" size={48} />
          <h3>Seu carrinho está vazio</h3>
          <p>Escolha seus produtos favoritos e adicione ao carrinho.</p>
          <button className="primary-button" onClick={onClose}>
            Explorar produtos
          </button>
        </div>
      ) : (
        <>
          <ul className="shopping-list">
            {cart.map(({ product, quantity }) => (
              <li key={product.productName}>
                <div className="shopping-list__image">
                  <ProductImage product={product} />
                </div>
                <div className="shopping-list__content">
                  <h3>{product.productName}</h3>
                  <p>{money(product.price)} por unidade</p>
                  <QuantityControl
                    quantity={quantity}
                    name={product.productName}
                    onChange={(value) => {
                      setQuantity(product, value);
                      setCheckout(false);
                    }}
                  />
                  <button
                    className="text-button remove-button"
                    onClick={() => {
                      removeFromCart(product);
                      setCheckout(false);
                    }}
                    aria-label={`Remover ${product.productName} do carrinho`}
                  >
                    Remover
                  </button>
                </div>
                <strong>
                  {money((Math.round(product.price * 100) * quantity) / 100)}
                </strong>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <span>Subtotal</span>
            <strong>{money(total)}</strong>
          </div>
          <p className="cart-disclaimer">
            Compra demonstrativa. Nenhum pagamento será solicitado.
          </p>
          <button className="primary-button" onClick={() => setCheckout(true)}>
            Conferir pedido
          </button>
          {checkout && (
            <div className="checkout-feedback" role="status">
              <strong>Seu pedido está pronto para conferência.</strong>
              <p>
                {cartCount} {cartCount === 1 ? "item" : "itens"} · Total{" "}
                {money(total)}. Esta demonstração termina aqui, sem cobrança ou
                envio do pedido.
              </p>
            </div>
          )}
          <button
            className="text-button clear-cart"
            onClick={() => {
              clearCart();
              setCheckout(false);
            }}
          >
            Esvaziar carrinho
          </button>
        </>
      )}
    </Dialog>
  );
}
