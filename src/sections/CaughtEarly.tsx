import { Screen } from "@/components/Screen";
import { Solves } from "@/components/Solves";
import type { ScreenName } from "@/lib/screens";
import x from "./section.module.css";
import s from "./caught.module.css";

/**
 * Caught early (website spec §5, item 10; §4.1): never a problem without LUME's answer beside it. Each warning
 * turns to its fix as it passes the middle of the window.
 */
const PAIRS: { shot: ScreenName; alt: string; spotted: string; then: string }[] = [
  {
    shot: "caught-no-touch",
    alt: "LUME's Today with a lead nobody contacted for 3 days brought back as a follow-up",
    spotted: "A lead nobody has touched for 3 days.",
    then: "It’s back on its owner’s Today, with a follow-up.",
  },
  {
    shot: "caught-needs-you",
    alt: "Needs you in LUME: overdue follow-ups and leads waiting for someone",
    spotted: "Follow-ups going overdue.",
    then: "One tap gives the overdue work to someone free.",
  },
  {
    shot: "caught-source",
    alt: "LUME's sources board: cost per lead beside win rate for each source",
    spotted: "A source that costs more than it returns.",
    then: "Cost per lead beside win rate, so the budget moves.",
  },
  {
    shot: "caught-goal",
    alt: "A goal in LUME with its pace and what it takes to catch up",
    spotted: "A goal falling behind its pace.",
    then: "The pace and the gap, while there’s time to close it.",
  },
];

export function CaughtEarly() {
  return (
    <section id="caught" className={x.section} aria-labelledby="caught-h">
      <div className="wrap">
        <Solves n={5} />
        <h2 id="caught-h" className={x.h2}>
          LUME spots trouble before it costs you.
        </h2>
        <ol className={s.pairs}>
          {PAIRS.map((p) => (
            <li key={p.shot} className={s.pair}>
              <Screen name={p.shot} alt={p.alt} className={s.shot} />
              <div className={s.words}>
                <p className={s.spotted}>
                  <span className={s.dot} aria-hidden="true" />
                  LUME spotted: {p.spotted}
                </p>
                <p className={s.then}>
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Then: {p.then}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
