import { describe, expect, it } from "vitest";
import { heroFrame, pieces, stillFrame } from "./assembly";

const RECTS = {
  greeting: { x: 296, y: 96, w: 1086, h: 64 },
  day: { x: 294, y: 176, w: 537, h: 226 },
  leads: { x: 845, y: 176, w: 262, h: 226 },
  revenue: { x: 1121, y: 176, w: 262, h: 226 },
};

describe("the hero's pieces (website spec §5.H)", () => {
  it("each piece shows exactly its part of the one capture, at any size (percentages)", () => {
    const p = pieces(RECTS).find((x) => x.name === "leads")!;
    expect(p.left).toBeCloseTo((845 / 1440) * 100, 5);
    expect(p.top).toBeCloseTo((176 / 900) * 100, 5);
    expect(p.width).toBeCloseTo((262 / 1440) * 100, 5);
    expect(p.bgSize).toBe(`${(1440 / 262) * 100}% ${(900 / 226) * 100}%`);
    expect(p.bgPos).toBe(`${(845 / (1440 - 262)) * 100}% ${(176 / (900 - 226)) * 100}%`);
  });
  it("in reading order, each from the side its data comes from", () => {
    const ps = pieces(RECTS);
    expect(ps.map((x) => x.name)).toEqual(["greeting", "day", "leads", "revenue"]);
    expect(ps.find((x) => x.name === "leads")!.from.x).toBeLessThan(0);
    expect(ps.find((x) => x.name === "revenue")!.from.y).toBeGreaterThan(0);
  });
});

describe("the hero at a point of the scroll", () => {
  it("at rest: nothing of the dashboard, the buttons and the hint showing", () => {
    const f = heroFrame(0, 4);
    expect(f.pieces.every((t) => t === 0)).toBe(true);
    expect([f.base, f.ctas, f.hint]).toEqual([0, 1, true]);
  });
  it("as soon as scrolling begins the buttons leave and the pieces start, one after another", () => {
    const f = heroFrame(0.2, 4);
    expect(f.ctas).toBe(0);
    expect(f.hint).toBe(false);
    expect(f.pieces[0]).toBeGreaterThan(f.pieces[3]!);
    expect(f.pieces[0]).toBeGreaterThan(0);
  });
  it("at the end: every piece home, the screen upright, the glow up", () => {
    const f = heroFrame(1, 4);
    expect(f.pieces.every((t) => t === 1)).toBe(true);
    expect([f.tilt, f.scale, f.base]).toEqual([0, 1, 1]);
    expect(f.glow).toBeGreaterThan(0.8);
  });
  it("is the same at the same point whichever way you scrolled (reversible)", () => {
    expect(heroFrame(0.37, 9)).toEqual(heroFrame(0.37, 9));
  });
  it("under reduced motion: the finished screen, with the headline and both buttons fully there", () => {
    const f = stillFrame(4);
    expect(f.pieces.every((t) => t === 1)).toBe(true);
    expect([f.base, f.tilt, f.scale]).toEqual([1, 0, 1]);
    expect([f.headY, f.headOpacity, f.ctas, f.hint]).toEqual([0, 1, 1, false]);
  });
  it("the screen rises into the headline's room as the headline lifts away", () => {
    expect([heroFrame(0, 4).drop, heroFrame(0, 4).headOpacity]).toEqual([1, 1]);
    expect([heroFrame(1, 4).drop, heroFrame(1, 4).headOpacity]).toEqual([0, 0]);
    expect(heroFrame(0.36, 4).drop).toBeGreaterThan(0);
    expect(heroFrame(0.36, 4).drop).toBeLessThan(1);
  });
});
