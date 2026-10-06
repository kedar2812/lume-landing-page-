"use client";
import { useRef } from "react";
import { Screen } from "@/components/Screen";
import { along, useBuild } from "@/motion/build";
import x from "./section.module.css";
import s from "./phone.module.css";

/**
 * LUME on a phone (website spec §5, item 8; canvas B) — a scroll build-up (§5.H): the middle phone rises, then the
 * two beside it fan out from behind it.
 */
export function Phone() {
  const ref = useRef<HTMLElement>(null);
  const p = useBuild(ref);
  const rise = along(p, 0.05, 0.5);
  const fan = along(p, 0.3, 0.6);
  return (
    <section ref={ref} id="phone" className={`${x.section} ${x.center}`} aria-labelledby="phone-h">
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
          <div
            className={`${s.device} ${s.left}`}
            style={{
              transform: `translateX(${105 * (1 - fan)}%) rotate(${-6 * fan}deg) translateY(${24 * (1 - fan)}px)`,
              opacity: fan,
            }}
          >
            <Screen name="today-phone" alt="LUME's Today on a phone" />
          </div>
          <div
            className={`${s.device} ${s.middle}`}
            style={{
              transform: `translateY(${-24 + 90 * (1 - rise)}px) scale(${0.94 + 0.06 * rise})`,
              opacity: 0.2 + 0.8 * rise,
            }}
          >
            <Screen name="leads-phone" alt="LUME's leads on a phone" />
          </div>
          <div
            className={`${s.device} ${s.right}`}
            style={{
              transform: `translateX(${-105 * (1 - fan)}%) rotate(${6 * fan}deg) translateY(${24 * (1 - fan)}px)`,
              opacity: fan,
            }}
          >
            <Screen name="drawer-phone" alt="A lead opened in LUME on a phone" />
          </div>
        </div>
      </div>
    </section>
  );
}
