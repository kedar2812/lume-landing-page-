import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tour, TOUR_SRC } from "./Tour";

describe("the tour (owner, 2026-10-11)", () => {
  it("names itself and carries the Supademo tour, loaded only as it comes near", () => {
    render(<Tour />);
    expect(screen.getByRole("heading", { name: "Watch LUME answer every lead." })).toBeInTheDocument();
    const frame = screen.getByTitle("LUME, the 2-minute tour");
    expect(frame).toHaveAttribute("src", TOUR_SRC);
    expect(frame).toHaveAttribute("loading", "lazy");
    expect(TOUR_SRC).toMatch(/^https:\/\/app\.supademo\.com\/embed\//);
  });

  it("is a page section others can link to, its live gradient hidden from assistive tech", () => {
    const { container } = render(<Tour />);
    expect(container.querySelector("section#tour")).not.toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')?.children.length).toBe(4);
  });
});
