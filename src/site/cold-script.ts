/**
 * One lead's ordinary day, as the scroll plays it: how far down the scene you are decides the time on the clock,
 * and the time decides what has happened. Riya writes at 10:02 am; the reply goes out at 11:40 the next morning.
 */
export const BEATS = [
  { at: 0, mins: 0, say: "Riya writes in. She wants to book with someone this week." },
  { at: 0.16, mins: 38, say: "You see it between two meetings. You’ll reply properly later." },
  { at: 0.38, mins: 193, say: "She asks again at lunch. The afternoon runs away from you." },
  { at: 0.6, mins: 528, say: "She books with someone else. Nobody on your team knows." },
  { at: 0.82, mins: 1538, say: "You reply. It’s a good reply. It’s a day late." },
] as const;

const START = 10 * 60 + 2;

/** Which beat the scene has reached (0 to 4). */
export function stageAt(p: number): number {
  let n = 0;
  for (let i = 0; i < BEATS.length; i++) if (p >= BEATS[i]!.at) n = i;
  return n;
}

/** Minutes since Riya wrote: the clock runs smoothly between beats and stops at the reply. */
export function minutesAt(p: number): number {
  const q = Math.min(1, Math.max(0, p));
  const last = BEATS[BEATS.length - 1]!;
  if (q >= last.at) return last.mins;
  const i = stageAt(q);
  const a = BEATS[i]!;
  const b = BEATS[i + 1]!;
  return Math.round(a.mins + ((q - a.at) / (b.at - a.at)) * (b.mins - a.mins));
}

/** The wall clock, `mins` after 10:02 am on a Tuesday. */
export function clockAt(mins: number): { day: string; time: string; half: string } {
  const total = START + mins;
  const day = total >= 1440 ? "Wednesday" : "Tuesday";
  const m = total % 1440;
  const h = Math.floor(m / 60);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { day, time: `${h12}:${String(m % 60).padStart(2, "0")}`, half: h < 12 ? "am" : "pm" };
}
