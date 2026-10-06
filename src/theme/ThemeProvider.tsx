"use client";
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { THEME_KEY } from "./theme-script";

export type Choice = "auto" | "light" | "dark";
export type Resolved = "light" | "dark";
type Origin = { x: number; y: number };
type Theme = { choice: Choice; resolved: Resolved; set: (c: Choice, origin?: Origin) => void };

const EVENT = "lume-site-theme";
const DARK = "(prefers-color-scheme: dark)";
type Doc = Document & { startViewTransition?: (cb: () => void) => unknown };

/** The page's own record of the theme (<html data-choice / data-theme>, set before first paint). */
const read = (): string => {
  const d = document.documentElement.dataset;
  return `${d.choice ?? "auto"}|${d.theme === "dark" ? "dark" : "light"}`;
};
const subscribe = (on: () => void) => {
  window.addEventListener(EVENT, on);
  return () => window.removeEventListener(EVENT, on);
};
const write = (c: Choice, r: Resolved) => {
  const d = document.documentElement.dataset;
  d.choice = c;
  d.theme = r;
  window.dispatchEvent(new Event(EVENT));
};

/** Pick a theme: remembered in this browser, growing from where it was picked (a fade under reduced motion). */
function set(c: Choice, origin?: Origin) {
  const r: Resolved = c === "auto" ? (window.matchMedia(DARK).matches ? "dark" : "light") : c;
  try {
    if (c === "auto") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, c);
  } catch {
    /* storage blocked: the switch still works for this visit */
  }
  const doc = document as Doc;
  if (doc.startViewTransition && document.documentElement.dataset.theme !== r) {
    const root = document.documentElement;
    root.style.setProperty("--vt-x", `${origin?.x ?? window.innerWidth / 2}px`);
    root.style.setProperty("--vt-y", `${origin?.y ?? 0}px`);
    root.dataset.vt = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "fade" : "reveal";
    doc.startViewTransition(() => write(c, r));
  } else write(c, r);
}

const Ctx = createContext<Theme | null>(null);

/** Light and dark like LUME's (website spec §8): Auto follows the system, live. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const snap = useSyncExternalStore(subscribe, read, () => "auto|light");
  const [choice, resolved] = snap.split("|") as [Choice, Resolved];
  useEffect(() => {
    const mq = window.matchMedia(DARK);
    const on = () => {
      if ((document.documentElement.dataset.choice ?? "auto") === "auto")
        write("auto", mq.matches ? "dark" : "light");
    };
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  const value = useMemo(() => ({ choice, resolved, set }), [choice, resolved]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): Theme {
  const t = useContext(Ctx);
  if (!t) throw new Error("useTheme outside ThemeProvider");
  return t;
}
