import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Privacy policy — LUME",
  description: "How LUME handles personal data, including data from Google accounts people connect to LUME.",
};
export default function Privacy() {
  return <DocPage file="privacy" />;
}
