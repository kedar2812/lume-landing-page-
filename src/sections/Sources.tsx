"use client";
import Image from "next/image";
import { useRef } from "react";
import { Screen } from "@/components/Screen";
import { Solves } from "@/components/Solves";
import { along, useBuild } from "@/motion/build";
import x from "./section.module.css";
import s from "./sources.module.css";

/**
 * Answer 01 (website spec §5.0): every lead in one list, from wherever it came — a scroll build-up (§5.H): the
 * sources travel in from the edges, then the list settles upright beneath them. Official logos only where LUME
 * ships them; the others by name.
 */
const SOURCES: { label: string; logo?: string }[] = [
  { label: "Instagram & Facebook forms" },
  { label: "Your website" },
  { label: "Google Sheets", logo: "/brand/google-sheets.png" },
  { label: "Calendly", logo: "/brand/calendly.svg" },
  { label: "Zapier & Make" },
  { label: "A spreadsheet you already have" },
];

/** Where each source starts, scattered at the edges (px at full width): alternate sides, staggered heights. */
const FROM = [
  { x: -420, y: -60 },
  { x: 380, y: 40 },
  { x: -300, y: 90 },
  { x: 460, y: -70 },
  { x: -460, y: 20 },
  { x: 320, y: 100 },
];

export function Sources() {
  const ref = useRef<HTMLElement>(null);
  const p = useBuild(ref);
  const list = along(p, 0.45, 0.5);
  return (
    <section ref={ref} id="one-list" className={x.section} aria-labelledby="one-list-h">
      <div className="wrap">
        <Solves n={1} />
        <h2 id="one-list-h" className={x.h2}>
          Every lead in one list.
        </h2>
        <p className={x.lede}>
          Wherever an enquiry starts, it lands in one list in LUME, with duplicates caught and phone numbers
          fixed as it arrives.
        </p>
        <ul className={s.list} aria-label="Lead sources">
          {SOURCES.map((src, i) => (
            <li
              key={src.label}
              className={s.chip}
              style={(() => {
                const t = along(p, 0.05 + i * 0.05, 0.45);
                const f = FROM[i]!;
                return {
                  transform: `translate(${f.x * (1 - t)}px, ${f.y * (1 - t)}px) scale(${0.92 + 0.08 * t})`,
                  opacity: 0.15 + 0.85 * t,
                };
              })()}
            >
              {src.logo && <Image src={src.logo} alt="" width={18} height={18} />}
              {src.label}
            </li>
          ))}
        </ul>
        <div className={s.stage}>
          <div
            className={s.shot}
            style={{
              transform: `translateY(${60 * (1 - list)}px) rotateX(${10 * (1 - list)}deg) scale(${0.94 + 0.06 * list})`,
              opacity: 0.25 + 0.75 * list,
            }}
          >
            <Screen name="leads" alt="LUME's leads: every enquiry in one list, with its stage and owner" />
          </div>
        </div>
      </div>
    </section>
  );
}
