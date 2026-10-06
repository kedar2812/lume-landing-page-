"use client";
import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Smooth wheel scrolling on desktop (Lenis). It steps aside for touch, where native scrolling is better, and for
 * anyone who asked for reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (still || touch) return;
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, anchors: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
