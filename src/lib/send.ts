import { TEAM_SIZES, type Enquiry } from "./enquiry";

type Env = Record<string, string | undefined>;

/** Into the licence dashboard's Enquiries (license.lumecrm.in), with the website's token. */
export async function fileWithLicence(d: Enquiry, env: Env = process.env): Promise<boolean> {
  if (!env.LICENCE_URL || !env.ENQUIRY_TOKEN) return false;
  try {
    const r = await fetch(`${env.LICENCE_URL}/v1/enquiries`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.ENQUIRY_TOKEN}` },
      body: JSON.stringify({
        name: d.name,
        business: d.business,
        whatsapp: d.whatsapp,
        email: d.email ?? null,
        teamSize: d.teamSize,
        how: d.how ?? null,
      }),
      signal: AbortSignal.timeout(6000),
    });
    return r.status === 201;
  } catch {
    return false;
  }
}

/** An email to the owner (Resend's HTTP API), the address from the environment only. */
export async function emailOwner(d: Enquiry, env: Env = process.env): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.ENQUIRY_TO) return false;
  const team = TEAM_SIZES.find((x) => x.id === d.teamSize)?.label ?? d.teamSize;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: env.ENQUIRY_FROM ?? "LUME website <enquiries@lumecrm.in>",
        to: [env.ENQUIRY_TO],
        subject: `New enquiry: ${d.business}`,
        text: [
          `${d.name} — ${d.business}`,
          `WhatsApp: ${d.whatsapp}`,
          d.email ? `Email: ${d.email}` : "",
          `Team: ${team}`,
          d.how ? `How leads reach them: ${d.how}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      }),
      signal: AbortSignal.timeout(6000),
    });
    return r.ok;
  } catch {
    return false;
  }
}
