import { useId } from "react";

// Extract the ink of each original image and tint it with the button's color.
export default function DepartmentIcon({ image }: { image: string }) {
  const id = useId();
  return (
    <svg
      className="department-icon"
      width="61"
      height="61"
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -0.2126 -0.7152 -0.0722 1 0"
            result="ink"
          />
          <feComponentTransfer in="ink" result="opaque-ink">
            <feFuncA type="linear" slope="1.4" />
          </feComponentTransfer>
          <feFlood floodColor="currentColor" />
          <feComposite in2="opaque-ink" operator="in" />
        </filter>
      </defs>
      <image
        href={`${import.meta.env.BASE_URL}images/${image}.png`}
        width="64"
        height="64"
        preserveAspectRatio="xMidYMid meet"
        filter={`url(#${id})`}
      />
    </svg>
  );
}
