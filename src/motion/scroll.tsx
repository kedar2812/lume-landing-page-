"use client";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * The page's scroll language, in three pieces used everywhere: a heading whose words light up as it's read down
 * the window (Scrub), a product window that leans back until it reaches the reader (Tilt), and a block that rises
 * into place (Rise). All three finish where a still page would have them: with reduced motion, or no script, the
 * finished state is what's shown.
 */
function Word({
  children,
  p,
  from,
  to,
}: {
  children: string;
  p: MotionValue<number>;
  from: number;
  to: number;
}) {
  const opacity = useTransform(p, [from, to], [0.16, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

export function Scrub({
  text,
  className,
  id,
  as = "h2",
}: {
  text: string;
  className?: string;
  id?: string;
  as?: "h2" | "p";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.92", "start 0.5"] });
  const words = text.split(" ");
  const Tag = as;
  if (still)
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  return (
    <Tag id={id} className={className} ref={ref} data-scrub aria-label={text}>
      {words.map((w, i) => (
        <Word
          key={`${w}-${i}`}
          p={scrollYProgress}
          from={i / (words.length + 0.6)}
          to={(i + 1.6) / (words.length + 0.6)}
        >
          {w}
        </Word>
      ))}
    </Tag>
  );
}

export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 1", "start 0.42"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const rotateX = useTransform(p, [0, 1], [26, 0]);
  const scale = useTransform(p, [0, 1], [0.9, 1]);
  const y = useTransform(p, [0, 1], [70, 0]);
  const opacity = useTransform(p, [0, 0.35], [0.4, 1]);
  if (still) return <div className={className}>{children}</div>;
  return (
    <div ref={ref} className={className} style={{ perspective: 1600 }}>
      <motion.div
        data-tilt
        style={{ rotateX, scale, y, opacity, transformOrigin: "50% 0%", willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function Rise({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const still = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;
  if (still) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag
      className={className}
      data-tilt
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
