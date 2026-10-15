import { useState } from "react";
import type { Product } from "../model/product";
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
