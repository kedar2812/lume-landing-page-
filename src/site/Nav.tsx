"use client";
import Image from "next/image";
import { useTheme } from "@/theme/ThemeProvider";
import s from "./nav.module.css";

const LINKS = [
  ["#problem", "The problem"],
  ["#lume-ai", "LUME AI"],
  ["#whatsapp", "WhatsApp"],
  ["#calendar", "Calendar"],
  ["#product", "Product"],
] as const;

/** The bar that stays with you: where you are on the page, the theme, and the one thing to do next. */
export function Nav() {
  const { resolved, set } = useTheme();
  const next = resolved === "dark" ? "light" : "dark";
  return (
    <header className={s.nav}>
      <a href="#top" className={s.brand} aria-label="LUME, back to the top">
        <Image src="/lume-mark.png" alt="" width={24} height={26} priority />
        LUME
      </a>
      <nav aria-label="On this page" className={s.links}>
        {LINKS.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className={s.theme}
        aria-label={`Switch to the ${next} theme`}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          set(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 3.75a8.25 8.25 0 0 1 0 16.5z" fill="currentColor" />
        </svg>
      </button>
      <a href="#demo" className={s.cta}>
        Book a demo
      </a>
    </header>
  );
}
