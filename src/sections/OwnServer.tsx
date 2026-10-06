"use client";
import { Counter } from "@/components/Counter";
import { Reveal } from "@/motion/Reveal";
import x from "./section.module.css";
import s from "./ownserver.module.css";

const int = (n: number) => n.toLocaleString("en-US");
const ms = (n: number) => `${n} ms`;

/**
 * Your own LUME, and how fast it is (website spec §5, item 13): an own server, and three numbers measured on a
 * million leads (LUME's docs/runbooks/performance.md), counting up once.
 */
export function OwnServer() {
  return (
    <section id="private" className={x.section} aria-labelledby="private-h">
      <div className="wrap">
        <p className={x.eyebrow}>Your server, your data</p>
        <h2 id="private-h" className={x.h2}>
          Your leads never sit in someone else’s database.
        </h2>
        <div className={s.grid}>
          <Reveal className={x.card}>
            <svg
              className={x.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="7" rx="2" />
              <rect x="3" y="13" width="18" height="7" rx="2" />
              <path d="M7 7.5h.01M7 16.5h.01" />
            </svg>
            <h3>A LUME of your own</h3>
            <p>
              Each business runs its own LUME on its own server. Lead data goes nowhere you haven’t switched
              on.
            </p>
          </Reveal>
          <Reveal className={x.card} delay={100}>
            <svg
              className={x.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12h4l3-8 4 16 3-8h4" />
            </svg>
            <h3>Fast at a million leads</h3>
            <p>
              Built for 5,000 new leads a day. Measured, not promised: its busiest screens tested with a
              million leads on file.
            </p>
          </Reveal>
        </div>
        <dl className={s.stats}>
          <div>
            <dt>leads, tested</dt>
            <dd>
              <Counter value={1_000_000} format={int} />
            </dd>
          </div>
          <div>
            <dt>to open Today at that size</dt>
            <dd>
              <Counter value={8} format={ms} />
            </dd>
          </div>
          <div>
            <dt>leads in one bulk action, with Undo</dt>
            <dd>
              <Counter value={50_000} format={int} />
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
