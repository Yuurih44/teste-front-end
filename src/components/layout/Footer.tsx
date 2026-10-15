import Logo from "../ui/Logo";
import Icon, { type IconName } from "../ui/Icon";
const columns = [
  {
    title: "Institucional",
    links: ["Sobre Nós", "Movimento", "Trabalhe conosco"],
  },
  {
    title: "Ajuda",
    links: ["Suporte", "Fale Conosco", "Perguntas Frequentes"],
  },
  {
    title: "Termos",
    links: [
      "Termos e Condições",
      "Política de Privacidade",
      "Troca e Devolução",
    ],
  },
];
export default function Footer({
  onInfo,
}: {
  onInfo: (title: string) => void;
}) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="container footer-main__inner">
          <div className="footer-about">
            <a href="#inicio" aria-label="Econverse — voltar ao início">
              <Logo />
            </a>
            <p>
              Tecnologia, conteúdo e boas experiências
              <br className="desktop-break" /> para aproximar pessoas e marcas.
            </p>
            <nav aria-label="Redes sociais">
              {(["instagram", "facebook", "linkedin"] as IconName[]).map(
                (name) => (
                  <button
                    key={name}
                    aria-label={name}
                    onClick={() => onInfo(name)}
                  >
                    <Icon name={name} />
                  </button>
                ),
              )}
            </nav>
          </div>
          <nav className="footer-columns" aria-label="Informações da loja">
            {columns.map((column) => (
              <div key={column.title}>
                <h2>{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link}>
                      <button onClick={() => onInfo(link)}>{link}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
      <p className="copyright">© {new Date().getFullYear()} Econverse.</p>
    </footer>
  );
}
