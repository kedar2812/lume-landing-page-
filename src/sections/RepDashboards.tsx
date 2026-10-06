"use client";
import { useRef } from "react";
import { Screen } from "@/components/Screen";
import { Solves } from "@/components/Solves";
import { along, useBuild } from "@/motion/build";
import x from "./section.module.css";
import s from "./rep.module.css";

const POINTS = [
  {
    h: "A Today of their own",
    p: "Each rep opens LUME to their own follow-ups, calls and day — nobody else’s noise.",
  },
  {
    h: "Their own numbers",
    p: "Leads handled, speed to first contact, replies, wins and their goal’s pace, kept honest by LUME.",
  },
  {
    h: "The Team board, for you",
    p: "Everyone side by side: speed, replies, wins and follow-ups done on time, person by person.",
  },
  {
    h: "Who needs a hand, right now",
    p: "Overdue follow-ups per person, so you help the right rep before a lead goes cold.",
  },
];

/**
 * Every rep, their own dashboard (website spec §5, item 9) — a scroll build-up (§5.H): the rep's day and numbers
 * come in from the left, the owner's Team board from the right, meeting in the middle.
 */
export function RepDashboards() {
  const ref = useRef<HTMLElement>(null);
  const p = useBuild(ref);
  const rep = along(p, 0.1, 0.6);
  const owner = along(p, 0.2, 0.6);
  return (
    <section ref={ref} id="team" className={x.section} aria-labelledby="team-h">
      <div className="wrap">
        <Solves n={4} />
        <h2 id="team-h" className={x.h2}>
          Each rep sees their own day and numbers. You see everyone’s.
        </h2>
        <p className={x.lede}>
          When work is visible, it gets done. LUME gives every salesperson a dashboard of their own and gives
          you the whole team at a glance.
        </p>
        <div className={s.stage}>
          <div
            className={s.rep}
            style={{
              transform: `translateX(${-180 * (1 - rep)}px) rotate(${-3 * (1 - rep)}deg)`,
              opacity: 0.2 + 0.8 * rep,
            }}
          >
            <Screen name="today-rep" alt="A sales rep's own Today in LUME" className={s.shot} />
            <Screen
              name="me"
              alt="A sales rep's own numbers and goal pace in LUME"
              className={`${s.shot} ${s.behind}`}
            />
          </div>
          <div
            className={s.owner}
            style={{
              transform: `translateX(${180 * (1 - owner)}px) rotate(${3 * (1 - owner)}deg)`,
              opacity: 0.2 + 0.8 * owner,
            }}
          >
            <Screen name="team" alt="LUME's Team board: every rep side by side" className={s.shot} />
          </div>
        </div>
        <ul className={s.points}>
          {POINTS.map((pt) => (
            <li key={pt.h}>
              <h3>{pt.h}</h3>
              <p>{pt.p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
