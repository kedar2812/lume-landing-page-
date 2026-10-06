/** The Island's four shapes (website spec §5.H). */
export type IslandShape = "wide" | "compact" | "notify" | "dock";

/**
 * Which shape the Island takes: docked on a phone; otherwise wide only at the very top of the page (or while
 * hovered or focused), a brief notification when the hero's Leads piece lands, compact everywhere else.
 */
export function islandState(i: {
  y: number;
  heroBuilding: boolean;
  notifying: boolean;
  phone: boolean;
  open: boolean;
}): IslandShape {
  if (i.phone) return "dock";
  if (i.notifying) return "notify";
  if (i.open) return "wide";
  return i.y < 24 && !i.heroBuilding ? "wide" : "compact";
}

/** The chapter a section belongs to, as the compact Island names it. */
const CHAPTER_OF: Record<string, string> = {
  problem: "The problem",
  "one-list": "One list",
  "your-day": "Your day",
  whatsapp: "WhatsApp",
  analytics: "Analytics",
  team: "Your team",
  phone: "On your phone",
  faq: "Questions",
  enquire: "Book a demo",
};
export const SECTION_IDS = Object.keys(CHAPTER_OF);
export const sectionLabel = (id: string | null): string => (id ? (CHAPTER_OF[id] ?? "LUME") : "LUME");
