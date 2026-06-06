## Goal
Make the homepage's bottom scroll cue intuitive by replacing the silent glass-disc chevron with a labeled, pulsing call-to-action that also advances the scene on click.

## Change
**`src/components/SunsetStage.tsx`** — replace the `.scroll-nudge` glass disc + chevron block with a button:

- Label: **"Begin the diagnostic ↑"** (up-arrow matches the scroll-up jack direction)
- Style: pill button using design tokens — `bg-ember` text-bone, generous padding, subtle bone/20 border, ember glow shadow
- Pulse: soft `animate-pulse`-style ring (custom keyframe that scales an ember-tinted halo outward, respects `prefers-reduced-motion`)
- Behavior: `onClick` calls `scrollJack.setTarget(0.25)` so clicking advances into Act I (same effect as scrolling); keyboard accessible
- Visibility: same fade rule (`tState < 0.04`), `pointer-events-auto` while visible so the click works
- Position: keep bottom-center placement

No other files change. Routing, scroll-jack, diagnostic engine, copy, and the rest of the type hierarchy stay exactly as they are.

## Why this works
The current disc shows a down-chevron but the page actually wants you to scroll *up* — opposite signals. A worded button removes ambiguity ("Begin"), the arrow direction matches the motion, the pulse draws the eye, and click-to-advance covers users who don't realize the page is scroll-jacked.
