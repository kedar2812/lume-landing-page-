// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { enquirySchema, whatsappLink, type Enquiry } from "./enquiry";
import { fileWithLicence } from "./send";

const ENV = { LICENCE_URL: "https://licence.test", ENQUIRY_TOKEN: "tok_test" };
const BASE: Enquiry = {
  name: "Asha Verma",
  business: "Northlight Studio",
  whatsapp: "+919812345678",
  teamSize: "2-5",
  email: undefined,
  how: "Instagram, Website",
  need: undefined,
  volume: undefined,
};
const answers = (...status: number[]) => {
  const f = vi.fn();
  for (const s of status) f.mockResolvedValueOnce(new Response(null, { status: s }));
  vi.stubGlobal("fetch", f);
  return f;
};
const sent = (f: ReturnType<typeof vi.fn>, call = 0) => JSON.parse(String(f.mock.calls[call]![1].body));

afterEach(() => vi.unstubAllGlobals());

describe("the multi-step form's two new answers", () => {
  it("are optional, and checked: what's going wrong (words) and how many leads a month (one of four)", () => {
    const ok = { name: "A", business: "B", whatsapp: "98123 45678", teamSize: "1" };
    expect(enquirySchema.safeParse(ok).success).toBe(true);
    const p = enquirySchema.safeParse({ ...ok, need: " Replies go out late ", volume: "50-200" });
    expect(p.success && p.data.need).toBe("Replies go out late");
    expect(p.success && p.data.volume).toBe("50-200");
    expect(enquirySchema.safeParse({ ...ok, volume: "lots" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...ok, need: "x".repeat(301) }).success).toBe(false);
    const blank = enquirySchema.safeParse({ ...ok, need: "", volume: "" });
    expect(blank.success && blank.data.need).toBeUndefined();
    expect(blank.success && blank.data.volume).toBeUndefined();
  });
  it("go into the WhatsApp message written for the visitor when all else fails", () => {
    const text = decodeURIComponent(
      whatsappLink({ ...BASE, need: "Follow-ups get forgotten", volume: "200-1000" }, "919764256655"),
    );
    expect(text).toContain("Follow-ups get forgotten");
    expect(text).toContain("200 to 1,000 leads a month");
  });
});

describe("filing with the licence dashboard", () => {
  it("sends the old shape exactly when the new answers weren't given", async () => {
    const f = answers(201);
    expect(await fileWithLicence(BASE, ENV)).toBe(true);
    expect(sent(f)).toEqual({
      name: "Asha Verma",
      business: "Northlight Studio",
      whatsapp: "+919812345678",
      email: null,
      teamSize: "2-5",
      how: "Instagram, Website",
    });
    expect(f).toHaveBeenCalledTimes(1);
  });
  it("sends the new answers as their own fields", async () => {
    const f = answers(201);
    expect(await fileWithLicence({ ...BASE, need: "Replies go out late", volume: "50-200" }, ENV)).toBe(true);
    expect(sent(f)).toMatchObject({
      need: "Replies go out late",
      volume: "50-200",
      how: "Instagram, Website",
    });
  });
  it("a dashboard that doesn't know them yet still gets the enquiry, with the answers written into 'how'", async () => {
    const f = answers(400, 201);
    expect(await fileWithLicence({ ...BASE, need: "Replies go out late", volume: "50-200" }, ENV)).toBe(true);
    expect(f).toHaveBeenCalledTimes(2);
    const second = sent(f, 1);
    expect(second).not.toHaveProperty("need");
    expect(second).not.toHaveProperty("volume");
    expect(second.how).toBe("Instagram, Website. Needs: Replies go out late. Leads a month: 50 to 200");
    expect(second.how.length).toBeLessThanOrEqual(500);
  });
  it("never retries an enquiry that had nothing new in it, and gives up after the one retry", async () => {
    const plain = answers(400);
    expect(await fileWithLicence(BASE, ENV)).toBe(false);
    expect(plain).toHaveBeenCalledTimes(1);
    const twice = answers(400, 400);
    expect(await fileWithLicence({ ...BASE, volume: "1000+" }, ENV)).toBe(false);
    expect(twice).toHaveBeenCalledTimes(2);
  });
  it("keeps the folded 'how' inside the dashboard's 500 characters", async () => {
    const f = answers(400, 201);
    await fileWithLicence(
      { ...BASE, how: "x".repeat(495), need: "Replies go out late", volume: "50-200" },
      ENV,
    );
    expect(sent(f, 1).how.length).toBeLessThanOrEqual(500);
  });
  it("a dashboard that is down is not asked twice", async () => {
    const f = answers(503);
    expect(await fileWithLicence({ ...BASE, need: "Replies go out late" }, ENV)).toBe(false);
    expect(f).toHaveBeenCalledTimes(1);
  });
});
