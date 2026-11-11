"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { LAST, LEAD, LINES, PHASES, STEPS, nextStep } from "./stage-script";
import s from "./stage.module.css";
import u from "./ui.module.css";

const OTHERS = [
  {
    initials: "VS",
    name: "Vikram Shah",
    source: "Website form",
    pill: "Follow-up today",
    tone: u.pillWarn,
    a: u.a2,
  },
  { initials: "MN", name: "Meera Nair", source: "Google Sheet", pill: "Talking", tone: u.pillBlue, a: u.a3 },
  {
    initials: "DM",
    name: "Dev Malhotra",
    source: "Calendly",
    pill: "Call booked",
    tone: u.pillBlue,
    a: u.a4,
  },
  { initials: "SF", name: "Sara Fernandes", source: "Instagram", pill: "Won", tone: u.pillOk, a: u.a5 },
];
const HOURS = ["3 pm", "4 pm", "5 pm", "6 pm"];

export function AiMark({ small }: { small?: boolean }) {
  return (
    <span className={`${u.ai} ${small ? u.aiSm : ""}`}>
      <Image src="/brand/lume-ai-mark.svg" alt="" width={18} height={18} />
    </span>
  );
}

/**
 * The hero's live scene: LUME's window with a lead arriving, LUME AI answering them on WhatsApp, and the call
 * landing on the calendar. It plays only while it's on screen; with reduced motion it shows the finished scene.
 */
export function Stage({ active = true }: { active?: boolean }) {
  const still = useReducedMotion();
  const [i, setI] = useState(LAST);
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || still) return;
    const io = new IntersectionObserver(([e]) => setSeen(Boolean(e?.isIntersecting)), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [still]);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!seen || !active || still) return;
    if (!started) {
      const t = window.setTimeout(() => {
        setStarted(true);
        setI(0);
      }, 700);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setI(nextStep), STEPS[i]!.ms);
    return () => window.clearTimeout(t);
  }, [i, seen, active, still, started]);

  const st = STEPS[still ? LAST : i]!;
  return (
    <div className={s.stage} ref={box}>
      <div className={`${u.window} ${s.win}`} aria-hidden="true">
        <div className={s.leads}>
          <div className={u.bar}>
            Leads <small>5 today</small>
          </div>
          <ul className={s.rows}>
            <li className={`${s.row} ${s.new}`} data-on={st.arrived} data-open={st.arrived}>
              <span className={`${u.avatar} ${u.a1}`}>{LEAD.initials}</span>
              <span className={u.grow}>
                <b>{LEAD.name}</b>
                <small>{LEAD.source}</small>
              </span>
              <span className={`${u.pill} ${st.booked ? u.pillBlue : u.pillOk}`}>
                {st.booked ? "Call booked" : "New"}
              </span>
            </li>
            {OTHERS.map((o) => (
              <li key={o.name} className={s.row}>
                <span className={`${u.avatar} ${o.a}`}>{o.initials}</span>
                <span className={u.grow}>
                  <b>{o.name}</b>
                  <small>{o.source}</small>
                </span>
                <span className={`${u.pill} ${o.tone}`}>{o.pill}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={s.chat}>
          <div className={u.bar} data-on={st.arrived}>
            <span className={`${u.avatar} ${u.a1}`}>{LEAD.initials}</span>
            <span className={u.grow}>
              {LEAD.name} <small>WhatsApp</small>
            </span>
            <span className={`${u.pill} ${u.pillBlue}`}>
              <AiMark small /> LUME AI is on it
            </span>
          </div>
          <div className={`${u.thread} ${s.thread}`}>
            {LINES.slice(0, st.lines).map((l) => (
              <div key={l.text} className={`${u.msg} ${l.from === "lead" ? u.in : u.out} ${s.pop}`}>
                {l.text}
                {l.link && (
                  <>
                    {" "}
                    <span className={u.link}>{l.link}</span>
                  </>
                )}
                <div className={u.meta}>
                  {l.from === "ai" && <span className={u.by}>LUME AI</span>}
                  {l.time}
                </div>
              </div>
            ))}
            {st.typing && (
              <div className={`${u.typing} ${s.pop}`}>
                <i />
                <i />
                <i />
              </div>
            )}
          </div>
        </div>

        <div className={s.cal}>
          <div className={u.bar}>
            <span className={u.grow}>
              Calendar <small>November 12, Thursday</small>
            </span>
          </div>
          <div className={s.day}>
            {HOURS.map((h) => (
              <div key={h} className={s.hour}>
                <span>{h}</span>
              </div>
            ))}
            <div className={`${s.event} ${s.eventQuiet}`} style={{ top: "12.5%", height: "25%" }}>
              <b>Call with Dev Malhotra</b>
              <small>3:30 to 4:30 pm, Calendly</small>
            </div>
            <div
              className={`${s.event} ${s.eventNew}`}
              data-on={st.booked}
              style={{ top: "50%", height: "12.5%" }}
            >
              <b>
                <AiMark small /> Call with {LEAD.name}
              </b>
              <small>5:00 to 5:30 pm, Google Meet</small>
            </div>
          </div>
          <div className={s.bell} data-on={st.booked}>
            <AiMark />
            <span>
              <b>LUME AI booked a call</b>
              <small>{LEAD.name}, tomorrow at 5:00 pm</small>
            </span>
          </div>
        </div>
      </div>

      <ol className={s.phases}>
        {PHASES.map((p, n) => (
          <li key={p} data-now={st.phase === n} data-done={st.phase > n}>
            <span className={s.track}>
              <span />
            </span>
            {p}
          </li>
        ))}
      </ol>
      <p className="sr-only">
        A lead writes in on WhatsApp, LUME AI answers within the minute, and a call for the next day at 5 pm
        is booked on the calendar with a Google Meet link.
      </p>
    </div>
  );
}
