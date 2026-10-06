import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Terms of service — LUME",
  description: "The terms for using lumecrm.in and LUME.",
};
export default function Terms() {
  return <DocPage file="terms" />;
}
