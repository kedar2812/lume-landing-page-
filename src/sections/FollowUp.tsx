import Image from "next/image";
import { Screen } from "@/components/Screen";
import { Solves } from "@/components/Solves";
import { Reveal } from "@/motion/Reveal";
import x from "./section.module.css";
import s from "./followup.module.css";

const TICKS = [
  "WhatsApp templates with the lead’s details filled in",
  "Stage rules that set the next follow-up for you",
  "Calls from your calendar, on the lead they belong to",
];

/** Follow-up on WhatsApp (website spec §5, item 5; canvas A): Today's Up next, and a message ready to send. */
export function FollowUp() {
  return (
    <section id="follow-up" className={x.section} aria-labelledby="follow-up-h">
      <div className={`wrap ${s.row}`}>
        <div className={s.copy}>
          <Solves n={2} />
          <h2 id="follow-up-h" className={x.h2}>
            Nobody waits. Nothing slips.
          </h2>
          <p className={x.lede}>
            The next follow-up is always on the right person’s Today, with the lead one tap away. Pick a
            template, LUME fills in the name, and WhatsApp opens ready to send. A lead nobody touches comes
            back by itself.
          </p>
          <ul className={s.ticks}>
            {TICKS.map((t) => (
              <li key={t}>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <Reveal className={s.shot} y={40}>
          <Screen
            name="today"
            alt="LUME's Today: overdue and upcoming follow-ups, today's calls, and how the business is doing"
            className={s.frame}
          />
          <div className={s.bubble}>
            <span className={s.bubbleHead}>
              <Image src="/brand/whatsapp.svg" alt="" width={18} height={18} />
              WhatsApp · ready to send
            </span>
            <p>
              Hi Ananya, thanks for asking about the wedding package. Is Thursday at 4 good for a quick call?
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
