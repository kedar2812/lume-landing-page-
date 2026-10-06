"use client";
import { useRef } from "react";
import { Screen } from "@/components/Screen";
import type { ScreenName } from "@/lib/screens";
import { along, useBuild } from "@/motion/build";
import s from "./notes.module.css";

/**
 * LUME in five notes (owner's redesign, after canvas C's Analytics section): each one plain sentence over LUME's own
 * screen, half under a veil, with a few words of what's in it — enough to want the demo, not the whole manual.
 */
export const NOTES: {
  id: string;
  eyebrow: string;
  title: string;
  chips: string[];
  shot: ScreenName;
  alt: string;
  from?: string;
}[] = [
  {
    id: "one-list",
    eyebrow: "Every source",
    title: "Every enquiry lands in one list.",
    chips: ["Instagram & Facebook forms", "Your website", "Google Sheets", "Calendly"],
    shot: "leads",
    alt: "LUME's leads: every enquiry in one list, with its stage and owner",
  },
  {
    id: "your-day",
    eyebrow: "Today",
    title: "Each person’s day, already planned.",
    chips: ["Who to call first", "What’s overdue", "Today’s calls", "How the month is going"],
    shot: "today-rep",
    alt: "A rep's Today in LUME: their follow-ups, calls and numbers for the day",
  },
  {
    id: "whatsapp",
    eyebrow: "WhatsApp",
    title: "WhatsApp in one tap, their name already in.",
    chips: [
      "Templates that fill themselves",
      "Sent from your own WhatsApp",
      "The next follow-up, set for you",
    ],
    shot: "action-whatsapp",
    alt: "A WhatsApp template in LUME with the lead's details filled in, ready to send",
  },
  {
    id: "analytics",
    eyebrow: "Analytics",
    title: "Analytics that read like a colleague’s note.",
    chips: [
      "Speed pays off",
      "Referrals punch above their weight",
      "Webinars cost more than they return",
      "Most leads arrive after 7 pm",
    ],
    shot: "overview",
    alt: "LUME's Analytics overview: new leads, replies, calls, wins and revenue against the month before",
    from: "From the demo business",
  },
  {
    id: "team",
    eyebrow: "Your team",
    title: "Every rep gets their own scoreboard.",
    chips: ["Their own Today", "Their own numbers and goals", "The Team board, for you", "Who needs a hand"],
    shot: "team",
    alt: "LUME's Team board: each rep's speed, replies, wins and follow-ups side by side",
  },
];

function Note({ n }: { n: (typeof NOTES)[number] }) {
  const ref = useRef<HTMLElement>(null);
  const p = useBuild(ref);
  const card = along(p, 0, 0.7);
  const words = along(p, 0.35, 0.6);
  return (
    <section ref={ref} id={n.id} className={s.note} aria-labelledby={`${n.id}-h`}>
      <div className="wrap">
        <div
          className={s.card}
          data-build=""
          style={{
            transform: `translateY(${48 * (1 - card)}px) scale(${0.95 + 0.05 * card})`,
            opacity: 0.3 + 0.7 * card,
          }}
        >
          <Screen name={n.shot} alt={n.alt} className={s.shot} />
          <div className={s.veil}>
            <div data-build="" style={{ transform: `translateY(${24 * (1 - words)}px)`, opacity: words }}>
              <p className={s.eyebrow}>{n.eyebrow}</p>
              <h2 id={`${n.id}-h`} className={s.h}>
                {n.title}
              </h2>
              <ul className={s.chips}>
                {n.chips.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              {n.from && <p className={s.from}>{n.from}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Notes() {
  return (
    <>
      {NOTES.map((n) => (
        <Note key={n.id} n={n} />
      ))}
    </>
  );
}
