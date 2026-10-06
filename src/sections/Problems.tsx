import { Reveal } from "@/motion/Reveal";
import x from "./section.module.css";
import s from "./problems.module.css";

/**
 * Chapter 1, the problems (website spec §5.0): six things a sales-led business lives with today, numbered so each
 * of LUME's answers can say which one it solves. The one study the site quotes sits with the problem it proves.
 */
export const PROBLEMS = [
  {
    title: "Your leads are in five places.",
    body: "Instagram DMs, a Google Form, a spreadsheet, a notebook at the front desk, someone’s phone. Nobody sees them all.",
  },
  {
    title: "The first reply comes days later.",
    body: "By the time someone gets back, the lead has asked three other businesses — and one of them answered first.",
  },
  {
    title: "Follow-ups slip through the cracks.",
    body: "No reminder, no owner, no next step written down. A warm lead goes quiet and nobody notices.",
  },
  {
    title: "You can’t see who’s doing the work.",
    body: "Who called back, who’s behind, who’s closing — you find out at the end of the month, if at all.",
  },
  {
    title: "You don’t know which leads and ads pay.",
    body: "Money goes into Instagram, webinars and walk-ins. Which ones actually turn into customers is a guess.",
  },
  {
    title: "When a salesperson leaves, the leads leave too.",
    body: "Their phone, their WhatsApp chats, their spreadsheet — gone with them, to whoever they work for next.",
  },
] as const;

export function Problems() {
  return (
    <section id="problems" className={x.section} aria-labelledby="problems-h">
      <div className="wrap">
        <p className={x.eyebrow}>Chapter 1 · The problems</p>
        <h2 id="problems-h" className={x.h2}>
          Sound familiar?
        </h2>
        <p className={x.lede}>
          Most businesses don’t lose leads for want of enquiries. They lose them between the enquiry and the
          reply.
        </p>
        <ol className={s.grid} aria-label="The problems">
          {PROBLEMS.map((p, i) => {
            const n = String(i + 1).padStart(2, "0");
            return (
              <Reveal as="li" key={p.title} id={`problem-${n}`} delay={(i % 3) * 90} className={s.card}>
                <span className={s.n} aria-hidden="true">
                  {n}
                </span>
                <h3 className={s.title}>{p.title}</h3>
                <p className={s.body}>{p.body}</p>
                {i === 1 && (
                  <p className={s.stat}>
                    <span className={s.big}>21×</span>
                    <span>
                      more likely to qualify a web lead reached within 5 minutes than within 30.
                      <sup>
                        <a href="#problem-source" aria-label="Source">
                          1
                        </a>
                      </sup>
                    </span>
                  </p>
                )}
              </Reveal>
            );
          })}
        </ol>
        <p id="problem-source" className={s.source}>
          1. Oldroyd, Lead Response Management Study, MIT and InsideSales, 2007.
        </p>
      </div>
    </section>
  );
}
