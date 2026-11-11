import { volumeWords, type Enquiry } from "./enquiry";

type Env = Record<string, string | undefined>;
const HOW_MAX = 500;

/**
 * Into the licence dashboard's Enquiries (license.lumecrm.in), with the website's token. The multi-step form's two
 * new answers (what's going wrong, leads a month) go as their own fields; a dashboard that doesn't know them yet
 * answers 400, and then the enquiry is sent once more in the old shape with those answers written into "how", so
 * the website and the dashboard can be updated in either order and no enquiry is lost.
 */
export async function fileWithLicence(d: Enquiry, env: Env = process.env): Promise<boolean> {
  if (!env.LICENCE_URL || !env.ENQUIRY_TOKEN) return false;
  const old = {
    name: d.name,
    business: d.business,
    whatsapp: d.whatsapp,
    email: d.email ?? null,
    teamSize: d.teamSize,
    how: d.how ?? null,
  };
  const post = async (body: unknown): Promise<number> => {
    const r = await fetch(`${env.LICENCE_URL}/v1/enquiries`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.ENQUIRY_TOKEN}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(6000),
    });
    return r.status;
  };
  try {
    if (!d.need && !d.volume) return (await post(old)) === 201;
    const status = await post({ ...old, need: d.need ?? null, volume: d.volume ?? null });
    if (status === 201) return true;
    if (status !== 400) return false;
    const folded = [
      d.how,
      d.need ? `Needs: ${d.need}` : "",
      d.volume ? `Leads a month: ${volumeWords(d.volume)}` : "",
    ]
      .filter(Boolean)
      .join(". ")
      .slice(0, HOW_MAX);
    return (await post({ ...old, how: folded })) === 201;
  } catch {
    return false;
  }
}
