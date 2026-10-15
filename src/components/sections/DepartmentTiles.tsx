import DepartmentIcon from "./DepartmentIcon";
import {
  departments,
  type DepartmentId,
} from "../../features/catalog/model/departments";

export default function DepartmentTiles({
  active,
  onSelect,
}: {
  active: DepartmentId;
  onSelect: (department: DepartmentId) => void;
}) {
  return (
    <nav
      className="department-tiles container"
      aria-label="Navegar por departamento"
    >
      {departments
        .filter(({ id }) => id !== "livros")
        .map(({ id, title }) => (
          <button
            className={active === id ? "active" : ""}
            key={id}
            aria-pressed={active === id}
            onClick={() => onSelect(id)}
          >
            <span>
              <DepartmentIcon image={id} />
            </span>
            {title}
          </button>
        ))}
    </nav>
  );
}
