import Image from "next/image";
import x from "./section.module.css";
import s from "./sources.module.css";

/** Where leads already come from (website spec §5, item 3). Official logos only where LUME ships them. */
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
    <section id="sources" className={`${x.section} ${x.tight} ${x.center}`} aria-labelledby="sources-h">
      <div className="wrap">
        <h2 id="sources-h" className={s.h}>
          Leads arrive from where you already are
        </h2>
        <ul className={s.list} aria-label="Lead sources">
          {SOURCES.map((src, i) => (
            <li key={src.label} className={s.chip} style={{ "--i": i } as React.CSSProperties}>
              {src.logo && <Image src={src.logo} alt="" width={18} height={18} />}
              {src.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
