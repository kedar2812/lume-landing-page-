"use client";
import { useMotionValue, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/**
 * How far a pinned build has come (0 → 1) over `vh` of scrolling from the moment its track reaches the top of the
 * window. Pure position, smoothed by the hero's critically damped spring: scroll back and it comes apart, scroll
 * forward and it builds again — every time. The pinned content may be taller than the window; once built it
 * scrolls on like the rest of the page, so all of it is seen. Reduced motion: always 1.
 */
export function usePinProgress(track: RefObject<HTMLElement | null>, vh: number): number {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const raw = useMotionValue(0);
  const geo = useRef({ top: 0, dist: 1 });
  const smooth = useSpring(raw, { stiffness: 170, damping: 32, mass: 0.7, restDelta: 0.0005 });
  const [p, setP] = useState(0);
  useMotionValueEvent(smooth, "change", (v) => setP(v));
  useMotionValueEvent(scrollY, "change", (y) => raw.set(clamp((y - geo.current.top) / geo.current.dist)));
  useLayoutEffect(() => {
    const read = () => {
      const el = track.current;
      if (!el) return;
      geo.current = {
        top: el.getBoundingClientRect().top + window.scrollY,
        dist: Math.max(1, (window.innerHeight * vh) / 100),
      };
      raw.set(clamp((window.scrollY - geo.current.top) / geo.current.dist));
    };
    read();
    window.addEventListener("resize", read);
    // Anything above that changes height (fonts, images) moves the track: read again.
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(read);
    ro?.observe(document.body);
    return () => {
      window.removeEventListener("resize", read);
      ro?.disconnect();
    };
  }, [track, vh, raw]);
  return reduce ? 1 : p;
}
