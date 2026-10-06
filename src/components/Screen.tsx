/* eslint-disable @next/next/no-img-element -- both themes' captures are plain <img> pairs, sized and swapped by CSS */
import { SCREENS, srcOf, type ScreenName } from "@/lib/screens";
import s from "./screen.module.css";

/**
 * A real LUME capture in the page's theme (website spec §8): Porcelain and Obsidian side by side in the markup,
 * CSS showing the one that matches <html data-theme>, so a theme switch swaps every capture at once with no
 * fetch and no shift. Sized to its CSS pixels (captures are 2× or 3×).
 */
export function Screen({
  name,
  alt,
  priority,
  className,
}: {
  name: ScreenName;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const shot = SCREENS[name];
  const k = shot.phone ? 3 : 2;
  const common = {
    width: shot.width / k,
    height: shot.height / k,
    decoding: "async" as const,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    fetchPriority: priority ? ("high" as const) : ("auto" as const),
  };
  return (
    <span className={`${s.screen} ${shot.phone ? s.phone : ""} ${className ?? ""}`}>
      <img {...common} src={srcOf(name, "light", shot.phone)} alt={alt} data-theme-img="light" />
      <img {...common} src={srcOf(name, "dark", shot.phone)} alt="" data-theme-img="dark" />
    </span>
  );
}
