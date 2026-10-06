import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "./Reveal";
import { activeSection } from "./sections";

const reduce = (on: boolean) =>
  vi.spyOn(window, "matchMedia").mockImplementation(
    (q: string) =>
      ({
        matches: on && q.includes("reduce"),
        media: q,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        onchange: null,
        dispatchEvent: () => false,
      }) as MediaQueryList,
  );
afterEach(() => vi.restoreAllMocks());

describe("Reveal", () => {
  it("under reduced motion, the content is simply there", () => {
    reduce(true);
    render(<Reveal>Hello</Reveal>);
    const el = screen.getByText("Hello");
    expect(el.closest("[data-reveal]")).toHaveAttribute("data-reveal", "static");
  });
  it("with motion, it starts hidden and is shown once it enters the view", async () => {
    reduce(false);
    let cb: IntersectionObserverCallback = () => undefined;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(c: IntersectionObserverCallback) {
          cb = c;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );
    render(<Reveal>Hi</Reveal>);
    const box = screen.getByText("Hi").closest("[data-reveal]")!;
    expect(box).toHaveAttribute("data-reveal", "waiting");
    await act(async () =>
      cb(
        [{ isIntersecting: true, target: box } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    expect(box).toHaveAttribute("data-reveal", "shown");
    vi.unstubAllGlobals();
  });
});

describe("the active section", () => {
  it("is the one crossing the line 40% down the window", () => {
    const boxes = [
      { id: "a", top: -800, bottom: -100 },
      { id: "b", top: -100, bottom: 600 },
      { id: "c", top: 600, bottom: 1400 },
    ];
    expect(activeSection(boxes, 1000)).toBe("b");
    expect(
      activeSection(
        boxes.map((b) => ({ ...b, top: b.top + 900, bottom: b.bottom + 900 })),
        1000,
      ),
    ).toBe("a");
    expect(activeSection([], 1000)).toBeNull();
  });
});
