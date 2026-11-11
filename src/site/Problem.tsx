"use client";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef, useState } from "react";
import { Scrub } from "@/motion/scroll";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { BEATS, clockAt, minutesAt, stageAt } from "./cold-script";
import { waited } from "./waiting";
import s from "./problem.module.css";
import x from "./section.module.css";
import u from "./ui.module.css";

const SOURCES = [
  "Instagram DMs",
  "WhatsApp",
  "Website forms",
  "Ad forms",
  "Google Sheets",
  "Missed calls",
  "Referrals",
  "Walk-ins",
];
const EXCUSES = [
  "I’ll reply after lunch",
  "Who was handling this one?",
  "It’s in the sheet somewhere",
  "I thought you replied",
  "Did anyone call them back?",
  "Let me check my DMs",
];

/** A line of words that drifts on its own and leans into the scroll: faster when you scroll, turning when you turn. */
function Drift({ words, dir, quiet }: { words: string[]; dir: 1 | -1; quiet?: boolean }) {
  const still = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const v = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const way = useRef<number>(dir);
  useAnimationFrame((_, delta) => {
    if (still) return;
    const push = v.get() / 900;
    if (push < -0.05) way.current = -dir;
    else if (push > 0.05) way.current = dir;
    let next = base.get() + way.current * (1.6 + Math.abs(push) * 9) * (delta / 1000);
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    base.set(next);
  });
  const tx = useTransform(base, (n) => `${n}%`);
  return (
    <div className={`${s.drift} ${quiet ? s.quiet : ""}`} aria-hidden="true">
      <motion.div style={{ x: tx }}>
        {[0, 1].map((k) => (
          <span key={k}>
            {words.map((w) => (
              <span key={w}>
                {w}
                <i />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const Tick = ({ two }: { two?: boolean }) => (
  <svg
    viewBox="0 0 18 12"
    width="16"
    height="11"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    aria-hidden="true"
  >
    <path d={two ? "m1 6.5 3.2 3.2L11 2.5M7.5 9.2l.6.5L15 2.5" : "m3 6.5 3.2 3.2L13 2.5"} />
  </svg>
);

/** One lead, one ordinary day, scrubbed by the scroll: the clock runs, the chat fills, the lead goes cold. */
function Cold() {
  const still = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(Math.round(v * 400) / 400));
  const at = still ? 1 : p;
  const stage = stageAt(at);
  const mins = minutesAt(at);
  const clock = clockAt(mins);
  // Three points on purpose: the browser runs this one itself, and a two-point range comes back up after its end.
  const cool = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0, 0]);
  const knob = useTransform(scrollYProgress, [0, 0.9], ["0%", "100%"]);

  return (
    <div className={`${s.cold} ${still ? s.coldFlat : ""}`} ref={ref}>
      <div className={s.pin}>
        <motion.div className={s.warmth} style={{ opacity: still ? 0 : cool }} aria-hidden="true" />
        <div className={`wrap ${s.scene}`}>
          <div className={s.tell}>
            <p className={s.day}>{clock.day}</p>
            <p className={s.clock} aria-hidden="true">
              {clock.time}
              <small>{clock.half}</small>
            </p>
            <p className={s.since}>
              Riya has waited <b>{mins < 1 ? "0 min" : waited(mins)}</b>
            </p>
            <div className={s.beats}>
              {BEATS.map((b, i) => (
                <p key={b.say} data-on={still || i === stage} data-past={!still && i < stage}>
                  {b.say}
                </p>
              ))}
            </div>
          </div>

          <div className={`${u.window} ${s.phone}`} aria-hidden="true">
            <div className={u.bar}>
              <span className={`${u.avatar} ${u.a4}`}>RS</span>
              <span className={u.grow}>
                Riya Sharma <small>Instagram DM</small>
              </span>
            </div>
            <div className={`${u.thread} ${s.thread}`}>
              <div className={`${u.msg} ${u.in}`}>
                Hi! Saw your reel. Do you have a slot this week?
                <div className={u.meta}>10:02 am</div>
              </div>
              <p className={s.seen} data-on={stage >= 1}>
                Seen at 10:40 am
              </p>
              <div className={`${u.msg} ${u.in} ${s.late}`} data-on={stage >= 2}>
                Hello? Should I look somewhere else?
                <div className={u.meta}>1:15 pm</div>
              </div>
              <div className={`${u.msg} ${u.in} ${s.late}`} data-on={stage >= 3}>
                No worries, I’ve booked with someone else. Thanks!
                <div className={u.meta}>6:50 pm</div>
              </div>
              <div className={`${u.msg} ${u.out} ${s.late} ${s.sorry}`} data-on={stage >= 4}>
                Hi Riya! So sorry for the delay. Yes, we have slots this week.
                <div className={u.meta}>
                  11:40 am <Tick />
                </div>
              </div>
              <p className={s.seen} data-on={stage >= 4}>
                Delivered. Never opened.
              </p>
            </div>
          </div>
        </div>

        <div className={`wrap ${s.heat}`} aria-hidden="true">
          <span>Warm</span>
          <div className={s.track}>
            <motion.i style={{ left: still ? "100%" : knob }} />
          </div>
          <span>Cold</span>
        </div>
      </div>
    </div>
  );
}

/** The problem, before any product: where leads come from, what happens to them, and one lead's day in full. */
export function Problem() {
  return (
    <section id="problem" className={s.section} aria-labelledby="problem-h">
      <div className={`wrap ${s.head}`}>
        <Scrub
          id="problem-h"
          className={x.h2}
          text="Leads come in from everywhere. Replies go out when someone remembers."
        />
      </div>
      <Drift words={SOURCES} dir={-1} />
      <Drift words={EXCUSES} dir={1} quiet />
      <Cold />
      <div className={`wrap ${s.after}`}>
        <Scrub
          as="p"
          className={s.verdict}
          text="Nobody decided to lose Riya. The day just got busy. Tomorrow it gets busy again, and there will be another Riya."
        />
      </div>
    </section>
  );
}
