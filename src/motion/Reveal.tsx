"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import s from "./motion.module.css";

/**
 * Content that rises into place the first time it enters the view (once). Under reduced motion, or before the
 * script runs, it is simply there: nothing is ever hidden from someone who can't see it arrive.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"static" | "waiting" | "shown">("static");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    setState("waiting");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      data-reveal={state}
      className={`${s.reveal} ${className ?? ""}`}
      style={{ "--reveal-y": `${y}px`, "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
