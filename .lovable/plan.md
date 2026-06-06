## Goal
Replace the current flat oversized-serif headlines across the site with a true 3-tier editorial hierarchy: **eyebrow → headline → supporting line**, matching the selected "Editorial Sunset" direction.

## What changes (visual only)

Every display moment on the site now uses the same hierarchy:

```
─── THE STEWARDS ───        ← eyebrow: Inter 11px, wheat, uppercase, tracking 0.4em, flanked by short ember rules
Display Serif Headline.     ← Instrument Serif, 5xl→8xl, bone, leading 1.02, with italic-ember + wheat color accents on a key phrase
"Supporting italic line."   ← Instrument Serif italic, 2xl→3xl, bone/70
```

Color rhythm: bone for the main words, ember (italic) for the brand phrase, wheat for the closing payoff phrase. Eyebrow uses the existing `--ember/40` hairlines + wheat label.

## Files touched (frontend / presentation only)

1. **`src/components/PageShell.tsx` → `PageHero`**
   Rebuild the hero block so every page hero (`/about`, `/services`, `/process`, `/diagnostic`, `/faq`, `/contact`, `/results`) gets the new hierarchy:
   - eyebrow row with flanking ember hairlines
   - serif headline, leading 1.02, with the existing `title` slot used as-is (so per-page italic/color accents already inline keep working)
   - support line rendered as italic serif at `text-bone/70` instead of the current plain paragraph

2. **`src/routes/index.tsx` (Acts I, II, III)**
   Apply the same three-tier shape to all three crossfading copy panels:
   - Act I — eyebrow "The Diagnosis" (new), keep existing two-line serif headline, support line italicized
   - Act II — eyebrow "The Red Clay Problem" already exists; add flanking ember rules; italicize the support line
   - Act III — **rewrite to the locked copy**:
     - eyebrow: `THE STEWARDS`
     - headline: `Meridian's Premiere ` + *Lawn Stewards* (italic ember) + ` are the key to your best ` + `lawn & garden.` (wheat)
     - support: `"Six inches deeper than anyone else looks."` (italic, bone/70)

3. **`src/styles.css`** — add two small utilities used by the hierarchy so we don't repeat Tailwind soup:
   - `@utility eyebrow` → uppercase, tracking 0.4em, 11px, wheat, Inter 600
   - `@utility eyebrow-rule` → 1px × 3rem ember/40 hairline
   - `@utility support-line` → Instrument Serif italic, bone/70, responsive 2xl→3xl

   (Tailwind v4 `@utility` form, not `@layer utilities`.)

4. **`src/components/SunsetStage.tsx`** — no logic change; just confirm the existing scrim opacity still keeps the wheat eyebrow legible (no edits expected unless contrast fails QA).

## What stays the same
- All routing, data, server functions, scroll-jack, glassmorphism arrow, Lovable Cloud wiring, diagnostic engine, business config.
- Photographic backgrounds, sunset stage animation, nav, footer, call pill.
- Copy on pages other than Act III remains as-is.

## Acceptance
- Every hero on the site reads as **eyebrow → headline → support**, with consistent spacing rhythm and the ember-hairline eyebrow treatment.
- Home Act III renders the exact locked copy with italic ember on "Lawn Stewards" and wheat on "lawn & garden."
- No layout/route changes; no business-logic changes.
