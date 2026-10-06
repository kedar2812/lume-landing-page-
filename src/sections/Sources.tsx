import Image from "next/image";
import { Screen } from "@/components/Screen";
import { Solves } from "@/components/Solves";
import { Reveal } from "@/motion/Reveal";
import x from "./section.module.css";
import s from "./sources.module.css";

/**
 * Answer 01 (website spec §5.0): every lead in one list, from wherever it came. Official logos only where LUME
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

export function Sources() {
  return (
    <section id="one-list" className={x.section} aria-labelledby="one-list-h">
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
            <li key={src.label} className={s.chip} style={{ "--i": i } as React.CSSProperties}>
              {src.logo && <Image src={src.logo} alt="" width={18} height={18} />}
              {src.label}
            </li>
          ))}
        </ul>
        <Reveal className={s.shot} y={40}>
          <Screen name="leads" alt="LUME's leads: every enquiry in one list, with its stage and owner" />
        </Reveal>
      </div>
    </section>
  );
}
