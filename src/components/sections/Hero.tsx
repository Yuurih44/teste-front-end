import { goToProducts } from "../../utils/navigation";
export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__content">
        <h1 id="hero-title">
          Venha conhecer nossas
          <br className="desktop-break" /> promoções
        </h1>
        <p>
          <strong>50% Off</strong> nos produtos
        </p>
        <button className="yellow-button" onClick={goToProducts}>
          Ver produto
        </button>
      </div>
    </section>
  );
}
