export default function QuantityControl({
  quantity,
  onChange,
  name,
}: {
  quantity: number;
  onChange: (value: number) => void;
  name?: string;
}) {
  return (
    <div
      className="quantity"
      role="group"
      aria-label={name ? `Quantidade de ${name}` : "Quantidade"}
    >
      <button
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= 1}
        aria-label={
          name ? `Diminuir quantidade de ${name}` : "Diminuir quantidade"
        }
      >
        −
      </button>
      <output aria-live="polite">{String(quantity).padStart(2, "0")}</output>
      <button
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= 99}
        aria-label={
          name ? `Aumentar quantidade de ${name}` : "Aumentar quantidade"
        }
      >
        +
      </button>
    </div>
  );
}
