"use client";
import { useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useState, type RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

const clamp = (v: number) => Math.max(0, Math.min(1, v));
/** A critically damped settle drawn as a curve of progress: no overshoot (apple-design §4). */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** How far along a stretch of the scroll something is: 0 before `start`, 1 after `start + span`, eased between. */
export function along(p: number, start: number, span: number): number {
  const t = clamp((p - start) / span);
  return t >= 1 ? 1 : ease(t);
}

/**
 * A section's own scroll progress, for the build-ups that come together as you read (website spec §5.H): from the
 * moment its top enters the window to when its middle reaches the middle, smoothed by the hero's own spring.
 * Reduced motion: always 1, the finished picture.
 */
export function useBuild(ref: RefObject<HTMLElement | null>): number {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.7, restDelta: 0.0005 });
  const [p, setP] = useState(0);
  useMotionValueEvent(smooth, "change", (v) => setP(v));
  return reduce ? 1 : p;
}
