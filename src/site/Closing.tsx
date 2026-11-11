import Image from "next/image";
import Link from "next/link";
import { Rise, Scrub } from "@/motion/scroll";
import { Band, Lift } from "./ClosingMotion";
import s from "./closing.module.css";
import x from "./section.module.css";

const OWN = [
  "Every business runs its own LUME. Nothing is shared with any other.",
  "Google Sheets, Calendly, Google Calendar and WhatsApp stay off until you switch them on.",
  "Your leads leave your server only for the integrations you chose.",
];

/** Where the data lives, said once and large: it's the question every owner asks before the demo. */
export function Own() {
  return (
    <Band className={`${x.section} ${s.own}`} labelledBy="own-h">
      <div className="wrap">
        <Scrub id="own-h" className={s.statement} text="Your own LUME, on your own server." />
        <ul className={s.ownList}>
          {OWN.map((t, i) => (
            <Rise as="li" key={t} delay={i * 0.1}>
              {t}
            </Rise>
          ))}
        </ul>
      </div>
    </Band>
  );
}

const QA: [string, string][] = [
  [
    "Do I need the WhatsApp Business API to start?",
    "No. From day one LUME opens your own WhatsApp with the message already written, so there's nothing to set up and no per-message charge through LUME. Connecting your WhatsApp Business number is the next step up, when you want replies and LUME AI inside LUME.",
  ],
  [
    "How do my leads' WhatsApp replies come into LUME?",
    "You connect the WhatsApp Business number you already use. Every reply a lead sends lands on that lead in LUME, your team answers from LUME, and the WhatsApp Business app keeps working on your phone. This goes live for each business once Meta approves LUME's WhatsApp connection, which is in review now. Meta's own charges for business messages apply to messages sent this way.",
  ],
  [
    "What will LUME AI never do?",
    "Quote a price that isn't in your price list, book a time you didn't offer, answer a question about someone's health, treatment or investments, or message a lead who said stop. In each of those cases the lead goes to a person on your team, or is left alone.",
  ],
  [
    "Can a person take over from LUME AI?",
    "At any point. Open the chat and reply, and the conversation is yours. Hand it back with one press when you want LUME AI to carry on.",
  ],
  [
    "Can I bring my Excel sheet?",
    "Yes. Import a CSV or a Google Sheet; LUME matches your columns, catches duplicates and fixes phone numbers as it goes.",
  ],
  [
    "What happens when a salesperson leaves?",
    "Their leads and follow-ups move to someone else in one step, and their access ends. While they're with you, a rep sees only what their role allows, and every export is traceable.",
  ],
];

/** The questions people ask before they enquire. Native disclosure: keyboard and no-JavaScript safe. */
export function Faq() {
  return (
    <section id="questions" className={x.section} aria-labelledby="faq-h">
      <div className={`wrap ${s.faq}`}>
        <Scrub id="faq-h" className={x.h2} text="Asked before every demo." />
        <div>
          {QA.map(([q, a]) => (
            <details key={q} name="faq" className={s.item}>
              <summary>
                <span>{q}</span>
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The foot of every page: Google's Limited Use statement (as verified), the documents, the owner. */
export function Footer() {
  return (
    <footer className={s.foot}>
      <div className="wrap">
        <div className={s.footTop}>
          <p className={s.google}>
            Continue with Google is optional. It lets you import the Google Sheets you pick in Google’s own
            picker, and shows your meetings with leads from calendars you own. Only if you switch on Google
            Meet links does LUME add the calls LUME AI books to a “LUME calls” calendar of its own, with a
            Meet link; it never changes your own calendars or events. See the{" "}
            <Link href="/privacy">privacy policy</Link> for exactly what LUME reads and adds. LUME’s use of
            information received from Google APIs adheres to the{" "}
            <a href="https://developers.google.com/terms/api-services-user-data-policy">
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
          <nav aria-label="Documents" className={s.docs}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href="mailto:hello@lumecrm.in">hello@lumecrm.in</a>
          </nav>
        </div>
        <Lift className={s.word}>
          <Image src="/lume-mark.png" alt="" width={2309} height={2485} />
          LUME
        </Lift>
        <p className={s.copy}>© 2026 LUME. Kedar Uttam Gurav.</p>
      </div>
    </footer>
  );
}
