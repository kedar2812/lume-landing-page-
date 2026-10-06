"use client";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useActiveSection } from "@/motion/sections";
import { ThemeSwitch } from "@/theme/ThemeSwitch";
import { islandState, sectionLabel, SECTION_IDS, type IslandShape } from "./state";
import s from "./island.module.css";

/** The story's chapters, as the Island links them (website spec §5.0). */
export const CHAPTERS = [
  { id: "problems", label: "The problems", short: "Problems" },
  { id: "meet", label: "Meet LUME", short: "LUME" },
  { id: "your-day", label: "How it runs your day", short: "Your day" },
  { id: "results", label: "What changes for your business", short: "Results" },
  { id: "faq", label: "Questions", short: "Questions" },
] as const;

const PHONE = "(max-width: 760px)";
const onScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  window.addEventListener("resize", cb);
  return () => {
    window.removeEventListener("scroll", cb);
    window.removeEventListener("resize", cb);
  };
};
const onMedia = (cb: () => void) => {
  const mq = window.matchMedia(PHONE);
  mq.addEventListener?.("change", cb);
  return () => mq.removeEventListener?.("change", cb);
};
const scrollY = () => Math.round(window.scrollY);
const progress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.round((window.scrollY / max) * 1000) / 1000 : 0;
};

/**
 * The Island (website spec §5.H): LUME's own island as the site's navigation. Liquid glass; one shape that morphs
 * between wide (the top of the page), compact (the chapter you're reading, your progress, WhatsApp and Book a
 * demo) and a brief notification when the hero's Leads piece lands. On a phone it docks at the bottom, in thumb
 * reach, and opens into a sheet.
 */
export function Island({ whatsapp }: { whatsapp: string }) {
  const y = useSyncExternalStore(onScroll, scrollY, () => 0);
  const p = useSyncExternalStore(onScroll, progress, () => 0);
  const phone = useSyncExternalStore(
    onMedia,
    () => window.matchMedia(PHONE).matches,
    () => false,
  );
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [heroBuilding, setHeroBuilding] = useState(false);
  const [sheet, setSheet] = useState(false);
  const shape: IslandShape = islandState({ y, heroBuilding, notifying: !!note, phone, open });

  useEffect(() => {
    let t = 0;
    const onNote = (e: Event) => {
      setNote((e as CustomEvent<{ text: string }>).detail.text);
      window.clearTimeout(t);
      t = window.setTimeout(() => setNote(null), 2400);
    };
    const onHero = (e: Event) => setHeroBuilding((e as CustomEvent<{ p: number }>).detail.p > 0.03);
    window.addEventListener("lume:notify", onNote);
    window.addEventListener("lume:hero", onHero);
    return () => {
      window.removeEventListener("lume:notify", onNote);
      window.removeEventListener("lume:hero", onHero);
      window.clearTimeout(t);
    };
  }, []);

  // The shape's width follows the content of the state it's in (measured), so the morph is exact.
  const layers = useRef<Record<"wide" | "compact" | "notify", HTMLDivElement | null>>({
    wide: null,
    compact: null,
    notify: null,
  });
  const [widths, setWidths] = useState({ wide: 820, compact: 486, notify: 440 });
  const measure = useCallback(() => {
    const w = (k: "wide" | "compact" | "notify") => Math.ceil(layers.current[k]?.scrollWidth ?? 0);
    setWidths((old) => ({
      wide: w("wide") || old.wide,
      compact: w("compact") || old.compact,
      notify: w("notify") || old.notify,
    }));
  }, []);
  useLayoutEffect(() => {
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    for (const el of Object.values(layers.current)) if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [measure, phone]);

  const ring = 2 * Math.PI * 14;
  const label = sectionLabel(active);
  const wa = `https://wa.me/${whatsapp}`;

  if (phone) return <Dock label={label} p={p} ring={ring} wa={wa} sheet={sheet} setSheet={setSheet} />;

  const width = shape === "wide" ? widths.wide : shape === "notify" ? widths.notify : widths.compact;
  return (
    <header className={s.bar}>
      <nav
        aria-label="Main"
        data-state={shape}
        className={s.island}
        style={{ "--w": `${width}px` } as CSSProperties}
        onPointerEnter={() => y > 24 && setOpen(true)}
        onPointerLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
        onKeyDown={(e: KeyboardEvent) => e.key === "Escape" && setOpen(false)}
      >
        <div
          ref={(el) => void (layers.current.wide = el)}
          className={s.layer}
          data-on={shape === "wide" || undefined}
          aria-hidden={shape !== "wide" || undefined}
          inert={shape !== "wide" || undefined}
        >
          <a href="#top" className={s.brand}>
            <Image src="/lume-mark.png" alt="" width={24} height={24} />
            LUME
          </a>
          <span className={s.links}>
            {CHAPTERS.slice(0, 4).map((c) => (
              <a key={c.id} href={`#${c.id}`} aria-label={c.label}>
                {c.short}
              </a>
            ))}
          </span>
          <ThemeSwitch className={s.sw} />
          <a className={s.wa} href={wa}>
            <Image src="/brand/whatsapp-glyph-white.svg" alt="" width={18} height={18} />
            WhatsApp
          </a>
          <a className={s.cta} href="#enquire">
            Book a demo
          </a>
        </div>
        <div
          ref={(el) => void (layers.current.compact = el)}
          className={s.layer}
          data-on={shape === "compact" || undefined}
          aria-hidden={shape !== "compact" || undefined}
          inert={shape !== "compact" || undefined}
        >
          <a href="#top" className={s.ring} aria-label="Back to the top">
            <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
              <circle cx="16" cy="16" r="14" className={s.track} />
              <circle
                cx="16"
                cy="16"
                r="14"
                className={s.fill}
                strokeDasharray={ring}
                strokeDashoffset={ring * (1 - p)}
              />
            </svg>
            <Image src="/lume-mark.png" alt="" width={18} height={18} />
          </a>
          <span className={s.section}>{label}</span>
          <a className={s.wa} href={wa}>
            <Image src="/brand/whatsapp-glyph-white.svg" alt="" width={18} height={18} />
            WhatsApp
          </a>
          <a className={s.cta} href="#enquire">
            Book a demo
          </a>
        </div>
        <div
          ref={(el) => void (layers.current.notify = el)}
          className={s.layer}
          data-on={shape === "notify" || undefined}
          aria-hidden="true"
          inert
        >
          <span className={s.note}>
            <i>AR</i>
            <span>
              <b>New lead</b> · Instagram · Ananya Rao · just now
            </span>
          </span>
        </div>
      </nav>
    </header>
  );
}

/** On a phone: docked at the bottom, in thumb reach; a tap rises into the sheet. */
function Dock({
  label,
  p,
  ring,
  wa,
  sheet,
  setSheet,
}: {
  label: string;
  p: number;
  ring: number;
  wa: string;
  sheet: boolean;
  setSheet: (v: boolean) => void;
}) {
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const close = () => setSheet(false);
  // Open: focus goes into the sheet. Closed again: back to the button that opened it, in the same update.
  const was = useRef(false);
  useEffect(() => {
    if (sheet) panel.current?.querySelector<HTMLElement>("a,button")?.focus();
    else if (was.current) button.current?.focus();
    was.current = sheet;
  }, [sheet]);
  const trap = (e: KeyboardEvent) => {
    if (e.key === "Escape") return close();
    if (e.key !== "Tab") return;
    const all = [...(panel.current?.querySelectorAll<HTMLElement>("a,button") ?? [])];
    const first = all[0];
    const last = all[all.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };
  return (
    <>
      <nav aria-label="Main" data-state="dock" className={`${s.island} ${s.dock}`}>
        <button
          ref={button}
          type="button"
          className={s.menu}
          aria-expanded={sheet}
          aria-controls="island-sheet"
          onClick={() => setSheet(true)}
        >
          <span className={s.ring} aria-hidden="true">
            <svg viewBox="0 0 32 32" width="32" height="32">
              <circle cx="16" cy="16" r="14" className={s.track} />
              <circle
                cx="16"
                cy="16"
                r="14"
                className={s.fill}
                strokeDasharray={ring}
                strokeDashoffset={ring * (1 - p)}
              />
            </svg>
            <Image src="/lume-mark.png" alt="" width={18} height={18} />
          </span>
          <span className={s.section}>
            <span className="sr-only">Menu · </span>
            {label}
          </span>
          <svg
            className={s.chev}
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m6 15 6-6 6 6" />
          </svg>
        </button>
        <a className={s.cta} href="#enquire">
          Book a demo
        </a>
      </nav>
      {sheet && (
        <div className={s.scrim} onClick={close}>
          <div
            ref={panel}
            id="island-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className={s.sheet}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={trap}
          >
            <span className={s.grab} aria-hidden="true" />
            <div className={s.sheetTop}>
              <span className={s.brand}>
                <Image src="/lume-mark.png" alt="" width={24} height={24} />
                LUME
              </span>
              <ThemeSwitch />
            </div>
            {CHAPTERS.map((c) => (
              <a key={c.id} href={`#${c.id}`} className={s.row} onClick={() => setSheet(false)}>
                {c.label}
              </a>
            ))}
            <div className={s.sheetCtas}>
              <a className={s.wa} href={wa}>
                <Image src="/brand/whatsapp-glyph-white.svg" alt="" width={20} height={20} />
                WhatsApp
              </a>
              <a className={s.cta} href="#enquire" onClick={() => setSheet(false)}>
                Book a demo
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
