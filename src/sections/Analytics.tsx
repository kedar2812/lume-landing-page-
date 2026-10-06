import { Screen } from "@/components/Screen";
import s from "./analytics.module.css";

/**
 * Analytics (website spec §5, item 11): canvas C's section exactly — the Overview under a fade, one line, and four
 * things LUME noticed, said as LUME says them, from the demo business.
 */
const NOTES = [
  "Speed pays off",
  "Referrals punch above their weight",
  "Webinars cost more than they return",
  "Most leads arrive after 7 pm",
];

export function Analytics() {
  return (
    <section id="analytics" className={s.section} aria-labelledby="analytics-h">
      <div className="wrap">
        <div className={s.card}>
          <Screen
            name="overview"
            alt="LUME's Analytics overview: new leads, replies, calls, wins and revenue against the month before"
          />
          <div className={s.fade}>
            <h2 id="analytics-h" className={s.h}>
              Analytics that read like a colleague’s note.
            </h2>
            <ul className={s.notes} aria-label="What LUME noticed">
              {NOTES.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className={s.from}>From the demo business</p>
          </div>
        </div>
      </div>
    </section>
  );
}
