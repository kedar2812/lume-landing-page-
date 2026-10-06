"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { THEME_KEY } from "./theme-script";

export type Choice = "auto" | "light" | "dark";
export type Resolved = "light" | "dark";
type Origin = { x: number; y: number };
type Theme = { choice: Choice; resolved: Resolved; set: (c: Choice, origin?: Origin) => void };

const Ctx = createContext<Theme | null>(null);
const systemDark = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
const resolve = (c: Choice): Resolved => (c === "auto" ? (systemDark() ? "dark" : "light") : c);

type Doc = Document & { startViewTransition?: (cb: () => void) => unknown };

/**
 * Light and dark like LUME's (website spec §8): Auto follows the system, live; a choice is remembered in this
 * browser. A change grows from where it was made (View Transitions; a cross-fade where there are none).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<Choice>("auto");
  const [resolved, setResolved] = useState<Resolved>("light");

  useEffect(() => {
    const d = document.documentElement.dataset;
    const c = d.choice === "dark" || d.choice === "light" ? d.choice : "auto";
    setChoice(c);
    setResolved(d.theme === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (choice !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const on = () => apply(mq.matches ? "dark" : "light");
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, [choice]);

  const apply = (r: Resolved) => {
    document.documentElement.dataset.theme = r;
    setResolved(r);
  };

  const set = useCallback((c: Choice, origin?: Origin) => {
    const r = resolve(c);
    const swap = () => {
      document.documentElement.dataset.choice = c;
      apply(r);
      setChoice(c);
    };
    try {
      if (c === "auto") localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, c);
    } catch {
      /* storage blocked: the switch still works for this visit */
    }
    const doc = document as Doc;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && document.documentElement.dataset.theme !== r) {
      const root = document.documentElement.style;
      root.setProperty("--vt-x", `${origin?.x ?? window.innerWidth / 2}px`);
      root.setProperty("--vt-y", `${origin?.y ?? 0}px`);
      document.documentElement.dataset.vt = still ? "fade" : "reveal";
      doc.startViewTransition(swap);
    } else swap();
  }, []);

  const value = useMemo(() => ({ choice, resolved, set }), [choice, resolved, set]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): Theme {
  const t = useContext(Ctx);
  if (!t) throw new Error("useTheme outside ThemeProvider");
  return t;
}
