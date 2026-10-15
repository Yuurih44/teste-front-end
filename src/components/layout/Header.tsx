import { useStore } from "../../features/shopping/hooks/useStore";
import { type FormEvent } from "react";
import Icon, { type IconName } from "../ui/Icon";
import Logo from "../ui/Logo";
export default function Header({
  onSearch,
  onInfo,
  query,
  onQueryChange,
  onCart,
  onFavorites,
}: {
  onSearch: (value: string) => void;
  onInfo: (title: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  onCart: () => void;
  onFavorites: () => void;
}) {
  const { cartCount, favorites } = useStore();
  function submit(event: FormEvent) {
    event.preventDefault();
    onSearch(query.trim());
  }
  const actions: [IconName, string][] = [
    ["box", "Meus pedidos"],
    ["heart", "Meus favoritos"],
    ["user", "Minha conta"],
    ["cart", "Meu carrinho"],
  ];
  return (
    <header className="site-header" id="inicio">
      <div className="benefits container">
        <span>
          <Icon name="shield" size={20} /> Compra <strong>100% segura</strong>
        </span>
        <span>
          <Icon name="truck" size={20} />
          <strong>Frete grátis</strong> acima de R$ 200
        </span>
        <span>
          <Icon name="card" size={20} />
          <strong>Parcele</strong> suas compras
        </span>
      </div>
      <div className="header-main container">
        <a className="home-link" href="#inicio" aria-label="Econverse — início">
          <Logo />
        </a>
        <form className="search" role="search" onSubmit={submit}>
          <label className="sr-only" htmlFor="search-products">
            Buscar produtos
          </label>
          <input
            id="search-products"
            type="search"
            placeholder="O que você está buscando?"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          <button type="submit" aria-label="Buscar">
            <Icon name="search" size={28} />
          </button>
        </form>
        <nav className="header-actions" aria-label="Minha área">
          {actions.map(([icon, title]) => (
            <button
              className="header-action"
              key={icon}
              onClick={() =>
                icon === "cart"
                  ? onCart()
                  : icon === "heart"
                    ? onFavorites()
                    : onInfo(title)
              }
              aria-label={title}
            >
              <Icon name={icon} size={30} />
              {((icon === "cart" && cartCount > 0) ||
                (icon === "heart" && favorites.length > 0)) && (
                <span className="action-count" aria-hidden="true">
                  {icon === "cart" ? cartCount : favorites.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <nav className="departments container" aria-label="Departamentos">
        {[
          "Todas categorias",
          "Supermercado",
          "Livros",
          "Moda",
          "Lançamentos",
          "Ofertas do dia",
          "Assinatura",
        ].map((item, index) => (
          <button
            className={index === 5 ? "highlight" : ""}
            key={item}
            onClick={() =>
              index === 0 || index === 4 || index === 5
                ? onSearch("")
                : onInfo(item)
            }
          >
            {index === 6 && <Icon name="crown" size={21} />} {item}
          </button>
        ))}
      </nav>
    </header>
  );
}
