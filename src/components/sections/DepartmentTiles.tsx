import { goToProducts } from "../../utils/navigation";
const departments = [
  ["Tecnologia", "tecnologia"],
  ["Supermercado", "supermercado"],
  ["Bebidas", "bebidas"],
  ["Ferramentas", "ferramentas"],
  ["Saúde", "saude"],
  ["Esportes e Fitness", "esportes"],
  ["Moda", "moda"],
];
export default function DepartmentTiles({
  onInfo,
}: {
  onInfo: (title: string) => void;
}) {
  return (
    <nav
      className="department-tiles container"
      aria-label="Navegar por departamento"
    >
      {departments.map(([title, image], index) => (
        <button
          className={index === 0 ? "active" : ""}
          key={image}
          onClick={() => (index === 0 ? goToProducts() : onInfo(title))}
        >
          <span>
            <img src={`/images/${image}.png`} alt="" width="64" height="64" />
          </span>
          {title}
        </button>
      ))}
    </nav>
  );
}
