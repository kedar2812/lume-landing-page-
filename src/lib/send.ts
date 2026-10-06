import type { Enquiry } from "./enquiry";

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
