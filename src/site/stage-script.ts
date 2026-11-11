/**
 * The hero's scene, as a script: a lead writes in, LUME AI answers on WhatsApp, the call is booked. One step at a
 * time, each held for its own while; the scene itself only draws what a step says is there.
 */
export type Line = { from: "lead" | "ai"; text: string; time: string; link?: string };

export const LEAD = { name: "Aanya Kapoor", initials: "AK", source: "Instagram" } as const;
export const LINES: Line[] = [
  { from: "lead", text: "Hi, I saw your ad. Is the weekend batch still open?", time: "4:02 pm" },
  {
    from: "ai",
    text: "Hi Aanya, yes. The weekend batch starts on 21 November and has 6 seats left. Would a quick call help?",
    time: "4:02 pm",
  },
  { from: "lead", text: "Yes please. Tomorrow at 5 pm?", time: "4:03 pm" },
  {
    from: "ai",
    text: "Tomorrow from 5:00 to 5:30 pm is yours, with Rohan. Here's the link:",
    link: "meet.google.com/lum-calls-eve",
    time: "4:03 pm",
  },
];

export const PHASES = ["A lead writes in", "LUME AI answers", "The call is booked"] as const;

type Step = {
  ms: number;
  phase: 0 | 1 | 2;
  lines: number;
  typing: boolean;
  arrived: boolean;
  booked: boolean;
};
const step = (
  ms: number,
  phase: 0 | 1 | 2,
  lines: number,
  o: { typing?: boolean; arrived?: boolean; booked?: boolean } = {},
): Step => ({
  ms,
  phase,
  lines,
  typing: o.typing ?? false,
  arrived: o.arrived ?? true,
  booked: o.booked ?? false,
});

export const STEPS: Step[] = [
  step(900, 0, 0, { arrived: false }),
  step(1100, 0, 0),
  step(1500, 0, 1),
  step(1300, 1, 1, { typing: true }),
  step(2300, 1, 2),
  step(1700, 1, 3),
  step(1300, 1, 3, { typing: true }),
  step(1900, 1, 4),
  step(5200, 2, 4, { booked: true }),
];

/** The scene finished, for anyone who asked for less motion (and before the script starts). */
export const LAST = STEPS.length - 1;
export const nextStep = (i: number): number => (i >= LAST ? 0 : i + 1);
