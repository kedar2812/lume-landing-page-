"use client";
import Image from "next/image";
import { useId, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { COUNTRIES, DIAL, flagOf } from "@/lib/countries";
import { enquirySchema, TEAM_SIZES } from "@/lib/enquiry";
import s from "./enquire.module.css";

type Key = "name" | "business" | "country" | "whatsapp" | "email" | "teamSize" | "how" | "form";
type Errors = Partial<Record<Key, string>>;
const noop = () => () => undefined;
/** Back from a form posted without JavaScript (/?sent=1). */
const sentBefore = () => new URLSearchParams(window.location.search).get("sent") === "1";

/**
 * The enquiry (owner's redesign): seven questions in one calm card, the country code picked from every country so
 * the number lands on the licence dashboard whole. A plain form that posts to /api/enquire (it works without
 * JavaScript), sent with fetch when it can; if the dashboard is down, WhatsApp opens with the details written.
 * LUME speaks, never a person.
 */
export function Enquire({
  whatsapp,
  go = (url: string) => window.location.assign(url),
}: {
  whatsapp: string;
  go?: (url: string) => void;
}) {
  const id = useId();
  const [t0] = useState(() => Date.now());
  const [errors, setErrors] = useState<Errors>({});
  const [team, setTeam] = useState("");
  const [country, setCountry] = useState("IN");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const returned = useSyncExternalStore(noop, sentBefore, () => false);
  const shown = whatsapp.replace(/^91(\d{5})(\d{5})$/, "+91 $1 $2");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const p = enquirySchema.safeParse(data);
    if (!p.success) {
      const next: Errors = {};
      for (const i of p.error.issues) next[String(i.path[0]) as Key] ??= i.message;
      setErrors(next);
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    setState("sending");
    try {
      const r = await fetch("/api/enquire", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ ...data, t: Date.now() - t0 }),
      });
      const body = (await r.json()) as { ok?: boolean; whatsapp?: string; errors?: Errors };
      if (body.ok) return setState("sent");
      if (body.whatsapp) return go(body.whatsapp);
      setErrors(body.errors ?? { form: "That didn't go through. Try again, or message on WhatsApp." });
    } catch {
      setErrors({ form: "LUME couldn't reach its server. Try again, or message on WhatsApp." });
    }
    setState("idle");
  }

  const aria = (name: Key) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-err` : undefined,
  });
  const err = (name: Key) =>
    errors[name] && (
      <p id={`${id}-${name}-err`} className={s.err}>
        {errors[name]}
      </p>
    );
  const field = (name: Key, label: string, input: ReactNode, wide = false) => (
    <div className={`${s.field} ${wide ? s.wide : ""}`} data-invalid={errors[name] ? "" : undefined}>
      <label htmlFor={`${id}-${name}`}>{label}</label>
      {input}
      {err(name)}
    </div>
  );

  return (
    <section id="enquire" className={s.section} aria-labelledby={`${id}-h`}>
      <div className={`wrap ${s.grid}`}>
        <div className={s.copy}>
          <p className={s.eyebrow}>Book a demo</p>
          <h2 id={`${id}-h`} className={s.h}>
            See LUME on your own leads.
          </h2>
          <p className={s.lede}>
            Tell LUME about your business and how leads reach you. LUME replies on WhatsApp to set up a demo
            shaped around how your team sells.
          </p>
          <ul className={s.promise}>
            <li>One short form</li>
            <li>No payment details</li>
            <li>Your number is used only to reply</li>
          </ul>
          <a className={s.wa} href={`https://wa.me/${whatsapp}`}>
            <Image src="/brand/whatsapp-glyph-white.svg" alt="" width={20} height={20} />
            Message on WhatsApp
            <span className={s.num}>{shown}</span>
          </a>
        </div>
        <div className={s.card}>
          {state === "sent" || returned ? (
            <div className={s.sent} role="status">
              <span className={s.tick} aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                >
                  <path d="m6.5 12.5 3.5 3.5 7.5-8" />
                </svg>
              </span>
              <p className={s.sentTitle}>Thank you.</p>
              <p>LUME will reply on WhatsApp to set up your demo.</p>
            </div>
          ) : (
            <form
              className={s.form}
              action="/api/enquire"
              method="post"
              aria-label="Book a demo"
              noValidate
              onSubmit={submit}
            >
              {field("name", "Your name", <input {...aria("name")} autoComplete="name" />)}
              {field("business", "Business", <input {...aria("business")} autoComplete="organization" />)}
              <div className={`${s.field} ${s.wide}`} data-invalid={errors.whatsapp ? "" : undefined}>
                <div className={s.phoneLabels}>
                  <label htmlFor={`${id}-country`}>Country code</label>
                  <label htmlFor={`${id}-whatsapp`}>WhatsApp number</label>
                </div>
                <div className={s.phone}>
                  {/* The picker shows a flag and code; the native list holds every country. */}
                  <span className={s.code}>
                    <span aria-hidden="true">{flagOf(country)}</span>
                    <span data-testid="dial">+{DIAL[country]}</span>
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                    <select
                      {...aria("country")}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      autoComplete="tel-country-code"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.iso} value={c.iso}>
                          {c.name} (+{c.dial})
                        </option>
                      ))}
                    </select>
                  </span>
                  <input
                    {...aria("whatsapp")}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder={country === "IN" ? "98123 45678" : ""}
                  />
                </div>
                {err("whatsapp")}
              </div>
              {field(
                "email",
                "Email (optional)",
                <input {...aria("email")} type="email" autoComplete="email" />,
                true,
              )}
              <fieldset className={`${s.field} ${s.wide}`} data-invalid={errors.teamSize ? "" : undefined}>
                <legend id={`${id}-team`}>Team size</legend>
                <div role="radiogroup" aria-labelledby={`${id}-team`} className={s.chips}>
                  {TEAM_SIZES.map((t) => (
                    <label key={t.id} className={s.chip}>
                      <input
                        type="radio"
                        name="teamSize"
                        value={t.id}
                        checked={team === t.id}
                        onChange={() => setTeam(t.id)}
                        aria-label={t.label}
                      />
                      <span aria-hidden="true">{t.label}</span>
                    </label>
                  ))}
                </div>
                {errors.teamSize && <p className={s.err}>{errors.teamSize}</p>}
              </fieldset>
              {field(
                "how",
                "How do leads reach you today? (optional)",
                <input {...aria("how")} placeholder="Instagram, a Google Form, walk-ins…" />,
                true,
              )}
              {/* For bots only: people never see it. */}
              <label className="sr-only" aria-hidden="true">
                Leave this empty
                <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
              </label>
              <input type="hidden" name="t" value="5000" />
              {errors.form && (
                <p className={`${s.err} ${s.wide}`} role="alert">
                  {errors.form}
                </p>
              )}
              <button className={`${s.send} ${s.wide}`} type="submit" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Book my demo"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
