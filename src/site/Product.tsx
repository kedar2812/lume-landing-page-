/* eslint-disable @next/next/no-img-element -- both themes' captures are plain <img> pairs, swapped by CSS */
"use client";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { SCREENS, srcOf, type ScreenName } from "@/lib/screens";
import { useReducedMotion } from "@/motion/useReducedMotion";
import s from "./product.module.css";
import x from "./section.module.css";

const TABS: { id: ScreenName; label: string; line: string }[] = [
  {
    id: "today",
    label: "Today",
    line: "Each person opens LUME to their own day: who to follow up, who replied, what’s booked and what’s slipping.",
  },
  {
    id: "leads",
    label: "Leads",
    line: "One list for every source. Import a CSV or a Google Sheet and LUME matches the columns, catches duplicates and fixes phone numbers.",
  },
  {
    id: "pipeline",
    label: "Pipeline",
    line: "Your own stages, as a board. Drag a lead forward, or move a hundred at once.",
  },
  {
    id: "overview",
    label: "Analytics",
    line: "Where leads come from, where they stall and who’s closing, with every number one click from the leads behind it.",
  },
  {
    id: "team",
    label: "Team",
    line: "Roles decide what each person sees. When someone leaves, their leads and follow-ups move in one step.",
  },
  {
    id: "security",
    label: "Security",
    line: "Two-step sign-in, sign-in limits by role, and a record of every export and who made it.",
  },
];

/**
 * The rest of LUME in its own captures, held in place while the scroll turns the pages: six screens, one at a
 * time, the list beside them keeping count. Pressing a name goes to its screen. With reduced motion nothing is
 * pinned and the names are plain buttons.
 */
export function Product() {
  const still = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!still) setN(Math.min(TABS.length - 1, Math.floor(v * TABS.length)));
  });
  const go = (i: number) => {
    const el = ref.current;
    if (still || !el) return setN(i);
    const room = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.5) / TABS.length) * room, behavior: "smooth" });
  };
  const tab = TABS[n]!;
  return (
    <section
      id="product"
      ref={ref}
      className={`${s.section} ${still ? s.flat : ""}`}
      aria-labelledby="product-h"
    >
      <div className={s.pin}>
        <div className={`wrap ${s.in}`}>
          <div className={s.side}>
            <h2 id="product-h" className={x.h2}>
              And everything else a sales day runs on.
            </h2>
            <div className={s.tabs} role="group" aria-label="Choose a LUME screen">
              {TABS.map((t, i) => (
                <button key={t.id} type="button" aria-pressed={i === n} onClick={() => go(i)}>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
            <p className={s.line} aria-live="polite" key={tab.id}>
              {tab.line}
            </p>
          </div>
          <div className={s.frame} role="img" aria-label={`LUME's ${tab.label} screen`}>
            {TABS.map((t, i) => {
              const shot = SCREENS[t.id];
              const size = { width: shot.width / 2, height: shot.height / 2 };
              return (
                <div key={t.id} className={s.shot} data-on={i === n} data-before={i < n}>
                  <img
                    {...size}
                    src={srcOf(t.id, "light")}
                    alt=""
                    data-shot="light"
                    decoding="async"
                    loading="lazy"
                  />
                  <img
                    {...size}
                    src={srcOf(t.id, "dark")}
                    alt=""
                    data-shot="dark"
                    decoding="async"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
