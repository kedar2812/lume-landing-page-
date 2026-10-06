import todayDark from "../../public/screens/today-dark.rects.json";
import todayDarkPhone from "../../public/screens/today-dark-phone.rects.json";
import todayLight from "../../public/screens/today-light.rects.json";
import todayLightPhone from "../../public/screens/today-light-phone.rects.json";

/**
 * Every LUME capture the site shows (website spec §6), made by the LUME repo's site-captures run: a pair per
 * screen, Porcelain and Obsidian. Desktop captures are 1440 × 900 at 2×; phone ones 390 × 844 at 3×.
 */
const DESKTOP = { width: 2880, height: 1800, phone: false } as const;
const PHONE = { width: 1170, height: 2532, phone: true } as const;

export const SCREENS = {
  today: DESKTOP,
  "today-rep": DESKTOP,
  me: DESKTOP,
  team: DESKTOP,
  overview: DESKTOP,
  "caught-no-touch": DESKTOP,
  "caught-needs-you": DESKTOP,
  "caught-source": DESKTOP,
  "caught-goal": DESKTOP,
  leads: DESKTOP,
  "action-whatsapp": DESKTOP,
  "action-call": DESKTOP,
  "action-follow-up": DESKTOP,
  "action-won": DESKTOP,
  "action-bulk": DESKTOP,
  "action-queue": DESKTOP,
  pipeline: DESKTOP,
  "action-search": DESKTOP,
  "action-drill": DESKTOP,
  security: DESKTOP,
  trace: DESKTOP,
  calendar: DESKTOP,
  "today-phone": PHONE,
  "leads-phone": PHONE,
  "drawer-phone": PHONE,
} as const;
export type ScreenName = keyof typeof SCREENS;
export type Theme = "light" | "dark";

/** The capture's path under /public. */
export function srcOf(name: ScreenName, theme: Theme, phone = false): string {
  const base = phone ? name.replace(/-phone$/, "") : name;
  return `/screens/${base}-${theme}${phone ? "-phone" : ""}.webp`;
}

export type Rect = { x: number; y: number; w: number; h: number };
export type TileName =
  "greeting" | "day" | "work" | "leads" | "revenue" | "pipeline" | "calendar" | "team" | "replies";
const RECTS: Record<Theme, Record<"desk" | "phone", Partial<Record<TileName, Rect>>>> = {
  light: { desk: todayLight, phone: todayLightPhone },
  dark: { desk: todayDark, phone: todayDarkPhone },
};

/** Where each piece of the Today capture sits, in CSS px of the 1440 × 900 (or 390 × 844) screen. */
export function rectsFor(theme: Theme, phone: boolean): Partial<Record<TileName, Rect>> {
  return RECTS[theme][phone ? "phone" : "desk"];
}
