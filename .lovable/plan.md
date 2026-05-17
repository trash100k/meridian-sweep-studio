## Goal

Three coordinated fixes for the homepage joyride:

1. **Cinematic loading sequence** — while the Silent Siphon diagnostic runs, show a sunset slowly descending behind a hill silhouette, with copy beats keyed to the sun's altitude. If the server takes longer than expected, the sun "pauses" just above the ridge with reassuring copy instead of dropping off-screen.
2. **Apple-snappy spring crossfades** — replace linear act fades with a real spring curve.
3. **Anchor alignment for Acts II and III** — "The Red Clay Problem" and "The Stewards" must hold exactly on their scroll magnets.

---

## 1. Sunset-behind-hill loader (the headline change)

In `src/components/DiagnosticEngine.tsx`, replace the current step list loader with a small self-contained `SunsetLoader` component.

**Visual composition** (pure SVG inside the existing glass card — no canvas, no new deps):

```text
┌──────────────────────────────────────────────┐
│   peach → indigo sky gradient                │
│                                              │
│            ◯  sun (descends slowly)          │
│         ╲ god-rays                           │
│   ───────────────  horizon haze              │
│  ╱╲      ╱──────╲       ╱╲   hill silhouette │
│ ╱  ╲____╱        ╲_____╱  ╲                  │
│                                              │
│   READING YOUR DIRT                          │
│   ▓▓▓▓▓▓▓▓▓▓░░░░░░  62%   t+04s              │
└──────────────────────────────────────────────┘
```

- **Sky**: vertical gradient `#ffb070 → #a64a2c → #3a1d3a → #0a0420`, animated by shifting gradient stops as `progress` climbs (`0 → 1`).
- **Sun**: a circle with a soft radial bloom that translates from `y = 18%` down to `y = 82%` (just clipped by the hill silhouette) on an ease curve. At slow-path (`elapsed > 14s`), sun parks at `y = 70%` (right at the ridge) and gains a gentle 2 s breathing scale — feels like it's waiting, not stuck.
- **Hill silhouette**: a single SVG `<path>` of two soft Mississippi rolling hills in `--loam` color, with a thin highlight stroke catching the last light. Static — only the sun moves behind it.
- **God-rays**: three faint diagonal screen-blend lines emanating from the sun, opacity ramps `0 → 0.6` as the sun reaches the horizon.
- **Stars** (very subtle): 5–7 tiny dots fade in only after `progress > 0.85` (full dusk).
- **Progress bar**: thin 1px line beneath the scene, fills with a `--ember → --wheat` gradient. Eases asymptotically toward 95 % so it never appears "done" before the server resolves; snaps to 100 % over 250 ms on success.

**Copy beats keyed to elapsed time** (single line under the scene, crossfades with spring easing):

```text
0 – 6 s    Reading your dirt…
6 – 14 s   Pulling deeper records — Meridian clay is thick today.
14 – 22 s  Letting the sun rest on the ridge while we finish.
22 s +     Still working. [Keep waiting]  [Try again]
```

**Behavior**:
- Drive everything off a single `elapsed` state updated via `requestAnimationFrame` (no setTimeout chain).
- `progress = min(0.95, easeOutCubic(elapsed / 6000))` for the first phase; after 6 s ease asymptotically toward 0.95.
- On server resolve: jump progress to 1, hold scene for 250 ms (sun just dipping below ridge, final indigo wash), then transition to the report.
- On server error: keep the scene, show inline error text + a single "Try again" pill that re-runs `submit` with the existing zip/address (no need to retype).
- Respect `prefers-reduced-motion`: skip the rAF loop, render a static dusk frame with the copy and a determinate-looking bar.

## 2. Apple-snappy spring crossfades

In `src/routes/index.tsx`'s `ActLayer`:

- Replace `transition: ... 200ms linear` with:
  ```ts
  transition:
    "opacity 360ms cubic-bezier(0.22, 1, 0.36, 1),
     filter 360ms cubic-bezier(0.22, 1, 0.36, 1),
     transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)";
  ```
- Reduce blur max `10px → 6px` and y-translate `12px → 8px` — motion felt, not seen.
- Apply `easeOutQuint` to opacity before assigning, for snappy-attack / soft-tail feel.

Reuse the same easing for the loader's copy crossfades so motion language matches.

## 3. Realign acts to magnetic stops

In `src/hooks/useScrollJack.ts`:

- Move `DEFAULT_STOPS` from `[0, 0.25, 0.55, 0.80]` to `[0.00, 0.28, 0.58, 0.88]`.
- `MAGNET_RADIUS`: `0.11 → 0.09` (tighter capture window).
- `MAGNET_STRENGTH`: `0.42 → 0.55` (snappier lock).

In `src/routes/index.tsx`, realign plateau fades so each act's hold zone is centered on its stop:

```text
Act I    fade(t, 0.00, 0.00, 0.16, 0.24)
Act II   fade(t, 0.20, 0.26, 0.36, 0.46)   center 0.28
Act III  fade(t, 0.44, 0.52, 0.66, 0.76)   center 0.58
Act IV   reveal ramp 0.80 → 0.90          center 0.88
```

Phone/footer reveal moves to `t > 0.86`. Form pointer-events unlock at `act4Reveal > 0.5`.

## Files to edit

- `src/components/DiagnosticEngine.tsx`  (new internal `SunsetLoader`, slow-path UI)
- `src/routes/index.tsx`  (fade windows, spring easing)
- `src/hooks/useScrollJack.ts`  (stops, magnet tuning)

No new dependencies. Hill + sun rendered as inline SVG using existing design tokens (`--ember`, `--wheat`, `--loam`, `--bone`).

## Validation

- Submitting the diagnostic shows the sun descending behind the hill, copy crossfading on cue, never appearing stuck — even at 20 s.
- An induced error surfaces a "Try again" pill that re-runs without re-entering data.
- Idle scroll snaps so Act II and Act III headlines sit perfectly centered with no overlap from neighbors.
- Crossfades feel snappy in, soft out — no linear mush.
