
# Turn Silent Siphon into a multi-page website

Keep the cinematic homepage intact. Add a hover-revealed glass nav, six new routes, and a dedicated diagnostic page so the form is deep-linkable while Act IV still closes the homepage scroll.

## Site map

```
/              Home — current Act I–IV sunset experience + nav reveal at top
/diagnostic    Standalone Silent Siphon diagnostic (form + result, no scroll-jack)
/services      Aeration, soil remediation, drainage, lawn rescue offerings
/process       Diagnose → plan → restore → steward (4-step explainer)
/results       Before/after grades, soil score lift, brief testimonial cards
/about         Stewards, philosophy, service area (Meridian + ZIPs)
/contact       Phone, email, contact form, service-area note
/faq           Red clay, pricing tiers, scheduling, what to expect
```

Total: 8 routes (home + 7 sub-pages).

## Navigation pattern — "hidden until hover"

A new `<SiteNav />` component lives in `__root.tsx` so every route gets it.

- **On `/`** (homepage): nav is fully hidden by default. Reveal when:
  - cursor enters the top 80px of the viewport, OR
  - `act4Reveal > 0.6` (form is showing), OR
  - user scrolls/swipes on any non-home route (always visible there).
- **On any other route**: nav is always visible, pinned top with a thin liquid-glass bar.
- Style: same dusk palette, `bone/80` text, `text-shadow` from `.copy-shadow`, a soft `backdrop-blur` glass strip ~56px tall. Logo left ("Silent Siphon" wordmark in Instrument Serif), links right (Diagnostic, Services, Process, Results, About, Contact). Mobile (≤768px): collapses to a single menu button that opens a full-screen dusk overlay.
- Spring motion: `transform: translateY(-100%)` → `0` with a 280ms cubic ease, matching the existing "apple snappy" feel.

## Homepage changes

- Mount `<SiteNav variant="home" />` at the top.
- Act IV (form) stays exactly as today — it's the cinematic close.
- Add a small "Skip the story → run diagnostic" link in the bottom corner that routes to `/diagnostic`. Fades in with the scroll hint.
- Footer credit gets a secondary line of small nav links so the homepage is still self-sufficient for someone who scrolls all the way through.

## /diagnostic page (new)

Direct route to the lead form without the scroll-jack so it's shareable, ad-linkable, and works on slow devices.

- Reuses `<DiagnosticEngine />` exactly as built (form + SunsetLoader + result reveal). No code duplication.
- Wrapper page provides:
  - A short hero ("Free 60-second soil diagnostic. No call required.")
  - The engine card centered, with the same dusk gradient background but *static* (no canvas animation) so it loads instantly.
  - Trust strip below: "Used by 30+ Meridian homeowners · Soil data from ISRIC SoilGrids · Your address is never shared."
- `head()` meta: title "Free Lawn Soil Diagnostic — Silent Siphon", description tuned for paid traffic.

## /services, /process, /results, /about, /contact, /faq

Each is a real route file with its own `head()` (unique title, description, og:title, og:description). All share:

- Dusk gradient background (CSS only, no canvas) for visual continuity with the homepage.
- `.readability-scrim` + `.copy-shadow` utilities already in `styles.css` for legible copy.
- A reusable `<PageHero>` component (eyebrow label + Instrument Serif headline + body).
- A reusable `<PageSection>` wrapper with consistent vertical rhythm.
- Footer: same as homepage, with nav links + service area.

Content scaffolding per page:

- **/services** — 4 service cards (Diagnostic, Core Aeration, Deep Soil Restoration, Drainage Engineering), each with what it solves, what's included, when to book. CTA to `/diagnostic`.
- **/process** — 4 numbered steps (Diagnose, Map, Restore, Steward) as alternating left/right blocks. CTA to `/diagnostic`.
- **/results** — grid of before/after grade cards (e.g. "Grade F → Grade B in one season"), 2–3 short testimonial quotes. CTA to `/diagnostic`.
- **/about** — Stewards intro, philosophy paragraph, service-area list pulled from `src/config/business.ts`.
- **/contact** — Phone number from `business.ts`, contact form (writes to existing `leads` table via a new `submitContact` server fn — same Zod validation pattern as `runDiagnostic`), service-area note. Optional, can be a simple `mailto:` for v1.
- **/faq** — 8–10 expandable items (reuse `components/ui/accordion`). Covers red clay, pricing tiers, scheduling, what aeration actually does, why diagnostic is free.

## SEO

Every route gets distinct `head()` meta (title, description, og:title, og:description). Single H1 per page. Semantic `<main>`, `<section>`, `<nav>`, `<footer>`. No og:image at root — only at leaves once we have hero artwork.

## Files touched / created

**New:**
- `src/components/SiteNav.tsx` — hover/scroll-aware glass nav
- `src/components/SiteFooter.tsx` — shared footer with nav links
- `src/components/PageHero.tsx`, `src/components/PageSection.tsx` — reusable layout primitives
- `src/routes/diagnostic.tsx`
- `src/routes/services.tsx`
- `src/routes/process.tsx`
- `src/routes/results.tsx`
- `src/routes/about.tsx`
- `src/routes/contact.tsx`
- `src/routes/faq.tsx`

**Edited:**
- `src/routes/__root.tsx` — mount `<SiteNav />` + `<SiteFooter />` around `<Outlet />`
- `src/routes/index.tsx` — pass `variant="home"` to nav, add "skip" link
- `src/styles.css` — nav reveal transitions, page-hero utility classes (if needed)
- `src/lib/diagnostic.functions.ts` — optional `submitContact` server fn if we wire the contact form to the DB (deferred unless you want it now)

**No changes:** `DiagnosticEngine.tsx`, `SunsetStage.tsx`, `useScrollJack.ts`, `LiquidGlassCard.tsx`, `routeTree.gen.ts` (auto-regenerates), backend schema.

## Open items I'll default unless you say otherwise

1. **Contact form storage** — default: simple `mailto:` link for v1, no new server fn. Say "wire contact to DB" if you'd rather persist submissions.
2. **Page copy** — I'll write placeholder copy in the Silent Siphon voice (sparse, confident, dusk-coded). Swap any line later.
3. **Mobile nav** — full-screen dusk overlay with the 7 links stacked in Instrument Serif. No hamburger animation gimmicks.
