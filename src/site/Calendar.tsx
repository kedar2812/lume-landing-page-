"use client";
import Image from "next/image";
import { useState } from "react";
import { Rise, Scrub, Tilt } from "@/motion/scroll";
import { AiMark } from "./Stage";
import s from "./calendar.module.css";
import x from "./section.module.css";
import u from "./ui.module.css";

type By = "lume_ai" | "calendly" | "google";
type Meeting = { id: string; day: number; from: number; to: number; who: string; by: By };

const DAYS = [
  ["Mon", 9],
  ["Tue", 10],
  ["Wed", 11],
  ["Thu", 12],
  ["Fri", 13],
  ["Sat", 14],
] as const;
const LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const FIRST = 10;
const HOURS = [10, 11, 12, 13, 14, 15, 16, 17];
const MEETINGS: Meeting[] = [
  { id: "m1", day: 0, from: 11, to: 11.5, who: "Kabir Sethi", by: "lume_ai" },
  { id: "m2", day: 1, from: 15, to: 16, who: "Sara Fernandes", by: "calendly" },
  { id: "m3", day: 2, from: 12, to: 13, who: "Vikram Shah", by: "google" },
  { id: "m4", day: 3, from: 15.5, to: 16.5, who: "Dev Malhotra", by: "calendly" },
  { id: "m5", day: 3, from: 17, to: 17.5, who: "Aanya Kapoor", by: "lume_ai" },
  { id: "m6", day: 4, from: 10.5, to: 11, who: "Tara Menon", by: "lume_ai" },
  { id: "m7", day: 5, from: 11, to: 12, who: "Arjun Pillai", by: "calendly" },
];
/** How each call got onto the calendar, in LUME's own words. */
const WHY: Record<By, string> = {
  lume_ai: "LUME AI booked it in a WhatsApp chat, at a time you gave it.",
  calendly: "It was booked through Calendly.",
  google: "A lead is invited to it on your Google Calendar.",
};
const SOURCE: Record<By, string> = { lume_ai: "LUME AI", calendly: "Calendly", google: "Google Calendar" };

const clock = (h: number) => {
  const m = h % 1 ? "30" : "00";
  const w = Math.floor(h);
  return `${w > 12 ? w - 12 : w}:${m}`;
};
const span = (m: Meeting) => `${clock(m.from)} to ${clock(m.to)} ${m.to >= 12 ? "pm" : "am"}`;
const hour = (h: number) => `${h > 12 ? h - 12 : h} ${h >= 12 ? "pm" : "am"}`;

function Mark({ by }: { by: By }) {
  if (by === "lume_ai") return <AiMark small />;
  return (
    <Image
      src={by === "calendly" ? "/brand/calendly.svg" : "/brand/google-calendar.png"}
      alt=""
      width={16}
      height={16}
    />
  );
}

/** Calls booked inside LUME: the week as LUME's Calendar draws it, each call saying how it got there. */
export function Calendar() {
  const [id, setId] = useState("m5");
  const m = MEETINGS.find((k) => k.id === id)!;
  return (
    <section id="calendar" className={x.section} aria-labelledby="cal-h">
      <div className="wrap">
        <div className={x.head}>
          <Scrub id="cal-h" className={x.h2} text="Calls get booked inside LUME, on the times you give it." />
          <p className={x.lede}>
            Tell LUME the days and hours you take calls. When a lead asks for one of them on WhatsApp, LUME AI
            says yes and the call is on the calendar as its reply goes out, with a Google Meet link if you
            want one.
          </p>
        </div>

        <Tilt>
          <div className={s.board}>
            <div className={`${u.window} ${s.week}`}>
              <div className={u.bar}>
                <span className={u.grow}>
                  Calendar <small>November 9 to 14</small>
                </span>
                <span className={s.legend}>
                  {(["lume_ai", "calendly", "google"] as By[]).map((b) => (
                    <span key={b}>
                      <Mark by={b} /> {SOURCE[b]}
                    </span>
                  ))}
                </span>
              </div>
              <div className={s.grid} style={{ ["--rows" as string]: HOURS.length }}>
                <div className={s.times} aria-hidden="true">
                  {HOURS.map((h) => (
                    <span key={h}>{hour(h)}</span>
                  ))}
                </div>
                {DAYS.map(([d, n], di) => (
                  <div key={d} className={s.col} data-today={n === 11}>
                    <div className={s.dayHead}>
                      {d} <b>{n}</b>
                    </div>
                    <div className={s.slots}>
                      {MEETINGS.filter((k) => k.day === di).map((k) => (
                        <button
                          key={k.id}
                          type="button"
                          className={s.meet}
                          data-by={k.by}
                          aria-pressed={k.id === id}
                          aria-label={`Call with ${k.who}, ${LONG[k.day]}, ${span(k)}, from ${SOURCE[k.by]}`}
                          onClick={() => setId(k.id)}
                          style={{
                            top: `${((k.from - FIRST) / HOURS.length) * 100}%`,
                            height: `${((k.to - k.from) / HOURS.length) * 100}%`,
                          }}
                        >
                          <Mark by={k.by} />
                          <span>{k.who}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={s.side}>
              <div className={`${u.window} ${s.drawer}`} aria-live="polite" key={m.id}>
                <div className={s.who}>
                  <Mark by={m.by} />
                  <b>Call with {m.who}</b>
                </div>
                <p className={s.when}>
                  November {DAYS[m.day]![1]}, {LONG[m.day]}, {span(m)}
                </p>
                <p className={s.why}>{WHY[m.by]}</p>
                {m.by === "lume_ai" && (
                  <p className={s.meetLink}>
                    <Image src="/brand/google-meet.png" alt="" width={18} height={18} />
                    Google Meet link made by LUME
                  </p>
                )}
                <div className={s.outcome}>
                  <small>After the call</small>
                  <span className={`${u.pill} ${u.pillOk}`}>Held</span>
                  <span className={`${u.pill} ${u.pillStop}`}>No-show</span>
                  <span className={`${u.pill} ${u.pillWarn}`}>Rescheduled</span>
                </div>
              </div>
              <div className={`${u.window} ${s.times2}`} aria-hidden="true">
                <b>Calls LUME AI may say yes to</b>
                <dl>
                  <div>
                    <dt>Days</dt>
                    <dd>Monday to Saturday</dd>
                  </div>
                  <div>
                    <dt>From and to</dt>
                    <dd>10:00 am to 6:00 pm</dd>
                  </div>
                  <div>
                    <dt>A call is</dt>
                    <dd>30 minutes</dd>
                  </div>
                  <div>
                    <dt>Google Meet link</dt>
                    <dd>
                      <span className={u.switchOn} />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </Tilt>
        <ul className={s.notes}>
          <Rise as="li" delay={0.0}>
            Two leads never get the same slot: LUME checks the time again as it books.
          </Rise>
          <Rise as="li" delay={0.09}>
            Calendly bookings and the meetings on your Google Calendar sit on the same week.
          </Rise>
          <Rise as="li" delay={0.18}>
            A time you didn’t offer is never booked. LUME AI offers the free ones instead.
          </Rise>
        </ul>
      </div>
    </section>
  );
}
