"use client";
import Image from "next/image";
import { useId, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { enquirySchema, TEAM_SIZES } from "@/lib/enquiry";
import s from "./enquire.module.css";

type Key = "name" | "business" | "whatsapp" | "email" | "teamSize" | "how" | "form";
type Errors = Partial<Record<Key, string>>;
const FIRST: Key[] = ["name", "whatsapp"];
const noop = () => () => undefined;
/** Back from a form posted without JavaScript (/?sent=1). */
const sentBefore = () => new URLSearchParams(window.location.search).get("sent") === "1";

/**
 * The enquiry (owner's redesign): two short steps — who you are, then your business. Without JavaScript it is one
 * plain form that posts to /api/enquire; with it, sent with fetch. If both of the server's ways are down,
 * WhatsApp opens with the visitor's details written.
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
  const [step, setStep] = useState<1 | 2>(1);
  const js = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const returned = useSyncExternalStore(noop, sentBefore, () => false);
  const shown = whatsapp.replace(/^91(\d{5})(\d{5})$/, "+91 $1 $2");

  const focus = (form: HTMLFormElement, name: string) =>
    requestAnimationFrame(() => form.querySelector<HTMLElement>(`[name="${name}"]`)?.focus());

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const p = enquirySchema.safeParse(data);
    if (!p.success) {
      const next: Errors = {};
      for (const i of p.error.issues) next[String(i.path[0]) as Key] ??= i.message;
      setErrors(next);
      if (Object.keys(next).some((k) => FIRST.includes(k as Key))) setStep(1);
      focus(form, Object.keys(next)[0]!);
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

  /** Step one asks only who you are; the rest waits until that's right. */
  function next(form: HTMLFormElement | null) {
    if (!form) return;
    const p = enquirySchema.safeParse(Object.fromEntries(new FormData(form).entries()));
    const mine: Errors = {};
    if (!p.success)
      for (const i of p.error.issues)
        if (FIRST.includes(String(i.path[0]) as Key)) mine[String(i.path[0]) as Key] ??= i.message;
    setErrors(mine);
    if (Object.keys(mine).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(mine)[0]}"]`)?.focus();
      return;
    }
    setStep(2);
    focus(form, "business");
  }

  const aria = (name: Key) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-err` : undefined,
  });
  const field = (name: Key, label: string, input: ReactNode) => (
    <div className={s.field} data-invalid={errors[name] ? "" : undefined}>
      <label htmlFor={`${id}-${name}`}>{label}</label>
      {input}
      {errors[name] && (
        <p id={`${id}-${name}-err`} className={s.err}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  // Without JavaScript both steps show as one form; with it, one step at a time.
  const hideFirst = js && step === 2;
  const hideSecond = js && step === 1;
  return (
    <section id="enquire" className={s.section} aria-labelledby={`${id}-h`}>
      <div className={`wrap ${s.grid}`}>
        <div className={s.copy}>
          <p className={s.eyebrow}>Book a demo</p>
          <h2 id={`${id}-h`} className={s.h}>
            See LUME on your own leads.
          </h2>
          <p className={s.lede}>
            LUME’s founder walks you through it on a business like yours, and replies on WhatsApp.
          </p>
          <ul className={s.promise}>
            <li>Two short steps, under a minute</li>
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
              {js && (
                <div className={s.steps} aria-hidden="true">
                  <span data-on="" />
                  <span data-on={step === 2 || undefined} />
                  <em>Step {step} of 2</em>
                </div>
              )}
              <div className={s.group} hidden={hideFirst}>
                {field(
                  "name",
                  "Your name",
                  <input {...aria("name")} autoComplete="name" placeholder="Ananya Rao" />,
                )}
                {field(
                  "whatsapp",
                  "WhatsApp number",
                  <input
                    {...aria("whatsapp")}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="98123 45678"
                  />,
                )}
                <p className={s.hint}>Outside India? Start with + and the country code.</p>
              </div>
              <div className={s.group} hidden={hideSecond}>
                {field(
                  "business",
                  "Business",
                  <input
                    {...aria("business")}
                    autoComplete="organization"
                    placeholder="Your business’s name"
                  />,
                )}
                <fieldset className={s.field} data-invalid={errors.teamSize ? "" : undefined}>
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
              </div>
              {/* For bots only: people never see it. */}
              <label className="sr-only" aria-hidden="true">
                Leave this empty
                <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
              </label>
              <input type="hidden" name="t" value="5000" />
              {errors.form && (
                <p className={s.err} role="alert">
                  {errors.form}
                </p>
              )}
              <div className={s.actions}>
                {hideSecond ? (
                  <button className={s.send} type="button" onClick={(e) => next(e.currentTarget.form)}>
                    Continue
                  </button>
                ) : (
                  <>
                    {js && (
                      <button className={s.back} type="button" onClick={() => setStep(1)}>
                        Back
                      </button>
                    )}
                    <button className={s.send} type="submit" disabled={state === "sending"}>
                      {state === "sending" ? "Sending…" : "Book my demo"}
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
