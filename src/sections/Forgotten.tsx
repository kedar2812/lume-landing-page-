"use client";
import { useRef } from "react";
import { along, useBuild } from "@/motion/build";
import x from "./section.module.css";
import s from "./forgotten.module.css";

/** The problem, said once (owner's redesign): one line, three facts that rise in turn, the study cited. */
const FACTS = [
  {
    big: "21×",
    text: "more likely to qualify a web lead reached within 5 minutes than within 30.",
    cite: true,
  },
  { big: "5 places", text: "where leads sit today: DMs, forms, sheets, a notebook, someone’s phone." },
  { big: "1 exit", text: "and a salesperson’s leads, chats and sheets walk out with them." },
];

export function Forgotten() {
  const ref = useRef<HTMLElement>(null);
  const p = useBuild(ref);
  return (
    <section ref={ref} id="problem" className={x.section} aria-labelledby="problem-h">
      <div className="wrap">
        <p className={x.eyebrow}>The problem</p>
        <h2 id="problem-h" className={`${x.h2} ${s.h}`}>
          Most leads aren’t lost. They’re forgotten.
        </h2>
        <ul className={s.facts}>
          {FACTS.map((f, i) => {
            const t = along(p, 0.25 + i * 0.12, 0.4);
            return (
              <li
                key={f.big}
                className={s.fact}
                data-build=""
                style={{ opacity: 0.15 + 0.85 * t, transform: `translateY(${28 * (1 - t)}px)` }}
              >
                <span className={s.big}>{f.big}</span>
                <span className={s.text}>
                  {f.text}
                  {f.cite && <sup>1</sup>}
                </span>
              </li>
            );
          })}
        </ul>
        <p className={s.source}>1. Oldroyd, Lead Response Management Study, MIT and InsideSales, 2007.</p>
      </div>
    </section>
  );
}
