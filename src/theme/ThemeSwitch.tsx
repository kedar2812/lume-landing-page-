"use client";
import { useRef, type KeyboardEvent } from "react";
import { useTheme, type Choice } from "./ThemeProvider";
import s from "./theme.module.css";

const CHOICES: { id: Choice; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

/** LUME's own switch — Auto · Light · Dark — as one radio group: one Tab stop, arrows move and choose. */
export function ThemeSwitch({ className }: { className?: string }) {
  const { choice, set } = useTheme();
  const group = useRef<HTMLDivElement>(null);
  const pick = (c: Choice, el?: HTMLElement | null) => {
    const r = el?.getBoundingClientRect();
    set(c, r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined);
  };
  const onKey = (e: KeyboardEvent) => {
    const i = CHOICES.findIndex((c) => c.id === choice);
    const step =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? CHOICES.length - 1 : step ? (i + step + 3) % 3 : -1;
    if (to < 0) return;
    e.preventDefault();
    const btn = group.current?.querySelectorAll<HTMLButtonElement>("[role=radio]")[to];
    btn?.focus();
    pick(CHOICES[to]!.id, btn);
  };
  return (
    <div
      ref={group}
      role="radiogroup"
      aria-label="Theme"
      className={`${s.switch} ${className ?? ""}`}
      onKeyDown={onKey}
    >
      {CHOICES.map((c) => (
        <button
          key={c.id}
          type="button"
          role="radio"
          aria-checked={choice === c.id}
          tabIndex={choice === c.id ? 0 : -1}
          className={s.opt}
          onClick={(e) => pick(c.id, e.currentTarget)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
