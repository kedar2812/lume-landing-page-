import { Reveal } from "@/motion/Reveal";
import x from "./section.module.css";
import s from "./problem.module.css";

/**
 * The problem (website spec §5, item 4): three short lines, then the one study the site quotes — with its source,
 * because most speed-to-lead numbers going round are made up.
 */
const LINES = [
  "Your leads are in five places.",
  "The first reply comes days later.",
  "And when your best salesperson leaves, the leads go with their phone.",
];

export function Problem() {
  return (
    <section id="problem" className={x.section} aria-labelledby="problem-h">
      <div className="wrap">
        <h2 id="problem-h" className="sr-only">
          Why leads go cold
        </h2>
        <div className={s.lines}>
          {LINES.map((line, i) => (
            <Reveal key={line} delay={i * 120} y={30}>
              <p className={s.line}>{line}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className={s.stat} delay={150}>
          <span className={s.big}>21×</span>
          <p className={s.what}>
            more likely to qualify a web lead reached within 5 minutes than within 30.
            <sup>
              <a href="#problem-source" aria-label="Source">
                1
              </a>
            </sup>
          </p>
        </Reveal>
        <p id="problem-source" className={s.source}>
          1. Oldroyd, Lead Response Management Study, MIT and InsideSales, 2007.
        </p>
      </div>
    </section>
  );
}
