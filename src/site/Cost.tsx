"use client";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useId, useState } from "react";
import { Rise, Scrub } from "@/motion/scroll";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { leak } from "./leak";
import s from "./cost.module.css";
import x from "./section.module.css";

const fmt = new Intl.NumberFormat("en-IN");

/** A number that rolls to its new value instead of jumping there. */
function Rolling({ value, prefix = "" }: { value: number; prefix?: string }) {
  const still = useReducedMotion();
  const mv = useMotionValue(value);
  const [shown, setShown] = useState(value);
  useMotionValueEvent(mv, "change", (v) => setShown(Math.round(v)));
  useEffect(() => {
    if (still) return mv.set(value);
    const c = animate(mv, value, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [value, mv, still]);
  return (
    <>
      {prefix}
      {fmt.format(still ? value : shown)}
    </>
  );
}

function Dial({
  label,
  value,
  set,
  min,
  max,
  step,
  show,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  min: number;
  max: number;
  step: number;
  show: string;
}) {
  const id = useId();
  return (
    <div className={s.dial}>
      <label htmlFor={id}>{label}</label>
      <output htmlFor={id}>{show}</output>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        style={{ ["--fill" as string]: `${((value - min) / (max - min)) * 100}%` }}
      />
    </div>
  );
}

/**
 * The visitor's own sum: their leads, their reply rate, their customer's worth. Nothing here is LUME's claim about
 * anyone's business; the page only does the arithmetic, in the browser, and keeps none of it.
 */
export function Cost() {
  const [leads, setLeads] = useState(300);
  const [sameDay, setSameDay] = useState(60);
  const [oneIn, setOneIn] = useState(10);
  const [worth, setWorth] = useState(25000);
  const r = leak({ leads, sameDay, oneIn, worth });
  return (
    <section id="cost" className={`${x.section} ${s.section}`} aria-labelledby="cost-h">
      <div className="wrap">
        <div className={x.head}>
          <Scrub id="cost-h" className={x.h2} text="Now do the sum on your own leads." />
          <p className={x.lede}>
            Move the four dials to your own numbers. The arithmetic happens in your browser, and LUME keeps
            none of it.
          </p>
        </div>
        <Rise className={s.board}>
          <div className={s.dials}>
            <Dial
              label="New leads a month"
              value={leads}
              set={setLeads}
              min={20}
              max={3000}
              step={10}
              show={fmt.format(leads)}
            />
            <Dial
              label="Get a reply the same day"
              value={sameDay}
              set={setSameDay}
              min={0}
              max={100}
              step={5}
              show={`${sameDay} in 100`}
            />
            <Dial
              label="Of the ones left waiting, would have bought"
              value={oneIn}
              set={setOneIn}
              min={2}
              max={30}
              step={1}
              show={`1 in ${oneIn}`}
            />
            <Dial
              label="One customer is worth"
              value={worth}
              set={setWorth}
              min={1000}
              max={500000}
              step={1000}
              show={`₹${fmt.format(worth)}`}
            />
          </div>
          <div className={s.sum} aria-live="polite">
            <p className={s.small}>Every month</p>
            <p className={s.big}>
              <Rolling value={r.waiting} />
            </p>
            <p className={s.what}>leads wait past the day they wrote.</p>
            <dl className={s.rows}>
              <div>
                <dt>Customers that would have been yours</dt>
                <dd>
                  <Rolling value={r.customers} />
                </dd>
              </div>
              <div>
                <dt>Left on the table each month</dt>
                <dd>
                  <Rolling value={r.month} prefix="₹" />
                </dd>
              </div>
              <div>
                <dt>Over a year</dt>
                <dd>
                  <Rolling value={r.year} prefix="₹" />
                </dd>
              </div>
            </dl>
            <a href="#demo" className={s.cta}>
              Stop the leak
            </a>
          </div>
        </Rise>
      </div>
    </section>
  );
}
