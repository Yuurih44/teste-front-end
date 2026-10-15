import { goToProducts } from "../../utils/navigation";
export default function Partners({ id }: { id: string }) {
  return (
    <section className="partners container" aria-label="Parceiros" id={id}>
      {[1, 2].map((number) => (
        <article className="partner-card" key={number}>
          <div>
            <h2>Parceiros</h2>
            <p>
              Encontre tudo o que precisa
              <br /> em um só lugar.
            </p>
            <button className="yellow-button" onClick={goToProducts}>
              Confira
              <span className="sr-only"> produtos do parceiro {number}</span>
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
