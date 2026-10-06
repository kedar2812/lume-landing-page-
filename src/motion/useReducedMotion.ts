"use client";
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
const subscribe = (on: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener?.("change", on);
  return () => mq.removeEventListener?.("change", on);
};

/** Whether the visitor asked for less motion (their system setting), live. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
