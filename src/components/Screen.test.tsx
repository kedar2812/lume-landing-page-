import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/screens", () => ({
  SCREENS: {
    today: { width: 2880, height: 1800, phone: false },
    "today-phone": { width: 1170, height: 2532, phone: true },
  },
  srcOf: (n: string, t: string, p?: boolean) =>
    `/screens/${n.replace(/-phone$/, "")}-${t}${p ? "-phone" : ""}.webp`,
}));
import { Screen } from "./Screen";

describe("a LUME capture, in the other theme to the page", () => {
  it("carries both themes' captures, sized, with the description once", () => {
    render(<Screen name="today" alt="LUME's Today" />);
    const imgs = [...document.querySelectorAll("img")];
    expect(imgs.map((i) => i.getAttribute("src"))).toEqual([
      "/screens/today-light.webp",
      "/screens/today-dark.webp",
    ]);
    expect(imgs.map((i) => i.dataset.themeImg)).toEqual(["light", "dark"]);
    // Named once, on the wrapper: whichever capture the theme shows, it's read the same.
    expect(screen.getByRole("img", { name: "LUME's Today" })).toBeInTheDocument();
    expect(imgs.map((i) => i.getAttribute("alt"))).toEqual(["", ""]);
    expect(imgs[0]!.getAttribute("width")).toBe("1440");
    expect(imgs[0]!.getAttribute("height")).toBe("900");
  });
  it("the hero's is fetched first; the rest wait until they're near", () => {
    render(<Screen name="today" alt="x" priority />);
    expect(document.querySelector("img")!.getAttribute("loading")).toBe("eager");
    expect(document.querySelector("img")!.getAttribute("fetchpriority")).toBe("high");
  });
  it("a phone capture is sized as a phone", () => {
    render(<Screen name="today-phone" alt="On a phone" />);
    expect(document.querySelector("img")!.getAttribute("width")).toBe("390");
  });
});
