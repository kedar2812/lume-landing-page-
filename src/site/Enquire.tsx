"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { COUNTRIES, DIAL, flagOf } from "@/lib/countries";
import { TEAM_SIZES } from "@/lib/enquiry";
import { Rise, Scrub } from "@/motion/scroll";
import {
  EMPTY,
  QUESTIONS,
  STEPS,
  checkYou,
  choose,
  fullNumber,
  payload,
  ready,
  type Answers,
  type YouErrors,
} from "./flow";
import s from "./enquire.module.css";
import x from "./section.module.css";

const LETTERS = "ABCDEFGH";

/**
 * Book a demo in five short steps (owner, 2026-11-11: no long contact form; one simple question at a time, mostly
 * answered by tapping). Four tapped questions, then who to reply to. A single choice moves on by itself; Back
 * keeps every answer. It files to /api/enquire, and so into the licence dashboard; without JavaScript a plain
 * form below does the same job.
 */
export function Enquire({
  whatsapp,
  go = (url: string) => window.location.assign(url),
}: {
  whatsapp: string;
  go?: (url: string) => void;
}) {
  const [a, setA] = useState<Answers>(EMPTY);
  const [at, setAt] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [errors, setErrors] = useState<YouErrors & { form?: string }>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const card = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const hop = useRef(0);
  const step = STEPS[at]!;
  const shown = whatsapp.replace(/^91(\d{5})(\d{5})$/, "+91 $1 $2");

  // After a move the new step takes the focus, so the keyboard carries on where the eye is.
  useEffect(() => {
    if (!touched.current) return;
    card.current?.querySelector<HTMLElement>("[data-first]")?.focus({ preventScroll: true });
  }, [at, state]);
  useEffect(() => () => window.clearTimeout(hop.current), []);

  const move = (to: number) => {
    touched.current = true;
    window.clearTimeout(hop.current);
    setDir(to > at ? 1 : -1);
    setAt(Math.max(0, Math.min(STEPS.length - 1, to)));
  };
  const tap = (id: string) => {
    if (step === "you") return;
    touched.current = true;
    const next = choose(step, a, id);
    setA(next);
    // One answer fits: go on by itself, after a beat long enough to see the choice land.
    if (!QUESTIONS[step].many) {
      window.clearTimeout(hop.current);
      hop.current = window.setTimeout(() => move(at + 1), 320);
    }
  };
  const onKey = (e: KeyboardEvent) => {
    if (step === "you" || e.metaKey || e.ctrlKey || e.altKey) return;
    const i = LETTERS.indexOf(e.key.toUpperCase());
    const c = QUESTIONS[step].choices[i];
    if (e.key.length === 1 && c) {
      e.preventDefault();
      tap(c.id);
    }
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (step !== "you") return ready(step, a) ? move(at + 1) : undefined;
    const bad = checkYou(a);
    setErrors(bad);
    const first = Object.keys(bad)[0];
    if (first) return card.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    setState("sending");
    try {
      const r = await fetch("/api/enquire", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        // How long the page has been open: a bot posts within moments of loading it.
        body: JSON.stringify(payload(a, Math.round(e.timeStamp))),
      });
      const body = (await r.json()) as {
        ok?: boolean;
        whatsapp?: string;
        errors?: YouErrors & { form?: string };
      };
      if (body.ok) {
        touched.current = true;
        return setState("sent");
      }
      if (body.whatsapp) return go(body.whatsapp);
      setErrors(body.errors ?? { form: "That didn’t go through. Try again, or message LUME on WhatsApp." });
    } catch {
      setErrors({ form: "LUME couldn’t reach its server. Try again, or message LUME on WhatsApp." });
    }
    setState("idle");
  }

  const text = (
    name: "name" | "business" | "email",
    label: string,
    auto: string,
    type = "text",
    first = false,
  ) => (
    <div className={s.field} data-invalid={errors[name] ? "" : undefined}>
      <label htmlFor={`demo-${name}`}>{label}</label>
      <input
        id={`demo-${name}`}
        name={name}
        type={type}
        autoComplete={auto}
        value={a[name]}
        onChange={(e) => setA({ ...a, [name]: e.target.value })}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `demo-${name}-err` : undefined}
        data-first={first ? "" : undefined}
      />
      {errors[name] && (
        <p className={s.err} id={`demo-${name}-err`}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  const q = step === "you" ? null : QUESTIONS[step];
  const picked = (id: string) =>
    step === "you" ? false : q!.many ? (a[step] as string[]).includes(id) : a[step] === id;

  return (
    <section id="demo" className={`${x.section} ${s.section}`} aria-labelledby="demo-h">
      <div className={`wrap ${s.split}`}>
        <div className={s.copy}>
          <Scrub id="demo-h" className={x.h2} text="See LUME on your own leads." />
          <p className={x.lede}>
            Five short steps, mostly one tap each. LUME replies on WhatsApp to set up a demo shaped around how
            your team sells.
          </p>
          <ul className={s.promise}>
            <li>Under a minute</li>
            <li>No payment details</li>
            <li>Your number is used only to reply</li>
          </ul>
          <a className={s.wa} href={`https://wa.me/${whatsapp}`}>
            <Image src="/brand/whatsapp-glyph-green.svg" alt="" width={22} height={22} />
            <span>
              Or message LUME on WhatsApp
              <small>{shown}</small>
            </span>
          </a>
        </div>

        <Rise className={s.cardWrap}>
          <div className={s.card} id="demo-card" ref={card} onKeyDown={onKey}>
            {state === "sent" ? (
              <div className={s.sent} role="status" tabIndex={-1} data-first>
                <span className={s.tick} aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="30"
                    height="30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                  >
                    <path d="m5.5 12.5 4.2 4.2 8.8-9.4" />
                  </svg>
                </span>
                <h3>Thank you, {a.name.trim().split(/\s+/)[0]}.</h3>
                <p>
                  That’s with LUME now. A reply is coming on WhatsApp at <b>{fullNumber(a)}</b> to set up your
                  demo.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate aria-label="Book a demo">
                <div className={s.top}>
                  <ol className={s.steps} aria-hidden="true">
                    {STEPS.map((k, i) => (
                      <li key={k} data-done={i < at} data-now={i === at} />
                    ))}
                  </ol>
                  <span aria-live="polite">
                    Step {at + 1} of {STEPS.length}
                  </span>
                </div>

                <div className={s.body} key={step} data-dir={dir}>
                  {q ? (
                    <fieldset className={s.q}>
                      <legend>
                        <span className={s.ask}>{q.ask}</span>
                        <span className={s.hint}>{q.hint}</span>
                      </legend>
                      <div className={s.choices} role={q.many ? "group" : "radiogroup"} aria-label={q.ask}>
                        {q.choices.map((c, i) => (
                          <button
                            key={c.id}
                            type="button"
                            className={s.choice}
                            role={q.many ? "checkbox" : "radio"}
                            aria-checked={picked(c.id)}
                            onClick={() => tap(c.id)}
                            data-first={i === 0 ? "" : undefined}
                          >
                            <kbd aria-hidden="true">{LETTERS[i]}</kbd>
                            <span>{c.label}</span>
                            <i aria-hidden="true" data-many={q.many} />
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  ) : (
                    <div className={s.q}>
                      <p className={s.ask}>Last one. Where should LUME reply?</p>
                      <div className={s.fields}>
                        {text("name", "Your name", "name", "text", true)}
                        {text("business", "Business", "organization")}
                        <div
                          className={`${s.field} ${s.wide}`}
                          data-invalid={errors.whatsapp ? "" : undefined}
                        >
                          <label htmlFor="demo-whatsapp">WhatsApp number</label>
                          <div className={s.phone}>
                            <label className={s.code}>
                              <span aria-hidden="true">{flagOf(a.country)}</span>
                              <span>+{DIAL[a.country]}</span>
                              <span className="sr-only">Country code</span>
                              <select
                                name="country"
                                value={a.country}
                                onChange={(e) => setA({ ...a, country: e.target.value })}
                                autoComplete="tel-country-code"
                              >
                                {COUNTRIES.map((c) => (
                                  <option key={c.iso} value={c.iso}>
                                    {c.name} (+{c.dial})
                                  </option>
                                ))}
                              </select>
                            </label>
                            <input
                              id="demo-whatsapp"
                              name="whatsapp"
                              type="tel"
                              inputMode="tel"
                              autoComplete="tel-national"
                              value={a.whatsapp}
                              onChange={(e) => setA({ ...a, whatsapp: e.target.value })}
                              aria-invalid={errors.whatsapp ? true : undefined}
                              aria-describedby={errors.whatsapp ? "demo-whatsapp-err" : undefined}
                            />
                          </div>
                          {errors.whatsapp && (
                            <p className={s.err} id="demo-whatsapp-err">
                              {errors.whatsapp}
                            </p>
                          )}
                        </div>
                        <div className={s.wide}>{text("email", "Email (optional)", "email", "email")}</div>
                      </div>
                    </div>
                  )}
                </div>

                {errors.form && (
                  <p className={s.err} role="alert">
                    {errors.form}
                  </p>
                )}
                <div className={s.foot}>
                  <button type="button" className={s.back} onClick={() => move(at - 1)} disabled={at === 0}>
                    Back
                  </button>
                  <button
                    type="submit"
                    className={s.next}
                    disabled={state === "sending" || (step !== "you" && !ready(step, a))}
                  >
                    {step === "you"
                      ? state === "sending"
                        ? "Booking…"
                        : "Book my demo"
                      : step === "how" && a.how.length === 0
                        ? "Skip"
                        : "Continue"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Rise>

        <noscript>
          <style>{"#demo-card{display:none}"}</style>
          <p id="demo-sent" className={s.plainSent} role="status">
            Thank you. That’s with LUME now. A reply is coming on WhatsApp to set up your demo.
          </p>
          <form className={s.plain} action="/api/enquire" method="post">
            <label>
              Your name <input name="name" required autoComplete="name" />
            </label>
            <label>
              Business <input name="business" required autoComplete="organization" />
            </label>
            <label>
              WhatsApp number, with its country code <input name="whatsapp" type="tel" required />
            </label>
            <label>
              Email (optional) <input name="email" type="email" />
            </label>
            <label>
              Team size
              <select name="teamSize" required>
                {TEAM_SIZES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <input type="hidden" name="t" value="5000" />
            <button type="submit">Book my demo</button>
          </form>
        </noscript>
      </div>
    </section>
  );
}
