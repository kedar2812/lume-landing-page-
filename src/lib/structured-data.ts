/** What search engines read about LUME (schema.org): the software and who makes it, never a price. */
export function structuredData(): Record<string, unknown>[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "LUME",
      url: "https://lumecrm.in",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Lead management for sales teams: leads from every source in one list, the next follow-up on the right person's Today, WhatsApp in one tap, analytics in plain words, on the business's own server.",
      image: "https://lumecrm.in/opengraph-image",
      publisher: { "@type": "Person", name: "Kedar Uttam Gurav" },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "LUME",
      url: "https://lumecrm.in",
      logo: "https://lumecrm.in/lume-mark.png",
      founder: { "@type": "Person", name: "Kedar Uttam Gurav" },
    },
  ];
}
