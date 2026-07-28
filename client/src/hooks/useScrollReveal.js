import { useEffect, useRef } from "react";

/**
 * Adds a `reveal` class to the element and toggles `is-visible`
 * once it enters the viewport. Respects prefers-reduced-motion
 * implicitly via the CSS media query in index.css.
 */
export default function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
