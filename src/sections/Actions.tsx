"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import { Screen } from "@/components/Screen";
import { Solves } from "@/components/Solves";
import type { ScreenName } from "@/lib/screens";
import x from "./section.module.css";
import s from "./actions.module.css";

/** The nine real things a team does in LUME (website spec §5.1), each with its key and the capture of it. */
export const ACTIONS: { label: string; key?: string; shot: ScreenName; alt: string }[] = [
  {
    label: "Send a WhatsApp template, filled in",
    key: "W",
    shot: "action-whatsapp",
    alt: "A lead in LUME with the WhatsApp templates open, the lead's details filled in",
  },
  {
    label: "Log a call and how it went",
    key: "C",
    shot: "action-call",
    alt: "Logging a call in LUME: how it went and what happens next",
  },
  {
    label: "Set the next follow-up",
    key: "F",
    shot: "action-follow-up",
    alt: "Setting the next follow-up: when, a reminder, and repeat",
  },
  { label: "Win a deal", shot: "action-won", alt: "Marking a deal won in LUME, with its value and package" },
  {
    label: "Assign everyone who matches, with Undo",
    shot: "action-bulk",
    alt: "Thousands of leads selected in LUME, ready to assign to one person",
  },
  {
    label: "Message 50 leads, one after another",
    key: "P · S",
    shot: "action-queue",
    alt: "Starting a WhatsApp send queue: a template picked for the selected leads",
  },
  {
    label: "Move a deal along the pipeline",
    shot: "pipeline",
    alt: "LUME's pipeline board, deals in each stage",
  },
  {
    label: "Find anyone by name, phone or email",
    key: "Ctrl K",
    shot: "action-search",
    alt: "Searching LUME: leads found as you type",
  },
  {
    label: "Open the leads behind any number",
    shot: "action-drill",
    alt: "Analytics: the leads behind a number, open in a sheet",
  },
];

/**
 * What your team does in LUME (website spec §5, item 6): a list of real actions beside the capture of each. One
 * Tab stop; arrows, Home and End move along it (LUME's own keyboard habit).
 */
export function Actions() {
  const [at, setAt] = useState(0);
  const tabs = useRef<HTMLDivElement>(null);
  const move = (to: number) => {
    const n = (to + ACTIONS.length) % ACTIONS.length;
    setAt(n);
    tabs.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[n]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const step =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? -1
          : 0;
    if (step) move(at + step);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(ACTIONS.length - 1);
    else return;
    e.preventDefault();
  };
  const a = ACTIONS[at]!;
  return (
    <section id="actions" className={x.section} aria-labelledby="actions-h">
      <div className="wrap">
        <Solves n={3} />
        <h2 id="actions-h" className={x.h2}>
          What your team does in LUME.
        </h2>
        <div className={s.grid}>
          <div
            ref={tabs}
            role="tablist"
            aria-label="What your team does in LUME"
            aria-orientation="vertical"
            className={s.list}
            onKeyDown={onKey}
          >
            {ACTIONS.map((act, i) => (
              <button
                key={act.label}
                type="button"
                role="tab"
                id={`action-tab-${i}`}
                aria-selected={i === at}
                aria-controls="action-panel"
                tabIndex={i === at ? 0 : -1}
                className={s.tab}
                onClick={() => setAt(i)}
              >
                <span className={s.n}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.label}>{act.label}</span>
                {act.key && <kbd className={s.key}>{act.key}</kbd>}
              </button>
            ))}
          </div>
          <div id="action-panel" role="tabpanel" aria-labelledby={`action-tab-${at}`} className={s.panel}>
            <div key={a.shot} className={s.shot}>
              <Screen name={a.shot} alt={a.alt} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
