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
      {departments.map(({ id, title }) => (
        <button
          className={active === id ? "active" : ""}
          key={id}
          aria-pressed={active === id}
          onClick={() => onSelect(id)}
        >
          <span>
            <img src={`/images/${id}.png`} alt="" width="64" height="64" />
          </span>
          {title}
        </button>
      ))}
    </nav>
  );
}
