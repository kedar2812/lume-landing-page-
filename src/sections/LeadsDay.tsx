import { Reveal } from "@/motion/Reveal";
import x from "./section.module.css";
import s from "./leadsday.module.css";

/** A lead's day in LUME (website spec §5, item 7; canvas B): one enquiry, from the form to won. */
const STEPS = [
  {
    when: "9:02 am",
    title: "A form is filled",
    body: "Instagram, your website or a sheet. LUME files it, spots a duplicate, fixes the phone number.",
  },
  {
    when: "9:03 am",
    title: "The right person knows",
    body: "It lands on their Today with the first follow-up already set.",
  },
  {
    when: "9:05 am",
    title: "WhatsApp in one tap",
    body: "A template with their name in it, sent from your own WhatsApp.",
  },
  {
    when: "Thursday, 4 pm",
    title: "The call, then won",
    body: "The booked call sits on the lead. Log how it went; the deal counts in that day's numbers.",
  },
];

export function LeadsDay() {
  return (
    <section id="day" className={x.section} aria-labelledby="day-h">
      <div className="wrap">
        <p className={x.eyebrow}>A lead’s day in LUME</p>
        <h2 id="day-h" className={x.h2}>
          From “I’m interested” to won, without a sticky note.
        </h2>
        <ol className={s.steps}>
          {STEPS.map((st, i) => (
            <Reveal
              as="li"
              key={st.title}
              delay={i * 110}
              className={`${s.step} ${i === STEPS.length - 1 ? s.won : ""}`}
            >
              <span className={s.when}>{st.when}</span>
              <h3>{st.title}</h3>
              <p>{st.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
