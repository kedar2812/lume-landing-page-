/**
 * The hero's unanswered leads: who wrote, from where, what they said, and how long ago. Each keeps waiting while
 * the page is open (a real second is `rate` of their minutes, so the fresh ones visibly tick and the old ones
 * barely move). Positions are a percentage of the screen; `depth` is how near they float.
 */
export type Waiting = {
  name: string;
  from: string;
  text: string;
  mins: number;
  rate: number;
  x: number;
  y: number;
  depth: number;
  rot: number;
  /** Shown on a phone too (the rest would crowd the headline). */
  phone: boolean;
};

export const WAITING: Waiting[] = [
  {
    name: "Aanya Kapoor",
    from: "Instagram DM",
    text: "Hi! Is the weekend batch still open?",
    mins: 0,
    rate: 0.5,
    x: 6,
    y: 15,
    depth: 1.1,
    rot: -4,
    phone: true,
  },
  {
    name: "Vikram Shah",
    from: "Website form",
    text: "Please call me back about pricing.",
    mins: 14,
    rate: 0.5,
    x: 71,
    y: 12,
    depth: 0.9,
    rot: 3,
    phone: true,
  },
  {
    name: "Meera Nair",
    from: "WhatsApp",
    text: "Can I visit tomorrow?",
    mins: 47,
    rate: 0.5,
    x: 82,
    y: 37,
    depth: 1.2,
    rot: -2,
    phone: false,
  },
  {
    name: "Unknown number",
    from: "Missed call",
    text: "Rang twice. No voicemail.",
    mins: 96,
    rate: 0.5,
    x: 1,
    y: 43,
    depth: 0.7,
    rot: 5,
    phone: false,
  },
  {
    name: "Dev Malhotra",
    from: "Ad form",
    text: "Interested. Send details.",
    mins: 190,
    rate: 1,
    x: 12,
    y: 71,
    depth: 1.0,
    rot: 2,
    phone: true,
  },
  {
    name: "Sara Fernandes",
    from: "Instagram DM",
    text: "Hello? Anyone there?",
    mins: 325,
    rate: 1,
    x: 73,
    y: 68,
    depth: 1.05,
    rot: -5,
    phone: true,
  },
  {
    name: "Kabir Sethi",
    from: "WhatsApp",
    text: "What does it cost for two people?",
    mins: 560,
    rate: 1,
    x: 27,
    y: 6,
    depth: 0.55,
    rot: 2,
    phone: false,
  },
  {
    name: "Ishita Rao",
    from: "Google Sheet, row 214",
    text: "Added Monday. Nobody assigned.",
    mins: 1500,
    rate: 1,
    x: 56,
    y: 84,
    depth: 0.6,
    rot: -3,
    phone: false,
  },
  {
    name: "Arjun Pillai",
    from: "Website form",
    text: "Following up on my enquiry.",
    mins: 2950,
    rate: 1,
    x: 30,
    y: 85,
    depth: 0.85,
    rot: 4,
    phone: false,
  },
  {
    name: "Tara Menon",
    from: "Instagram DM",
    text: "Never mind, found someone else.",
    mins: 4400,
    rate: 1,
    x: 87,
    y: 80,
    depth: 0.75,
    rot: 3,
    phone: false,
  },
  {
    name: "Neil D'Souza",
    from: "Ad form",
    text: "Is the offer still on?",
    mins: 7300,
    rate: 1,
    x: 52,
    y: 4,
    depth: 0.5,
    rot: -2,
    phone: false,
  },
];

/** How long a lead has waited, as a person would say it. */
export function waited(mins: number): string {
  const m = Math.floor(mins);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min`;
  if (m < 1440) {
    const h = Math.floor(m / 60);
    const r = m % 60;
    return r && h < 6 ? `${h} h ${r} min` : `${h} h`;
  }
  const d = Math.floor(m / 1440);
  return d === 1 ? "1 day" : `${d} days`;
}

/** Warm for the first half hour, cooling for the rest of the working day, cold after. */
export function heat(mins: number): "warm" | "cooling" | "cold" {
  return mins < 30 ? "warm" : mins < 480 ? "cooling" : "cold";
}
