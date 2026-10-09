"use client";
import { useRef, useSyncExternalStore } from "react";
import { Screen } from "@/components/Screen";
import type { ScreenName } from "@/lib/screens";
import { along, useBuild } from "@/motion/build";
import x from "./section.module.css";
import s from "./phone.module.css";

const SMALL = "(max-width: 640px)";
const onMedia = (cb: () => void) => {
  const mq = window.matchMedia(SMALL);
  mq.addEventListener?.("change", cb);
  return () => mq.removeEventListener?.("change", cb);
};

/**
 * LUME on a phone (website spec §5, item 8; canvas B) — a scroll build-up (§5.H): the middle phone rises, then the
 * two beside it fan out from behind it. On a small screen the two stay half behind the middle one, and the middle
 * is a lead opened with WhatsApp ready (Today is already the phone in the hero there).
 */
export function Phone() {
  const ref = useRef<HTMLElement>(null);
  const p = useBuild(ref);
  const rise = along(p, 0.05, 0.5);
  const fan = along(p, 0.3, 0.6);
  const small = useSyncExternalStore(
    onMedia,
    () => window.matchMedia(SMALL).matches,
    () => false,
  );
  const [left, middle, right]: [ScreenName, ScreenName, ScreenName] = small
    ? ["leads-phone", "drawer-phone", "today-phone"]
    : ["today-phone", "leads-phone", "drawer-phone"];
  const ALT: Record<string, string> = {
    "today-phone": "LUME's Today on a phone",
    "leads-phone": "LUME's leads on a phone",
    "drawer-phone": "A lead opened in LUME on a phone",
  };
  // Where the side phones rest: beside the middle one, or (small screens) tucked half behind it.
  const side = (dir: -1 | 1) =>
    small
      ? `translateX(${dir * 31 * fan}%) rotate(${dir * 6 * fan}deg) scale(0.86)`
      : `translateX(${-dir * 105 * (1 - fan)}%) rotate(${dir * 6 * fan}deg) translateY(${24 * (1 - fan)}px)`;
  return (
    <section
      ref={ref}
      id="phone"
      className={`${x.section} ${x.center} ${s.section}`}
      aria-labelledby="phone-h"
    >
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
            data-build=""
            style={{
              transform: side(-1),
              opacity: fan,
            }}
          >
            <Screen name={left} alt={ALT[left]!} />
          </div>
          <div
            className={`${s.device} ${s.middle}`}
            data-build=""
            style={{
              transform: `translateY(${-24 + 90 * (1 - rise)}px) scale(${0.94 + 0.06 * rise})`,
              opacity: 0.2 + 0.8 * rise,
            }}
          >
            <Screen name={middle} alt={ALT[middle]!} />
          </div>
          <div
            className={`${s.device} ${s.right}`}
            data-build=""
            style={{
              transform: side(1),
              opacity: fan,
            }}
          >
            <Screen name={right} alt={ALT[right]!} />
          </div>
        </div>
      </div>
    </section>
  );
}
