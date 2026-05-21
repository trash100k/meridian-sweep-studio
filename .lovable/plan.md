# Plan: Make Contact Front-and-Center (Unobtrusively)

The site reads beautifully but never closes. We'll add five quiet conversion surfaces that all reinforce the same call-to-action, then sweep accessibility so they're usable for everyone.

## 1. Persistent "Call" Glass Pill (every page)

A new `<CallPill />` component fixed to the bottom-right.

- Glass styling matching `LiquidGlassCard` (dusk tint, blur, ember border on hover)
- Shows phone icon + `(601) 604-0461` on desktop; collapses to icon-only on mobile (with full label revealed on tap)
- Renders an `<a href="tel:…">` so it triggers the dialer on mobile and copy-on-click on desktop
- Hidden on the homepage until `t > 0.05` so it doesn't break the Act I cinema; always visible elsewhere
- Mounted in `__root.tsx` so it persists across route changes
- Respects `prefers-reduced-motion` for the entrance fade
- 44×44 minimum tap target, `aria-label="Call Affordable Landscaping at (601) 604-0461"`

## 2. Nav Right-Side CTA

In `SiteNav.tsx`, add a small phone link to the right of the desktop link list:

- `📞 (601) 604-0461` in ember, mono micro-caps
- On mobile overlay, the phone number becomes a large tappable line beneath the menu links

## 3. Homepage Final Act: "Three Reasons to Call" Card

Inside the existing Act IV liquid glass card (or as a sibling that appears at `t > 0.92`), add a small "Prefer to talk?" footer block under the diagnostic result with three one-line reasons:

1. **Free yard walk** — no obligation, no upsell
2. **Same-week scheduling** — Meridian + 25 mi
3. **Real person answers** — one business day, no call center

Each reason is a tiny row with an ember bullet, then the phone number as a tap-to-call button beneath.

## 4. Inline CTA Band on Sub-Pages

A new `<CallBand />` block used once per content page (services, process, results, about, faq) before the footer:

- Dusk gradient panel with ember left border
- Headline varies per page to give multiple reasons:
  - **Services**: "Not sure which service fits? We'll tell you straight."
  - **Process**: "Skip the guesswork — book the free yard walk."
  - **Results**: "Want results like these on your lawn?"
  - **About**: "Talk to the family who'll actually be on your yard."
  - **FAQ**: "Still have questions? We pick up the phone."
- Two actions: primary `Call (601) 604-0461`, secondary `Run free diagnostic →`

## 5. Contact Page Trust Upgrade

Promote the existing phone card on `/contact`:

- Make Phone the full-width hero card above the email/area cards, with "Answered by a real person, one business day" microcopy
- Add response-time + service-area chips below

## 6. Accessibility Sweep

- Add visible focus rings (`focus-visible:ring-2 focus-visible:ring-ember`) to all nav links, CallPill, CallBand buttons, and form inputs that currently rely on default outline
- Promote `<a>` and `<button>` tap targets to `min-h-11 min-w-11` site-wide where they're currently smaller (mobile menu toggle, footer links, skip-the-story link)
- Add `aria-label` to the homepage logo button ("Restart story"), the mobile menu toggle already has one — verify
- Ensure `bone/70` text meets contrast on the dusk gradient; bump to `bone/85` where it fails on the lighter glass panels
- Confirm there's exactly one `<main>` per route — wrap `<Outlet />` in `__root.tsx` with `<main>` and remove any inner `<main>` from page shells
- Add `aria-live="polite"` to the diagnostic result reveal so screen readers announce the grade
- Add `lang="en"` to the root `<html>` if missing

## Files Changed

**Created**
- `src/components/CallPill.tsx` — sticky glass phone pill
- `src/components/CallBand.tsx` — inline section CTA

**Edited**
- `src/routes/__root.tsx` — mount `<CallPill />`, ensure single `<main>`, add `lang`
- `src/components/SiteNav.tsx` — desktop phone CTA + mobile overlay phone line + focus rings
- `src/components/SiteFooter.tsx` — phone becomes a tel: link, focus rings
- `src/routes/index.tsx` — "three reasons" block inside Act IV, aria-label on logo restart button
- `src/routes/contact.tsx` — promote phone card, add response chips
- `src/routes/services.tsx`, `process.tsx`, `results.tsx`, `about.tsx`, `faq.tsx` — add `<CallBand />` before footer with page-specific copy
- `src/components/DiagnosticEngine.tsx` — `aria-live` on result reveal
- `src/styles.css` — `.focus-ring` utility, `.call-pill` glass tokens

**Not touched**
- `SunsetStage.tsx`, `useScrollJack.ts`, `LiquidGlassCard.tsx`, `PageShell.tsx`, backend, schema

## Open Questions (will assume defaults unless you say otherwise)

- CallPill behavior on the homepage: I'll hide it during Act I (`t < 0.05`) and fade in for the rest of the scroll
- "Three reasons" copy above is a first draft in your Silent Siphon voice — easy to swap
- No SMS/text option added; phone + diagnostic only. Say the word if you want a "Text us" path too.
