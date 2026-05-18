# Final polish — readability + stress-proof

Tighten contrast against the sunset background, lock in defensive guards so the experience can't break under stress (resize, fast scroll, slow network, reduced motion, mobile), and finalize copy hierarchy.

## 1. Readable text on sunset background

The brightest sky band sits behind Acts I–III copy at small viewports. Hero text needs guaranteed contrast.

- `src/routes/index.tsx`: wrap each `ActLayer` copy block in a soft **readability scrim** — a localized radial gradient `linear-gradient(105deg, rgba(8,4,12,0.55) 0%, rgba(8,4,12,0.28) 55%, transparent 85%)` that sits behind the headline/body but doesn't reach the screen edges. Adds ~3:1 → 7:1 contrast without visible boxes.
- Bump body copy from `text-bone/80` → `text-bone/90` and the small mono label intros from `text-bone/60` → `text-bone/75`.
- Add a subtle `text-shadow: 0 1px 24px rgba(8,4,12,0.45)` utility (`.copy-shadow`) and apply to the display headlines only — keeps Instrument Serif crisp on the ember band.
- Footer credit goes from `text-bone/40` → `text-bone/65` once revealed; bump header service-area label from `text-bone/60` → `text-bone/80`.
- Sunset loader: status line is white on dusk sky — fine, but escalation copy ("Letting the sun rest…") sits on the bloom. Add the same scrim treatment under the copy block + bump progress timestamp text from `text-bone/50` → `text-bone/75`.

## 2. Stronger vignette under copy zone

In `SunsetStage.tsx`, the bottom-right of Act II/III brightens too much when the sun centers. Bias the final vignette toward the left third where copy lives:

- Add a second left-anchored vignette pass: `radial-gradient at 25% 50%, transparent 35%, rgba(8,4,12,0.45) 85%` composited after the existing centered vignette. Costs one extra fillRect per frame.

## 3. Stress-proof the scroll-jack

`useScrollJack.ts` already has friction + magnets, but a few stress cases:

- **Tab switch / long sleep**: `visibilitychange` cancels rAF but doesn't reset `last`/`lastInputRef`. On return, the first frame's `dtMs` is clamped to 48 (good), but a queued wheel event can spike velocity. Reset `velRef.current = 0` and bump `lastInputRef.current = now` on resume.
- **Touch flick on iOS Safari**: `touchVel` calc divides by `dt` which can be 1ms → unbounded. Cap `touchVel` to ±20.
- **Rapid resize**: canvas resize listener has no rAF throttle. Wrap in `requestAnimationFrame` debounce to avoid layout thrash.
- **Reduced-motion**: confirm `prefersReduced` path in `useScrollJack` still permits keyboard nav (it does — keys call `setTargetT` directly, fine).

## 4. Stress-proof the diagnostic loader

`DiagnosticEngine.tsx` `SunsetLoader`:

- Add hard ceiling: after `seconds > 45`, stop the rAF loop (just hold the frame) so a stalled tab doesn't burn CPU indefinitely.
- Error path: currently `setStage("idle")` drops user back to form with `error` set, but the error message isn't rendered in `idle` form — it is, on line 113. Confirm and keep.
- `onRetry` resets `startRef.current = performance.now()` inside the loader instead of just re-calling `submit` (otherwise the new attempt inherits the old elapsed counter visually for one paint). Wire a `key` bump on the loader from the parent on retry.

## 5. Defensive UI polish

- `index.tsx`: when `act4Reveal > 0.5`, also push `aria-hidden="true"` onto Act I–III layers so screen readers don't read three hidden headlines.
- Add `prefers-reduced-motion` short-circuit in `ActLayer` — drop blur and translate, keep opacity only.
- `LiquidGlassCard`: clamp `translateY` to `0` when `reveal >= 0.99` so sub-pixel jitter doesn't blur the form text.
- Form inputs: add `autoComplete="postal-code"` and `autoComplete="street-address"` for browser autofill.

## 6. Mobile (773×541 viewport and below)

- Hero headline (`text-5xl md:text-7xl lg:text-8xl`) wraps to 4 lines on narrow screens, eating the sun. Tighten mobile to `text-4xl` and add `pr-4` so the ember word doesn't run into the right edge.
- Move the "wheel · drag · type" hint up to `bottom-6` so it doesn't collide with iOS home indicator.

## Files touched

- `src/routes/index.tsx` — scrims, copy opacity bumps, reduced-motion guard, aria-hidden on hidden acts, mobile sizing
- `src/components/DiagnosticEngine.tsx` — loader scrim, retry reset, 45s ceiling, copy opacity bumps
- `src/components/SunsetStage.tsx` — left-biased vignette pass, resize rAF throttle
- `src/components/LiquidGlassCard.tsx` — clamp translate at full reveal
- `src/hooks/useScrollJack.ts` — visibility resume reset, touchVel cap
- `src/styles.css` — `.copy-shadow`, `.readability-scrim` utilities

No new dependencies. No backend changes. No new routes.
