"use client";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/motion/useReducedMotion";

/*
 * With reduced motion these render plain elements, never the motion ones without a style: the page's first render
 * is with motion (the server can't know), and a motion element keeps the inline style it was given then, so it would
 * stay clipped or faint for good.
 */

/** A band that arrives as a rounded card and opens to the full width of the window as it reaches the reader. */
export function Band({
  children,
  className,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  labelledBy: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 1", "start 0.25"] });
  const p = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.4 });
  const clipPath = useTransform(p, (v) => `inset(0 ${(1 - v) * 7}% round ${(1 - v) * 56}px)`);
  if (still)
    return (
      <section className={className} aria-labelledby={labelledBy}>
        {children}
      </section>
    );
  return (
    <motion.section ref={ref} className={className} aria-labelledby={labelledBy} style={{ clipPath }}>
      {children}
    </motion.section>
  );
}

/** The name at the foot of the page, rising out of the floor as the page runs out. */
export function Lift({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 1", "end 1"] });
  const y = useTransform(scrollYProgress, [0, 1], ["42%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [0.2, 1, 1]);
  return (
    <div ref={ref} className={className} aria-hidden="true" style={{ overflow: "clip" }}>
      {still ? <div>{children}</div> : <motion.div style={{ y, opacity }}>{children}</motion.div>}
    </div>
  );
}
