import { describe, expect, it } from "vitest";
import { along } from "./build";

describe("a build-up's timing (website spec §5.H: the same motion everywhere)", () => {
  it("is 0 before its stretch of the scroll, 1 after, and eases with no overshoot in between", () => {
    expect(along(0, 0.2, 0.5)).toBe(0);
    expect(along(0.2, 0.2, 0.5)).toBe(0);
    expect(along(0.7, 0.2, 0.5)).toBe(1);
    expect(along(1, 0.2, 0.5)).toBe(1);
    const mid = along(0.45, 0.2, 0.5);
    expect(mid).toBeGreaterThan(0.5);
    expect(mid).toBeLessThan(1);
    for (let p = 0; p <= 1; p += 0.01) expect(along(p, 0.2, 0.5)).toBeLessThanOrEqual(1);
  });
  it("is the same at the same point whichever way you scrolled", () => {
    expect(along(0.33, 0.1, 0.6)).toBe(along(0.33, 0.1, 0.6));
  });
});
