import { Screen } from "@/components/Screen";
import x from "./section.module.css";
import s from "./phone.module.css";

/** LUME on a phone (website spec §5, item 8; canvas B): the same LUME, for reps in the field. */
export function Phone() {
  return (
    <section id="phone" className={`${x.section} ${x.center}`} aria-labelledby="phone-h">
      <div className="wrap">
        <p className={x.eyebrow}>On your phone</p>
        <h2 id="phone-h" className={x.h2}>
          Your reps carry LUME in their pocket.
        </h2>
        <p className={x.lede}>
          The same LUME on a phone: today’s follow-ups, every lead, and a WhatsApp one tap away, between
          visits.
        </p>
        <div className={s.fan}>
          <div className={`${s.device} ${s.left}`}>
            <Screen name="today-phone" alt="LUME's Today on a phone" />
          </div>
          <div className={`${s.device} ${s.middle}`}>
            <Screen name="leads-phone" alt="LUME's leads on a phone" />
          </div>
          <div className={`${s.device} ${s.right}`}>
            <Screen name="drawer-phone" alt="A lead opened in LUME on a phone" />
          </div>
        </div>
      </div>
    </section>
  );
}
