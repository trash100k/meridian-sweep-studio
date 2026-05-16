## Sunset Tunnel — Scroll-Jacked Joyride

No page scroll. The wheel/trackpad/touch/arrow keys feed a single progress value `t ∈ [0,1]` that drives a cinematic 4-act journey. Scroll feels like steering a convertible into a sunset, not fighting a page.

### Joyride feel (the part that matters)

- **Body locked**: `overflow: hidden` on `html, body`. Hero is `position: fixed; inset: 0`. Nothing scrolls in the browser sense.
- **Momentum integrator**: wheel/touch deltas add to `targetT` with friction 0.92. `currentT` springs toward `targetT` (stiffness 0.08, damping 0.85) in one rAF loop. Result = gliding, not snapping.
- **Magnetic act stops**: gentle attractor wells at t = 0.0, 0.25, 0.55, 0.80. When |velocity| < 0.0008 within ±0.06 of a stop, `targetT` eases to it. You can blow past with intent; idle hands settle into the next vista.
- **Rubber-band ends**: `t` clamps [0,1] with overshoot decay so reaching the form doesn't feel like a wall.
- **Scrub backward freely**: same physics in reverse. The journey is reversible.
- **Reduced motion**: `prefers-reduced-motion` → instant jumps between acts via PageDown/Up, no spring, no parallax.
- **Keyboard**: ArrowDown/Space advance one act; ArrowUp retreats; Tab jumps `t → 0.85` and focuses the form (a11y escape hatch).
- **Touch**: vertical drag → `targetT` delta; flick adds momentum.

### The four acts (driven by `t`)

```
t=0.00  Ground       low camera, sun on horizon, grass blowing
t=0.25  Red Clay     soil cross-section rises, copy about Meridian's red dirt
t=0.55  Tunnel       camera tilts up, god-ray straightens vertical
t=0.80  Glass        liquid-glass diagnostic card surfaces in the sunset
```

Each act blends with the next over a 0.15-wide window — never a hard cut.

### Cursor reactivity (the "playing with you" part)

- Sky parallax −6px, grass +18px, soil +4px following cursor.
- Sun bloom intensifies as cursor approaches it.
- God-ray endpoint spring-tracks cursor (lerp 0.12) until t > 0.55, then locks vertical.
- Liquid-glass card tilts ±4° on cursor and shows a soft spotlight beneath the pointer.

### Files

- New: `src/components/SunsetStage.tsx`, `src/components/LiquidGlassCard.tsx`, `src/hooks/useScrollJack.ts`
- Edit: `src/routes/index.tsx` (replace body with `<SunsetStage />`), `src/routes/__root.tsx` (overflow lock + SVG `feTurbulence/feDisplacementMap` defs), `src/styles.css` (utils + keyframes), `src/components/DiagnosticEngine.tsx` (visual shell only — no logic change)
- Delete: `src/components/GrassSweep.tsx`

### Out of scope

WebGL/Three.js, audio, additional routes, payments, business logic changes.

---

Hit **Implement plan** and I'll build it.