import { useEffect, useRef, useState } from "react";
export function useCarousel(itemCount: number) {
  const track = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState({ previous: false, next: false });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () =>
      setCanScroll({
        previous: element.scrollLeft > 1,
        next:
          element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
      });
    const frame = requestAnimationFrame(update);
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(update);
    observer?.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      element.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [itemCount]);
  function scroll(direction: number) {
    const element = track.current;
    if (!element) return;
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.scrollBy({
      left: direction * element.clientWidth,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  }
  return { track, canScroll, scroll };
}
