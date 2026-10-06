"use client";
import Image from "next/image";
import { useId, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { enquirySchema, TEAM_SIZES } from "@/lib/enquiry";
import s from "./enquire.module.css";

type Key = "name" | "business" | "whatsapp" | "email" | "teamSize" | "how" | "form";
type Errors = Partial<Record<Key, string>>;
const noop = () => () => undefined;
/** Back from a form posted without JavaScript (/?sent=1). */
const sentBefore = () => new URLSearchParams(window.location.search).get("sent") === "1";

/**
 * The enquiry (website spec §5, item 15): five fields and one optional line. A plain form that posts to
 * /api/enquire (so it works without JavaScript), sent with fetch when it can. If both of the server's ways are
 * down, WhatsApp opens with the visitor's details written.
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
  const field = (name: Key, label: string, input: ReactNode, wide = false) => (
    <div className={`${s.field} ${wide ? s.wide : ""}`} data-invalid={errors[name] ? "" : undefined}>
      <label htmlFor={`${id}-${name}`}>{label}</label>
      {input}
      {errors[name] && (
        <p id={`${id}-${name}-err`} className={s.err}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <section id="enquire" className={s.section} aria-labelledby={`${id}-h`}>
      <div className="wrap">
        <div className={s.panel}>
          <div className={s.copy}>
            <h2 id={`${id}-h`} className={s.h}>
              See LUME on your own leads.
            </h2>
            <p className={s.lede}>
              Tell LUME a little about your business. LUME’s founder will set up a walkthrough around how your
              team sells.
            </p>
            <a className={s.wa} href={`https://wa.me/${whatsapp}`}>
              <Image src="/brand/whatsapp-glyph-white.svg" alt="" width={22} height={22} />
              Or message {shown}
            </a>
          </div>
          {state === "sent" || returned ? (
            <div className={s.sent} role="status">
              <svg
                viewBox="0 0 24 24"
                width="40"
                height="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m7.5 12.5 3 3 6-6.5" />
              </svg>
              <p className={s.sentTitle}>Thank you.</p>
              <p>LUME’s founder will message you on WhatsApp soon.</p>
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
              {field(
                "whatsapp",
                "WhatsApp number",
                <input {...aria("whatsapp")} type="tel" inputMode="tel" autoComplete="tel" />,
              )}
              {field(
                "email",
                "Email (optional)",
                <input {...aria("email")} type="email" autoComplete="email" />,
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
