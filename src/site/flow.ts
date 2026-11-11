import { z } from "zod";
import { DIAL } from "@/lib/countries";
import { NEEDS, TEAM_SIZES, VOLUMES, normaliseWhatsapp } from "@/lib/enquiry";

/**
 * Book a demo as five short steps instead of one long form: four questions answered by tapping, then who to
 * reply to. What's collected goes to /api/enquire, where lib/enquiry's schema checks it again.
 */
export const STEPS = ["need", "volume", "how", "teamSize", "you"] as const;
export type StepId = (typeof STEPS)[number];

export const HOW_CHOICES = [
  "Instagram",
  "WhatsApp",
  "Website",
  "Ads",
  "Google Sheet",
  "Referrals",
  "Walk-ins",
];

export type Answers = {
  need: string[];
  volume: string;
  how: string[];
  teamSize: string;
  name: string;
  business: string;
  country: string;
  whatsapp: string;
  email: string;
};
export const EMPTY: Answers = {
  need: [],
  volume: "",
  how: [],
  teamSize: "",
  name: "",
  business: "",
  country: "IN",
  whatsapp: "",
  email: "",
};

type Choice = { id: string; label: string };
export type Question = { ask: string; hint: string; many: boolean; choices: Choice[] };
const same = (labels: readonly string[]): Choice[] => labels.map((l) => ({ id: l, label: l }));

/** The four tapped questions, in LUME's words. */
export const QUESTIONS: Record<Exclude<StepId, "you">, Question> = {
  need: {
    ask: "What’s going wrong with your leads today?",
    hint: "Pick any that fit.",
    many: true,
    choices: same(NEEDS),
  },
  volume: {
    ask: "How many new leads come in a month?",
    hint: "A rough number is fine.",
    many: false,
    choices: VOLUMES.map((v) => ({ id: v.id, label: v.label })),
  },
  how: {
    ask: "Where do they come from?",
    hint: "Pick any that fit, or skip.",
    many: true,
    choices: same(HOW_CHOICES),
  },
  teamSize: {
    ask: "How many people handle them?",
    hint: "Counting you.",
    many: false,
    choices: TEAM_SIZES.map((t) => ({ id: t.id, label: t.label })),
  },
};

/** Whether a step has what it needs to move on ("how" may be skipped). */
export function ready(step: StepId, a: Answers): boolean {
  switch (step) {
    case "need":
      return a.need.length > 0;
    case "volume":
      return VOLUMES.some((v) => v.id === a.volume);
    case "how":
      return true;
    case "teamSize":
      return TEAM_SIZES.some((t) => t.id === a.teamSize);
    case "you":
      return Object.keys(checkYou(a)).length === 0;
  }
}

/** Tap a choice: one answer replaces the last; where many fit, a second tap takes it back. */
export function choose(step: Exclude<StepId, "you">, a: Answers, id: string): Answers {
  if (step === "need" || step === "how") {
    const had = a[step];
    return { ...a, [step]: had.includes(id) ? had.filter((k) => k !== id) : [...had, id] };
  }
  return { ...a, [step]: id };
}

export type YouErrors = Partial<Record<"name" | "business" | "whatsapp" | "email", string>>;

/** The last step's four fields, checked in the same words the server uses. */
export function checkYou(a: Answers): YouErrors {
  const e: YouErrors = {};
  const name = a.name.trim();
  const business = a.business.trim();
  const email = a.email.trim();
  if (!name) e.name = "Type your name.";
  else if (name.length > 120) e.name = "That name is too long.";
  if (!business) e.business = "Type your business’s name.";
  else if (business.length > 160) e.business = "That name is too long.";
  if (!normaliseWhatsapp(a.whatsapp, DIAL[a.country])) e.whatsapp = "Type your WhatsApp number.";
  if (email && !z.email().max(254).safeParse(email).success) e.email = "That email doesn’t look right.";
  return e;
}

/** The number LUME will reply on, in full. */
export const fullNumber = (a: Answers): string =>
  normaliseWhatsapp(a.whatsapp, DIAL[a.country]) ?? a.whatsapp;

/** What goes to /api/enquire. */
export function payload(a: Answers, ms: number): Record<string, string | number> {
  return {
    name: a.name,
    business: a.business,
    country: a.country,
    whatsapp: a.whatsapp,
    email: a.email,
    teamSize: a.teamSize,
    how: a.how.join(", "),
    need: a.need.join(", "),
    volume: a.volume,
    website: "",
    t: ms,
  };
}
