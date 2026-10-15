import type { ReactNode } from "react";
export type IconName =
  | "search"
  | "heart"
  | "user"
  | "cart"
  | "box"
  | "shield"
  | "truck"
  | "card"
  | "crown"
  | "instagram"
  | "facebook"
  | "linkedin";
const paths: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="7.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  user: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="9" r="3" />
      <path d="M5.5 18c1-5 12-5 13 0" />
    </>
  ),
  cart: (
    <>
      <path d="M2 3h3l3 13h12l2-10H6M9 11h11" />
      <circle cx="10" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
    </>
  ),
  box: (
    <>
      <path d="M4 3h16l2 6v12H2V9ZM2 9h20M12 3v6m-3 3-3 3 3 3m-3-3h12" />
    </>
  ),
  shield: (
    <>
      <path d="M4 3h16v8c0 6-8 10-8 10S4 17 4 11Z" />
      <path d="m8 11 3 3 5-6" />
    </>
  ),
  truck: (
    <>
      <path d="M2 5h12v12H2Zm12 5h5l3 4v3h-8M5 9h5" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="1" />
      <path d="M2 9h20M5 15h4m2 0h2" />
    </>
  ),
  crown: <path d="m2 7 5 4 5-8 5 8 5-4-3 14H5Z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  facebook: (
    <path d="M15 22v-9h3l1-4h-4V7c0-1 .5-2 2-2h2V1h-3c-4 0-5 2-5 6v2H8v4h3v9Z" />
  ),
  linkedin: (
    <>
      <rect x="3" y="9" width="4" height="12" />
      <circle cx="5" cy="4" r="2" />
      <path d="M11 21V9h4v2c3-4 7-2 7 3v7h-4v-7c0-2-3-2-3 0v7Z" />
    </>
  ),
};
export default function Icon({
  name,
  size = 24,
}: {
  name: IconName;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
