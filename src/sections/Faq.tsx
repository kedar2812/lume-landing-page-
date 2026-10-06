import x from "./section.module.css";
import s from "./faq.module.css";

/**
 * The questions people ask before they enquire (website spec §5, item 14). Native disclosure: works with the
 * keyboard and without JavaScript; one open at a time where the browser supports exclusive groups.
 */
const QA: [string, string][] = [
  [
    "Do I need the WhatsApp Business API?",
    "No. LUME opens your own WhatsApp with the message already written, so there's no API to set up and no per-message charge through LUME. You keep the WhatsApp you use today.",
  ],
  [
    "Can I bring my Excel sheet?",
    "Yes. Import a CSV or a Google Sheet; LUME matches your columns, catches duplicates and fixes phone numbers as it goes.",
  ],
  [
    "Where does my data live?",
    "On your own server. Every business runs its own LUME; nothing is shared with other businesses, and integrations stay off until you switch them on.",
  ],
  [
    "What happens when a salesperson leaves?",
    "Their leads and follow-ups move to someone else in one step, and their access ends. While they're with you, a rep sees only what their role allows, and every export is traceable.",
  ],
];

export function Faq() {
  return (
    <section id="faq" className={x.section} aria-labelledby="faq-h">
      <div className={`wrap ${s.wrap}`}>
        <div>
          <p className={x.eyebrow}>Questions</p>
          <h2 id="faq-h" className={x.h2}>
            What people ask first.
          </h2>
        </div>
        <div className={s.list}>
          {QA.map(([q, a]) => (
            <details key={q} name="faq" className={s.item}>
              <summary className={s.q}>
                <span>{q}</span>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className={s.a}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
