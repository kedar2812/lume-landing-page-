import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Enquire } from "./Enquire";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const fill = async () => {
  await userEvent.type(screen.getByLabelText("Your name"), "Ananya Rao");
  await userEvent.type(screen.getByLabelText("Business"), "Petal & Plate Studio");
  await userEvent.type(screen.getByLabelText("WhatsApp number"), "98123 45678");
  await userEvent.click(screen.getByRole("radio", { name: "2–5" }));
};

describe("the enquiry (owner's redesign: seven questions in one go)", () => {
  it("asks all seven at once, as a plain form that works without JavaScript", () => {
    render(<Enquire whatsapp="918805895066" />);
    const form = screen.getByRole("form", { name: "Book a demo" });
    expect(form).toHaveAttribute("action", "/api/enquire");
    expect(form).toHaveAttribute("method", "post");
    for (const l of [
      "Your name",
      "Business",
      "Country code",
      "WhatsApp number",
      "Email (optional)",
      "How do leads reach you today? (optional)",
    ])
      expect(screen.getByLabelText(l)).toBeVisible();
    expect(screen.getByRole("radiogroup", { name: "Team size" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Continue" })).toBeNull();
    expect(screen.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute(
      "href",
      "https://wa.me/918805895066",
    );
  });
  it("the country code: India first and chosen, every other country after", async () => {
    render(<Enquire whatsapp="918805895066" />);
    const code = screen.getByLabelText("Country code") as HTMLSelectElement;
    expect(code.value).toBe("IN");
    expect(code.options[0]!.textContent).toContain("+91");
    expect(code.options.length).toBeGreaterThan(200);
    await userEvent.selectOptions(code, "AE");
    expect(screen.getByTestId("dial")).toHaveTextContent("+971");
  });
  it("never speaks for a person: LUME replies", () => {
    render(<Enquire whatsapp="918805895066" />);
    expect(document.body.textContent).not.toMatch(/founder/i);
  });
  it("says what's missing in words beside the field, before sending", async () => {
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    render(<Enquire whatsapp="918805895066" />);
    await userEvent.click(screen.getByRole("button", { name: "Book my demo" }));
    expect(screen.getByLabelText("Your name")).toHaveAccessibleDescription("Type your name.");
    expect(screen.getByLabelText("Your name")).toHaveAttribute("aria-invalid", "true");
    expect(f).not.toHaveBeenCalled();
  });
  it("sent: the form becomes LUME's promise", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ ok: true, filed: true })),
    );
    vi.spyOn(Date, "now").mockReturnValueOnce(0).mockReturnValue(10_000);
    render(<Enquire whatsapp="918805895066" />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Book my demo" }));
    const done = await screen.findByRole("status");
    expect(done).toHaveTextContent("LUME will reply on WhatsApp to set up your demo.");
    expect(done.textContent).not.toMatch(/founder/i);
  });
  it("the dashboard down: WhatsApp opens with the details", async () => {
    const wa = "https://wa.me/918805895066?text=Hi";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ ok: false, whatsapp: wa }, { status: 502 })),
    );
    const go = vi.fn();
    render(<Enquire whatsapp="918805895066" go={go} />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Book my demo" }));
    await vi.waitFor(() => expect(go).toHaveBeenCalledWith(wa));
  });
});
