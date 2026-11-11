"use client";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { Stage } from "./Stage";
import { WAITING, heat, waited, type Waiting } from "./waiting";
import s from "./hero.module.css";
import u from "./ui.module.css";

/** Where the leads end up: the middle of LUME's window, a little below the middle of the screen. */
const HOME = { x: 50, y: 58 };

/**
 * One lead nobody has answered: where they wrote from, what they said, and how long they've waited, counting up
 * while you look. It floats with the pointer by its depth; as the page scrolls it flies into LUME.
 */
function Bubble({
  b,
  n,
  p,
  mx,
  my,
  tick,
}: {
  b: Waiting;
  n: number;
  p: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  tick: number;
}) {
  const start = 0.1 + n * 0.012;
  const end = 0.46 + n * 0.012;
  const x = useTransform(p, [start, end], ["0vw", `${HOME.x - b.x}vw`]);
  const y = useTransform(p, [start, end], ["0vh", `${HOME.y - b.y}vh`]);
  const scale = useTransform(p, [start, end], [1, 0.22]);
  const opacity = useTransform(p, [start, end - 0.1, end], [1, 1, 0]);
  const rotate = useTransform(p, [start, end], [b.rot, 0]);
  const px = useTransform(mx, (v) => v * b.depth * -46);
  const py = useTransform(my, (v) => v * b.depth * -34);
  const mins = b.mins + tick * b.rate;
  return (
    <motion.div
      className={s.bubble}
      data-phone={b.phone}
      style={{
        left: `${b.x}%`,
        top: `${b.y}%`,
        x,
        y,
        scale,
        opacity,
        rotate,
        zIndex: Math.round(b.depth * 10),
      }}
    >
      <motion.div style={{ x: px, y: py }}>
        <div
          className={`${u.window} ${s.card}`}
          data-heat={heat(mins)}
          style={{
            animationDuration: `${7 + (n % 5) * 1.3}s`,
            animationDelay: `${-n * 0.9}s`,
            ["--far" as string]: 1.2 - b.depth,
          }}
        >
          <div className={s.from}>
            <span className={s.dot} />
            {b.from}
            <span className={s.wait}>{waited(mins)}</span>
          </div>
          <b>{b.name}</b>
          <p>{b.text}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

const TWO = "LUME answers every lead while it’s still warm.";

/**
 * The first screen is the problem, live: leads from everywhere, each one waiting longer while you read. Scroll, and
 * they fly into LUME's window, where the promise is kept in front of you. With reduced motion the two halves simply
 * follow each other down the page.
 */
export function Hero() {
  const still = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 170, damping: 30, mass: 0.35 });
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 60, damping: 18 });
  const my = useSpring(myRaw, { stiffness: 60, damping: 18 });
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (still) return;
    const t = window.setInterval(() => setTick((k) => k + 1), 1000);
    return () => window.clearInterval(t);
  }, [still]);
  useMotionValueEvent(scrollYProgress, "change", (v) => setPlaying(v > 0.5));

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mxRaw.set((e.clientX - r.left) / r.width - 0.5);
    myRaw.set((e.clientY - r.top) / r.height - 0.5);
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const oneOpacity = useTransform(p, [0.04, 0.24], [1, 0]);
  const oneY = useTransform(p, [0.04, 0.24], [0, -90]);
  const oneScale = useTransform(p, [0.04, 0.24], [1, 0.92]);
  const twoOpacity = useTransform(p, [0.44, 0.58], [0, 1]);
  const twoY = useTransform(p, [0.44, 0.58], [40, 0]);
  const winOpacity = useTransform(p, [0.3, 0.46], [0, 1]);
  const winScale = useTransform(p, [0.3, 0.6], [0.62, 1]);
  const winRotate = useTransform(p, [0.3, 0.6], [34, 0]);
  const winY = useTransform(p, [0.3, 0.6], ["24vh", "0vh"]);
  const hint = useTransform(p, [0, 0.05], [1, 0]);

  const one = (
    <>
      <h1 id="hero-h" className={s.h}>
        <span className={s.line}>
          <span data-rise>Your leads are</span>
        </span>{" "}
        <span className={s.line}>
          <span data-rise style={{ animationDelay: "110ms" }}>
            going cold.
          </span>
        </span>
      </h1>
      <p className={s.lede}>
        They wrote in on Instagram, on WhatsApp, through your website. Someone meant to reply. Then the day
        got busy.
      </p>
      <div className={s.acts}>
        <a href="#demo" className={s.primary}>
          Book a demo
        </a>
        <a href="#cost" className={s.second}>
          Count what it costs you
        </a>
      </div>
    </>
  );

  if (still)
    return (
      <section id="top" className={`${s.hero} ${s.flat}`} aria-labelledby="hero-h">
        <div className={s.one}>{one}</div>
        <div className={`wrap ${s.flatStage}`}>
          <p className={s.h2}>{TWO}</p>
          <Stage />
        </div>
      </section>
    );

  return (
    <section id="top" className={s.hero} ref={ref} aria-labelledby="hero-h">
      <div className={s.sticky} onPointerMove={onMove}>
        <div className={s.grid} aria-hidden="true" />
        <div className={s.field} aria-hidden="true">
          {WAITING.map((b, n) => (
            <Bubble key={b.name} b={b} n={n} p={p} mx={mx} my={my} tick={tick} />
          ))}
        </div>

        <motion.div className={s.one} style={{ opacity: oneOpacity, y: oneY, scale: oneScale }}>
          {one}
        </motion.div>

        <div className={s.two}>
          <motion.p className={s.h2} style={{ opacity: twoOpacity, y: twoY }}>
            {TWO}
          </motion.p>
          <div className={s.persp}>
            <motion.div
              className={s.win}
              style={{ opacity: winOpacity, scale: winScale, rotateX: winRotate, y: winY }}
            >
              <Stage active={playing} />
            </motion.div>
          </div>
        </div>

        <motion.div className={s.hint} style={{ opacity: hint }} aria-hidden="true">
          <span />
          Scroll, and LUME gathers them
        </motion.div>
      </div>
      <p className="sr-only">
        Leads from Instagram, WhatsApp, a website form, ad forms and missed calls wait unanswered, some for
        minutes and some for days. Scrolling gathers them into LUME.
      </p>
    </section>
  );
}
