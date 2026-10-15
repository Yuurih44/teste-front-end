export function goToProducts() {
  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  document.getElementById("produtos")?.scrollIntoView({
    behavior: reduceMotion ? "instant" : "smooth",
    block: "start",
  });
}
