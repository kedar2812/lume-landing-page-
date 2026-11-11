import Image from "next/image";
import { Rise, Scrub } from "@/motion/scroll";
import s from "./whatsapp.module.css";
import x from "./section.module.css";
import u from "./ui.module.css";

const FACTS = [
  [
    "Replies land as they're sent",
    "A lead's message, and the ticks on yours, show in the open chat live. Nobody closes and reopens anything.",
  ],
  [
    "A notice for every message in",
    "Their name, what they wrote and when, in the corner of whatever you're doing. Press it and you're in the chat.",
  ],
  [
    "Templates one tap away",
    "Your templates drop into the reply box filled in for that lead. Past WhatsApp's 24 hours, LUME AI suggests the approved one that fits.",
  ],
  [
    "Photos, videos and PDFs open in LUME",
    "A photo zooms, a video plays, a PDF pages, and every file can be downloaded. The chat stays where it was.",
  ],
];

const Ticks = () => (
  <svg
    viewBox="0 0 18 12"
    width="16"
    height="11"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    aria-hidden="true"
  >
    <path d="m1 6.5 3.2 3.2L11 2.5M7.5 9.2l.6.5L15 2.5" />
  </svg>
);

/** WhatsApp Business inside LUME: the chat as LUME lays it out, and what changes for the team. */
export function Whatsapp() {
  return (
    <section id="whatsapp" className={x.section} aria-labelledby="wa-h">
      <div className={`wrap ${s.split}`}>
        <div className={s.scene} aria-hidden="true">
          <Rise>
            <div className={`${u.window} ${s.chat}`}>
              <div className={u.bar}>
                <span className={`${u.avatar} ${u.a3}`}>MN</span>
                <span className={u.grow}>
                  Meera Nair <small>WhatsApp</small>
                </span>
                <Image src="/brand/whatsapp-glyph-green.svg" alt="" width={20} height={20} />
              </div>
              <div className={u.thread}>
                <div className={`${u.msg} ${u.out}`}>
                  Hi Meera, here is the brochure for the weekend batch.
                  <div className={s.file}>
                    <span>PDF</span>
                    <b>Weekend batch brochure</b>
                    <small>4 pages</small>
                  </div>
                  <div className={u.meta}>
                    11:20 am <Ticks />
                  </div>
                </div>
                <div className={`${u.msg} ${u.in}`}>
                  Thanks, this helps. Can my sister join the same batch?
                  <div className={u.meta}>11:24 am</div>
                </div>
                <div className={`${u.msg} ${u.out}`}>
                  Of course. Two seats are held for you until Friday.
                  <div className={u.meta}>
                    11:25 am <Ticks />
                  </div>
                </div>
                <div className={`${u.msg} ${u.in}`}>
                  Perfect, sending her details now.
                  <div className={u.meta}>11:26 am</div>
                </div>
              </div>
              <div className={s.reply}>
                <span className={s.box}>Write a reply</span>
                <span className={`${u.pill} ${u.pillBlue}`}>Templates</span>
                <span className={s.send}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M3.4 20.4 21 12 3.4 3.6 3.3 10l12 2-12 2z" />
                  </svg>
                </span>
              </div>
            </div>
          </Rise>
          <Rise className={s.noticeIn} delay={0.55}>
            <div className={`${u.window} ${s.notice}`}>
              <span className={`${u.avatar} ${u.a3}`}>MN</span>
              <span className={u.grow}>
                <b>Meera Nair</b>
                <span>Perfect, sending her details now.</span>
              </span>
              <small>now</small>
            </div>
          </Rise>
        </div>

        <div>
          <Scrub id="wa-h" className={x.h2} text="Your WhatsApp Business number, working inside LUME." />
          <p className={`${x.lede} ${s.lede}`}>
            Connect the number your leads already know. Every reply lands on its lead, your team answers from
            LUME, and the WhatsApp Business app keeps working on your phone.
          </p>
          <dl className={s.facts}>
            {FACTS.map(([t, d], i) => (
              <Rise key={t} delay={i * 0.08}>
                <dt>{t}</dt>
                <dd>{d}</dd>
              </Rise>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
