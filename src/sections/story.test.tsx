import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Chapter } from "@/components/Chapter";
import { Solves } from "@/components/Solves";
import { PROBLEMS, Problems } from "./Problems";

describe("the story: problems, then LUME's answers (website spec §5.0)", () => {
  it("six numbered problems, each one anchor the answers link back to", () => {
    render(<Problems />);
    expect(screen.getByRole("heading", { level: 2, name: "Sound familiar?" })).toBeInTheDocument();
    const list = screen.getByRole("list", { name: "The problems" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(6);
    expect(items.map((li) => li.id)).toEqual([
      "problem-01",
      "problem-02",
      "problem-03",
      "problem-04",
      "problem-05",
      "problem-06",
    ]);
    expect(within(items[0]!).getByText("01")).toBeInTheDocument();
    expect(PROBLEMS.map((p) => p.title)).toEqual([
      "Your leads are in five places.",
      "The first reply comes days later.",
      "Follow-ups slip through the cracks.",
      "You can’t see who’s doing the work.",
      "You don’t know which leads and ads pay.",
      "When a salesperson leaves, the leads leave too.",
    ]);
  });

  it("the one study is quoted with its source", () => {
    render(<Problems />);
    expect(screen.getByText("21×")).toBeInTheDocument();
    expect(
      screen.getByText(/Oldroyd, Lead Response Management Study, MIT and InsideSales, 2007/),
    ).toBeInTheDocument();
  });

  it("a solution says which problem it solves, and links back to it", () => {
    render(<Solves n={2} />);
    const link = screen.getByRole("link", { name: /Solves 02 · The first reply comes days later/ });
    expect(link).toHaveAttribute("href", "#problem-02");
  });

  it("a chapter opens with its number and name", () => {
    render(
      <Chapter
        id="meet"
        n={2}
        title="Meet LUME"
        line="Every problem above, answered — on one screen your team opens every morning."
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Meet LUME" })).toBeInTheDocument();
    expect(screen.getByText("Chapter 2")).toBeInTheDocument();
  });
});
