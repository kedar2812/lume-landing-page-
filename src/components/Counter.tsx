"use client";
import { useEffect, useRef } from "react";

/**
 * A measured number that counts up once as it comes into view. The markup always holds the real value (for
 * search engines, no JavaScript and reduced motion); the count only replays it.
 */
export function Counter({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / 900);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = format(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, format]);
  return <span ref={ref}>{format(value)}</span>;
}
