import Logo from "../ui/Logo";
import { goToProducts } from "../../utils/navigation";
export default function Brands() {
  return (
    <section className="brands container" aria-labelledby="brands-title">
      <h2 id="brands-title">Navegue por marcas</h2>
      <ul>
        {[1, 2, 3, 4, 5].map((number) => (
          <li key={number}>
            <button
              onClick={goToProducts}
              aria-label={`Ver produtos da Econverse ${number}`}
            >
              <Logo />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
