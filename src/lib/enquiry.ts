import { z } from "zod";

/**
 * A WhatsApp number as people type it, as +<country><number>: Indian numbers need no code (98123 45678,
 * 098123 45678, 0091 98123 45678), others keep theirs (+44 7700 900123). Null when it can't be a number.
 */
export function normaliseWhatsapp(raw: string, country = "91"): string | null {
  const t = raw.trim();
  let digits = t.replace(/\D/g, "");
  if (!digits) return null;
  if (t.startsWith("+")) {
    /* already international */
  } else if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = country + digits.slice(1);
  else if (digits.length === 10) digits = country + digits;
  return /^[1-9][0-9]{7,14}$/.test(digits) ? `+${digits}` : null;
}

export const TEAM_SIZES = [
  { id: "1", label: "Just me" },
  { id: "2-5", label: "2–5" },
  { id: "6-20", label: "6–20" },
  { id: "21+", label: "21+" },
] as const;
export type TeamSize = (typeof TEAM_SIZES)[number]["id"];

/** What the form asks (five fields and one optional line), with what's wrong said in words, per field. */
export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Type your name.").max(120, "That name is too long."),
  business: z.string().trim().min(1, "Type your business's name.").max(160, "That name is too long."),
  whatsapp: z
    .string()
    .transform((v) => normaliseWhatsapp(v))
    .refine(
      (v): v is string => v !== null,
      "Type your WhatsApp number, with the country code if it isn't Indian.",
    ),
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
});
export type Enquiry = z.output<typeof enquirySchema>;

/** WhatsApp to LUME's founder with the visitor's details already written (the way in when all else fails). */
export function whatsappLink(
  d: Pick<Enquiry, "name" | "business" | "whatsapp" | "teamSize"> & Partial<Enquiry>,
  to: string,
): string {
  const team = TEAM_SIZES.find((x) => x.id === d.teamSize)?.label ?? d.teamSize;
  const text = [
    `Hi, I'd like a demo of LUME.`,
    `${d.name}, ${d.business}`,
    `Team: ${team}`,
    d.how ? `Leads reach us through: ${d.how}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
}
