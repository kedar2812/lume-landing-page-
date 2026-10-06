@AGENTS.md

# lumecrm.in — the LUME product website

The public site that sells LUME (a lead management product licensed to many businesses) and turns visitors into
enquiries. Spec and plan live in the LUME repo: `docs/superpowers/specs/2026-10-06-lumecrm-website-design.md`,
`docs/superpowers/plans/2026-10-06-website-w3-site.md`.

- No prices anywhere. Calls to action are "Book a demo" and "WhatsApp us".
- Every claim is something LUME does in production today; every product image is a real LUME capture
  (`public/screens/`, made by the LUME repo's `site-captures` run); numbers are measured or the demo's own.
- Copy speaks as LUME, never a faceless "we"; never guesses anyone's gender; no client names.
- The logo is `public/lume-mark.png` as it is, never redrawn. Third-party logos: official, unmodified files only.
- One accent, LUME blue #2A5BFF; no violet.
- `/privacy` and `/terms` are what Google verified: change their Google wording only with the LUME repo's code.
- Config in environment variables, never in code; secrets never committed or logged.
- Flawless from a 320 px phone to 4K, light and dark, motion and reduced motion.
