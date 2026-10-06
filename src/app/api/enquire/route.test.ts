// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const OK = {
  name: "Ananya Rao",
  business: "Petal & Plate Studio",
  whatsapp: "98123 45678",
  teamSize: "2-5",
  website: "",
  t: 9000,
};
const ENV = {
  LICENCE_URL: "https://licence.test",
  ENQUIRY_TOKEN: "tok-secret-123",
  RESEND_API_KEY: "re_secret_456",
  ENQUIRY_TO: "owner@example.com",
  NEXT_PUBLIC_WHATSAPP: "918805895066",
};
let calls: string[] = [];
const mockFetch = (o: { licence: number; resend: number }) => {
  calls = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      calls.push(url);
      return new Response("{}", { status: url.includes("resend") ? o.resend : o.licence });
    }),
  );
};
const req = (body: unknown) =>
  new Request("https://lumecrm.in/api/enquire", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
  });
const formReq = (body: Record<string, string | number>) =>
  new Request("https://lumecrm.in/api/enquire", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "text/html" },
    body: new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v)])).toString(),
  });

beforeEach(() => {
  for (const [k, v] of Object.entries(ENV)) vi.stubEnv(k, v);
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/enquire (website spec §8)", () => {
  it("files with the licence dashboard and emails the owner; either alone is enough", async () => {
    mockFetch({ licence: 201, resend: 200 });
    expect(await (await POST(req(OK))).json()).toEqual({ ok: true, filed: true, emailed: true });
    mockFetch({ licence: 500, resend: 200 });
    expect(await (await POST(req(OK))).json()).toEqual({ ok: true, filed: false, emailed: true });
    mockFetch({ licence: 201, resend: 500 });
    expect(await (await POST(req(OK))).json()).toEqual({ ok: true, filed: true, emailed: false });
  });
  it("sends the licence dashboard exactly the enquiry, with the token", async () => {
    mockFetch({ licence: 201, resend: 200 });
    await POST(req({ ...OK, email: "a@example.com", how: "Instagram" }));
    const f = vi.mocked(fetch);
    const [url, init] = f.mock.calls.find(([u]) => String(u).includes("licence"))!;
    expect(url).toBe("https://licence.test/v1/enquiries");
    expect((init!.headers as Record<string, string>).authorization).toBe("Bearer tok-secret-123");
    expect(JSON.parse(String(init!.body))).toEqual({
      name: "Ananya Rao",
      business: "Petal & Plate Studio",
      whatsapp: "+919812345678",
      email: "a@example.com",
      teamSize: "2-5",
      how: "Instagram",
    });
  });
  it("both down: says so and hands back WhatsApp with the details written", async () => {
    mockFetch({ licence: 500, resend: 500 });
    const r = await POST(req(OK));
    expect(r.status).toBe(502);
    const { whatsapp } = (await r.json()) as { whatsapp: string };
    expect(whatsapp).toMatch(/^https:\/\/wa\.me\/918805895066\?text=/);
    expect(decodeURIComponent(whatsapp)).toContain("Petal & Plate Studio");
  });
  it("a bot is thanked and dropped: the hidden field filled, or sent in under 3 seconds", async () => {
    mockFetch({ licence: 201, resend: 200 });
    expect((await POST(req({ ...OK, website: "spam.example" }))).status).toBe(200);
    expect((await POST(req({ ...OK, t: 800 }))).status).toBe(200);
    expect(calls).toHaveLength(0);
  });
  it("what isn't an enquiry is refused, in words, per field", async () => {
    mockFetch({ licence: 201, resend: 200 });
    const r = await POST(req({ ...OK, whatsapp: "123" }));
    expect(r.status).toBe(400);
    expect(await r.json()).toMatchObject({ errors: { whatsapp: expect.any(String) } });
  });
  it("a form posted without JavaScript comes back to the form", async () => {
    mockFetch({ licence: 201, resend: 200 });
    const r = await POST(formReq(OK));
    expect([r.status, r.headers.get("location")]).toEqual([303, "/?sent=1#enquire"]);
    mockFetch({ licence: 500, resend: 500 });
    const down = await POST(formReq(OK));
    expect(down.headers.get("location")).toMatch(/^https:\/\/wa\.me\/918805895066/);
  });
  it("never hands the owner's email or the keys to the browser, and never logs them", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mockFetch({ licence: 500, resend: 500 });
    const body = await (await POST(req(OK))).text();
    const printed = JSON.stringify([log.mock.calls, err.mock.calls]);
    for (const secret of ["owner@example.com", "tok-secret-123", "re_secret_456"]) {
      expect(body).not.toContain(secret);
      expect(printed).not.toContain(secret);
    }
  });
});
