import { enquirySchema, whatsappLink } from "@/lib/enquiry";
import { emailOwner, fileWithLicence } from "@/lib/send";

export const dynamic = "force-dynamic";
/** Faster than a person fills five fields: a bot. */
const MIN_MS = 3000;

/**
 * An enquiry from the form (website spec §8): to the licence dashboard and the owner's inbox, either one enough;
 * if both are down, the visitor is handed WhatsApp with their details written, so no enquiry is lost. Works as
 * a plain form post too (no JavaScript): then it answers with a redirect. Logs only what happened, never what
 * was sent.
 */
export async function POST(req: Request): Promise<Response> {
  const html = !(req.headers.get("accept") ?? "").includes("application/json");
  let raw: Record<string, unknown>;
  try {
    raw = (req.headers.get("content-type") ?? "").includes("application/json")
      ? ((await req.json()) as Record<string, unknown>)
      : Object.fromEntries((await req.formData()).entries());
  } catch {
    return answer(
      html,
      400,
      { errors: { form: "That didn't arrive whole. Try again." } },
      "/?retry=1#enquire",
    );
  }
  const to = process.env.NEXT_PUBLIC_WHATSAPP ?? "918805895066";

  // A bot: thanked, and nothing sent anywhere.
  if (String(raw.website ?? "") !== "" || Number(raw.t ?? 0) < MIN_MS)
    return answer(html, 200, { ok: true, filed: false, emailed: false }, "/?sent=1#enquire");

  const p = enquirySchema.safeParse(raw);
  if (!p.success) {
    const errors: Record<string, string> = {};
    for (const i of p.error.issues) errors[String(i.path[0] ?? "form")] ??= i.message;
    return answer(html, 400, { errors }, "/?retry=1#enquire");
  }
  const [filed, emailed] = await Promise.all([fileWithLicence(p.data), emailOwner(p.data)]);
  console.log(JSON.stringify({ msg: "enquiry", filed, emailed }));
  if (filed || emailed) return answer(html, 200, { ok: true, filed, emailed }, "/?sent=1#enquire");
  const whatsapp = whatsappLink(p.data, to);
  return answer(html, 502, { ok: false, whatsapp }, whatsapp);
}

function answer(html: boolean, status: number, body: unknown, location: string): Response {
  if (html) return new Response(null, { status: 303, headers: { location } });
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}
