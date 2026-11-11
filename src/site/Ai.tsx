"use client";
import { useState } from "react";
import { Rise, Scrub, Tilt } from "@/motion/scroll";
import { AiMark } from "./Stage";
import s from "./ai.module.css";
import x from "./section.module.css";
import u from "./ui.module.css";

type Case = {
  id: string;
  name: string;
  initials: string;
  a: string;
  state: string;
  tone: string;
  why: string;
  lines: { from: "lead" | "ai"; text: string }[];
  card: { title: string; body: string; kind: "talk" | "ready" | "needs" | "stop" };
};

/** Four leads, four ways a LUME AI conversation ends up: each one is how LUME itself shows it. */
const CASES: Case[] = [
  {
    id: "ready",
    name: "Aanya Kapoor",
    initials: "AK",
    a: u.a1,
    state: "Ready for you",
    tone: u.pillOk,
    why: "Call booked",
    lines: [
      { from: "lead", text: "Yes please. Tomorrow at 5 pm?" },
      {
        from: "ai",
        text: "Tomorrow from 5:00 to 5:30 pm is yours, with Rohan. Here's the link: meet.google.com/lum-calls-eve",
      },
    ],
    card: {
      kind: "ready",
      title: "Ready for you",
      body: "LUME AI booked the call and stepped back. The chat, the meeting and the lead's history are waiting for Rohan.",
    },
  },
  {
    id: "talking",
    name: "Kabir Sethi",
    initials: "KS",
    a: u.a2,
    state: "Talking",
    tone: u.pillBlue,
    why: "Asked about fees",
    lines: [
      { from: "lead", text: "What does the weekend batch cost?" },
      {
        from: "ai",
        text: "The weekend batch is ₹18,000 for the 8 weeks, and that covers the study material. Shall I hold a seat while you decide?",
      },
    ],
    card: {
      kind: "talk",
      title: "LUME AI is on it",
      body: "The fee came from the business's own price list. An amount that isn't on the list is never sent.",
    },
  },
  {
    id: "needs",
    name: "Ishita Rao",
    initials: "IR",
    a: u.a3,
    state: "Needs you",
    tone: u.pillWarn,
    why: "Asked about their health",
    lines: [{ from: "lead", text: "I'm recovering from a knee surgery. Is the programme safe for me?" }],
    card: {
      kind: "needs",
      title: "Needs you",
      body: "A question about someone's own health goes to a person. Nothing was sent; the reply box is ready for you.",
    },
  },
  {
    id: "stopped",
    name: "Neil D'Souza",
    initials: "ND",
    a: u.a5,
    state: "Stopped",
    tone: u.pillStop,
    why: "Said stop",
    lines: [{ from: "lead", text: "Please stop messaging me." }],
    card: {
      kind: "stop",
      title: "LUME AI won't message them again",
      body: "A lead who says stop is left alone until someone on your team lifts it.",
    },
  },
];

const RULES = [
  [
    "Only your prices",
    "LUME AI quotes from your price list. An amount that isn't on the list is held back before it can be sent.",
  ],
  [
    "Only your times",
    "It says yes to a call inside the days and hours you give it, and checks the calendar again as it books.",
  ],
  [
    "A person when it matters",
    "Questions about someone's health, treatment or investments go to your team, with the chat ready to pick up.",
  ],
  [
    "Inside your working hours",
    "Messages go out in the hours you set. Change the hours and the leads that are waiting move with them.",
  ],
];

export function Ai() {
  const [id, setId] = useState("ready");
  const c = CASES.find((k) => k.id === id)!;
  return (
    <section id="lume-ai" className={`${x.section} ${s.section}`} aria-labelledby="ai-h">
      <div className="wrap">
        <div className={x.head}>
          <Scrub
            id="ai-h"
            className={x.h2}
            text="LUME AI replies to your leads, and knows when to hand over."
          />
          <p className={x.lede}>
            Start a run on the leads you choose and LUME AI talks to them on WhatsApp towards the goal you
            set. Every conversation ends in one of four places, and you can see which at a glance.
          </p>
        </div>

        <Tilt>
          <div className={`${u.window} ${s.page}`}>
            <div className={s.list} role="group" aria-label="Four LUME AI conversations">
              <div className={u.bar}>
                <AiMark /> LUME AI <small>Weekend batch run</small>
              </div>
              {CASES.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  aria-pressed={k.id === id}
                  className={s.lead}
                  onClick={() => setId(k.id)}
                >
                  <span className={`${u.avatar} ${k.a}`}>{k.initials}</span>
                  <span className={u.grow}>
                    <b>{k.name}</b>
                    <small>{k.why}</small>
                  </span>
                  <span className={`${u.pill} ${k.tone}`}>{k.state}</span>
                </button>
              ))}
            </div>
            <div className={s.talk} aria-live="polite" key={c.id}>
              <div className={u.bar}>
                <span className={`${u.avatar} ${c.a}`}>{c.initials}</span>
                <span className={u.grow}>{c.name}</span>
                <span className={`${u.pill} ${c.tone}`}>
                  {c.state}, {c.why.toLowerCase()}
                </span>
              </div>
              <div className={`${u.thread} ${s.thread}`}>
                {c.lines.map((l) => (
                  <div key={l.text} className={`${u.msg} ${l.from === "lead" ? u.in : u.out}`}>
                    {l.text}
                    {l.from === "ai" && (
                      <div className={u.meta}>
                        <span className={u.by}>LUME AI</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className={s.card} data-kind={c.card.kind}>
                <b>{c.card.title}</b>
                <p>{c.card.body}</p>
              </div>
            </div>
          </div>
        </Tilt>
        <dl className={s.rules}>
          {RULES.map(([t, d], i) => (
            <Rise key={t} delay={i * 0.09}>
              <dt>{t}</dt>
              <dd>{d}</dd>
            </Rise>
          ))}
        </dl>
      </div>
    </section>
  );
}
