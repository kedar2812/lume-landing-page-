/* LUME's line icons, drawn at 16 px with the app's 1.6 stroke (Lucide-style, as the app uses). */
import type { ReactNode } from "react";

const I = ({ children, size = 16 }: { children: ReactNode; size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const Ico = {
  today: (
    <I>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </I>
  ),
  leads: (
    <I>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" />
    </I>
  ),
  pipeline: (
    <I>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16M15 4v16" />
    </I>
  ),
  calendar: (
    <I>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </I>
  ),
  templates: (
    <I>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </I>
  ),
  analytics: (
    <I>
      <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />
    </I>
  ),
  settings: (
    <I>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </I>
  ),
  search: (
    <I>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </I>
  ),
  bell: (
    <I size={18}>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" />
    </I>
  ),
  rupee: (
    <I>
      <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10" />
    </I>
  ),
  video: (
    <I>
      <path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 11" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </I>
  ),
  check: (
    <I size={13}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </I>
  ),
  list: (
    <I>
      <path d="m3 7 2 2 4-4M3 17l2 2 4-4M13 6h8M13 12h8M13 18h8" />
    </I>
  ),
  reply: (
    <I>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z" />
    </I>
  ),
  team: (
    <I>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" />
    </I>
  ),
  trendUp: (
    <I size={12}>
      <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />
    </I>
  ),
  trendDown: (
    <I size={12}>
      <path d="m3 7 6 6 4-4 8 8M15 17h6v-6" />
    </I>
  ),
  refresh: (
    <I>
      <path d="M21 12a9 9 0 1 1-2.6-6.4L21 8M21 3v5h-5" />
    </I>
  ),
  filter: (
    <I>
      <path d="M3 5h18M6 12h12M10 19h4" />
    </I>
  ),
  download: (
    <I>
      <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
    </I>
  ),
  chevron: (
    <I size={13}>
      <path d="m6 9 6 6 6-6" />
    </I>
  ),
};
