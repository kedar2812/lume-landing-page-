import { Screen } from "@/components/Screen";
import { Reveal } from "@/motion/Reveal";
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

/** Every rep, their own dashboard (website spec §5, item 9): the rep's day and numbers, and the owner's Team board. */
export function RepDashboards() {
  return (
    <section id="team" className={x.section} aria-labelledby="team-h">
      <div className="wrap">
        <p className={x.eyebrow}>Every rep, their own dashboard</p>
        <h2 id="team-h" className={x.h2}>
          Each rep sees their own day and numbers. You see everyone’s.
        </h2>
        <p className={x.lede}>
          When work is visible, it gets done. LUME gives every salesperson a dashboard of their own and gives
          you the whole team at a glance.
        </p>
        <div className={s.stage}>
          <Reveal className={s.rep} y={0}>
            <Screen name="today-rep" alt="A sales rep's own Today in LUME" className={s.shot} />
            <Screen
              name="me"
              alt="A sales rep's own numbers and goal pace in LUME"
              className={`${s.shot} ${s.behind}`}
            />
          </Reveal>
          <Reveal className={s.owner} y={0} delay={120}>
            <Screen name="team" alt="LUME's Team board: every rep side by side" className={s.shot} />
          </Reveal>
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
