import { z } from "zod";
import { DIAL } from "./countries";

/**
 * A WhatsApp number as people type it, as +<country><number>, with `dial` the chosen country's calling code: a
 * number typed with + (or 00) keeps its own code; otherwise the national trunk 0 goes and the code goes in front
 * (98123 45678 in India → +919812345678; 07700 900123 in the UK → +447700900123). A number already starting with
 * the code (91 98123 45678) isn't given it twice. Null when it can't be a number.
 */
export function normaliseWhatsapp(raw: string, dial = "91"): string | null {
  const t = raw.trim();
  let digits = t.replace(/\D/g, "");
  if (!digits) return null;
  if (t.startsWith("+")) {
    /* already international */
  } else if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith(dial) && digits.length >= dial.length + 9) {
    /* the code typed without the + */
  } else digits = dial + digits.replace(/^0/, "");
  return /^[1-9][0-9]{7,14}$/.test(digits) ? `+${digits}` : null;
}

export const TEAM_SIZES = [
  { id: "1", label: "Just me" },
  { id: "2-5", label: "2–5" },
  { id: "6-20", label: "6–20" },
  { id: "21+", label: "21+" },
] as const;
export type TeamSize = (typeof TEAM_SIZES)[number]["id"];

/** What's going wrong with their leads today (the form's first question; any that fit). */
export const NEEDS = [
  "Replies go out late",
  "Follow-ups get forgotten",
  "Leads are scattered across apps",
  "I can’t see what my team is doing",
  "Just seeing what LUME does",
] as const;
/** New leads a month (the form's second question; one). */
export const VOLUMES = [
  { id: "<50", label: "Under 50" },
  { id: "50-200", label: "50 to 200" },
  { id: "200-1000", label: "200 to 1,000" },
  { id: "1000+", label: "Over 1,000" },
] as const;
export type Volume = (typeof VOLUMES)[number]["id"];
export const volumeWords = (v: string) => VOLUMES.find((x) => x.id === v)?.label ?? v;

/** What the form asks, with what's wrong said in words, per field. */
export const enquirySchema = z
  .object({
    name: z.string().trim().min(1, "Type your name.").max(120, "That name is too long."),
    business: z.string().trim().min(1, "Type your business's name.").max(160, "That name is too long."),
    country: z
      .string()
      .optional()
      .transform((v) => v || "IN")
      .refine((v) => v in DIAL, "Choose your country."),
    whatsapp: z.string().trim().min(1, "Type your WhatsApp number.").max(40, "Type your WhatsApp number."),
    email: z
      .union([z.literal(""), z.email("That email doesn't look right.").max(254)])
      .optional()
      .transform((v) => v || undefined),
    teamSize: z.enum(["1", "2-5", "6-20", "21+"], { error: "Choose your team's size." }),
    how: z
      .string()
      .trim()
      .max(500, "Keep it under 500 characters.")
      .optional()
      .transform((v) => v || undefined),
    need: z
      .string()
      .trim()
      .max(300, "Keep it under 300 characters.")
      .optional()
      .transform((v) => v || undefined),
    volume: z
      .union([z.literal(""), z.enum(["<50", "50-200", "200-1000", "1000+"], { error: "Choose how many." })])
      .optional()
      .transform((v) => v || undefined),
  })
  // The country is folded into the number: the licence dashboard keeps one full international number.
  .transform(({ country, ...d }, ctx) => {
    const whatsapp = normaliseWhatsapp(d.whatsapp, DIAL[country]);
    if (!whatsapp) {
      ctx.addIssue({ code: "custom", path: ["whatsapp"], message: "Type your WhatsApp number." });
      return z.NEVER;
    }
    return { ...d, whatsapp };
  });
export type Enquiry = z.output<typeof enquirySchema>;

/** WhatsApp to LUME with the visitor's details already written (the way in when all else fails). */
export function whatsappLink(
  d: Pick<Enquiry, "name" | "business" | "whatsapp" | "teamSize"> & Partial<Enquiry>,
  to: string,
): string {
  const team = TEAM_SIZES.find((x) => x.id === d.teamSize)?.label ?? d.teamSize;
  const text = [
    `Hi, I'd like a demo of LUME.`,
    `${d.name}, ${d.business}`,
    `Team: ${team}`,
    d.volume ? `${volumeWords(d.volume)} leads a month` : "",
    d.need ? `What's going wrong: ${d.need}` : "",
    d.how ? `Leads reach us through: ${d.how}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
}
