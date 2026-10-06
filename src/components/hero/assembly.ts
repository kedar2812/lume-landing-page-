/**
 * The hero's motion as plain arithmetic (website spec §5.H): where each piece of the Today capture sits, where it
 * comes from, and what the hero looks like at any point of the scroll. Pure, so it's the same at the same point
 * whichever way you scrolled (reversible), and testable without a browser.
 */
export type Rect = { x: number; y: number; w: number; h: number };
export type Piece = {
  name: string;
  /** Position and size as % of the 1440 × 900 capture: right at any width. */
  left: number;
  top: number;
  width: number;
  height: number;
  bgSize: string;
  bgPos: string;
  /** Where it floats in from, in capture pixels (scaled with the stage). */
  from: { x: number; y: number; rotate: number };
};

const W = 1440;
const H = 900;
/** From beyond the edge on the side its data comes from: leads from the sources' side, money from below, calls from the calendar's. */
const ORIGIN: Record<string, { x: number; y: number; rotate: number }> = {
  greeting: { x: 0, y: -420, rotate: 0 },
  day: { x: -900, y: 60, rotate: -10 },
  leads: { x: -1100, y: -160, rotate: -14 },
  revenue: { x: 160, y: 700, rotate: 8 },
  work: { x: -950, y: 380, rotate: -7 },
  pipeline: { x: 40, y: 760, rotate: 5 },
  calendar: { x: 1000, y: -120, rotate: 12 },
  team: { x: 700, y: 620, rotate: 9 },
  replies: { x: 1050, y: 260, rotate: 14 },
};

export function pieces(rects: Record<string, Rect>): Piece[] {
  return Object.entries(rects)
    .sort(([, a], [, b]) => a.y - b.y || a.x - b.x)
    .map(([name, r]) => ({
      name,
      left: (r.x / W) * 100,
      top: (r.y / H) * 100,
      width: (r.w / W) * 100,
      height: (r.h / H) * 100,
      bgSize: `${(W / r.w) * 100}% ${(H / r.h) * 100}%`,
      bgPos: `${r.w === W ? 0 : (r.x / (W - r.w)) * 100}% ${r.h === H ? 0 : (r.y / (H - r.h)) * 100}%`,
      from: ORIGIN[name] ?? { x: 0, y: 600, rotate: 0 },
    }));
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));
/** A critically damped settle drawn as a curve of progress: no overshoot (apple-design §4). */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export type HeroFrame = {
  /** Each piece's way home, 0 (away, unseen) → 1 (in place). */
  pieces: number[];
  /** The whole capture under the pieces, faded in once they're nearly home. */
  base: number;
  /** The screen tilting upright and growing to full size. */
  tilt: number;
  scale: number;
  /** The headline lifting away, its light sweeping across. */
  headY: number;
  headOpacity: number;
  sweep: number;
  /** The two buttons under the headline (they leave as the pieces start; the Island carries them). */
  ctas: number;
  hint: boolean;
  /** The blue glow behind the finished screen, 0 → 1. */
  glow: number;
};

/** The hero at scroll progress p (0 → 1 across its track), for n pieces. */
export function heroFrame(p: number, n: number): HeroFrame {
  const settle = ease(clamp((p - 0.62) / 0.3));
  const lift = ease(clamp((p - 0.35) / 0.5));
  return {
    pieces: Array.from({ length: n }, (_, i) => {
      const t = clamp((p - 0.04 - i * 0.035) / 0.45);
      return t >= 1 ? 1 : ease(t);
    }),
    base: clamp((p - 0.45) / 0.15),
    tilt: 14 * (1 - settle),
    scale: 0.94 + 0.06 * settle,
    headY: -90 * lift,
    headOpacity: 1 - 0.8 * lift,
    sweep: 100 - 100 * clamp(p / 0.35),
    ctas: 1 - clamp((p - 0.01) / 0.05),
    hint: p < 0.03,
    glow: 0.85 * settle + (settle >= 1 ? 0.15 : 0),
  };
}
