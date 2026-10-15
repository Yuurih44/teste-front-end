import { useState } from "react";
import type { Product } from "../services/products";
export default function ProductImage({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="image-fallback">Imagem indisponível</span>
  ) : (
    <img
      src={product.photo}
      alt={product.productName}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
