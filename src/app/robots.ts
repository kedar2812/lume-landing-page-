import type { MetadataRoute } from "next";

/** Search engines are welcome everywhere; the map lists the three pages. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://lumecrm.in/sitemap.xml" };
}
