import { useState, type FormEvent } from "react";
export default function Newsletter({ onTerms }: { onTerms: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }
  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="container newsletter__inner">
        <div>
          <h2 id="newsletter-title">Inscreva-se na nossa newsletter</h2>
          <p>
            Assine a nossa newsletter e receba as novidades e conteúdos
            exclusivos
            <br className="desktop-break" /> da Econverse.
          </p>
        </div>
        <form onSubmit={submit} onChange={() => setSubmitted(false)}>
          <div className="newsletter__fields">
            <label>
              <span className="sr-only">Seu nome</span>
              <input
                name="name"
                autoComplete="given-name"
                placeholder="Digite seu nome"
                required
                minLength={2}
              />
            </label>
            <label>
              <span className="sr-only">Seu e-mail</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Digite seu e-mail"
                required
              />
            </label>
            <button className="yellow-button" type="submit">
              Inscrever
            </button>
          </div>
          <div className="newsletter__consent">
            <label>
              <input
                type="checkbox"
                aria-label="Aceito os termos e condições"
                required
                name="consent"
              />{" "}
              Aceito os{" "}
            </label>
            <button type="button" onClick={onTerms}>
              termos e condições
            </button>
          </div>
          {submitted && (
            <p role="status" className="newsletter__feedback">
              Cadastro demonstrativo validado. Nenhum dado foi enviado.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
