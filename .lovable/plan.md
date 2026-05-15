## Sunset Tunnel — scroll-jacked, cursor-reactive, liquid glassmorphism

One pinned cinematic stage. Native scroll is locked. Wheel / trackpad / touch / arrow keys all drive a single normalized progress `t ∈ [0,1]` that orchestrates camera, sky, beam, and the rise of a liquid-glass form. No buttons, no anchors, no funnel — the experience ends inside the glass.

### The 4 acts (driven by `t`)

```
   t = 0.00 ─── ACT I  · GROUND
     low camera in the grass, sun on the horizon
     headline + sub fade in
     cursor drags a warm beam across the blades

   t = 0.25 ─── ACT II · RED CLAY
     camera dollies forward, blades part
     soil cross-section rises revealing red Meridian clay
     red-dirt copy crossfades in

   t = 0.55 ─── ACT III · TUNNEL
     camera tilts straight up, grass slides off bottom
     beam goes vertical, sky bleeds ember → indigo
     stewardship line materializes mid-sky in haze

   t = 0.80 ─── ACT IV · GLASS
     pure sunset sky
     liquid-glass diagnostic card rises from below center,
     refracting the sun behind it — this is the only destination
```

### Cinematic + cursor-reactive

- **Camera (canvas 2D)** — sky disc, grass photo, soil cross-section, beam — each with its own Y-offset and scale curve keyed to `t`. Cursor parallax: sky −6px, grass +12px, soil +4px. Sun bloom brightens as cursor nears it.
- **Beam of light** — soft radial god-ray from the sun; end-point spring-tracks the cursor (`lerp 0.12`). Brightens grass tips it crosses (additive blend). At `t > 0.55` straightens vertical and becomes the tunnel.
- **Type** — Instrument Serif materializes via blur(16→0) + opacity, 900ms staggered. Crossfade between acts; never two acts on screen at once.
- **Reduced motion** — static composite + normal stacked layout with the form visible immediately.

### Scroll-jack model

- `position: fixed; inset: 0` stage; `body` overflow locked on this route only
- Wheel + touch + arrow + space funnel into a `targetT` integrator with momentum, clamp `[0,1]`
- `currentT` springs toward `targetT` (stiffness 0.08) inside one rAF loop
- Wheel listeners `passive: false` so we can `preventDefault`
- rAF pauses on `visibilitychange`; resets cleanly on back/forward
- Accessibility: `Tab` jumps `t → 0.85` and focuses the first input; the form is always in DOM for screen readers (visually hidden until `t > 0.7`)

### Liquid glassmorphism — next-level

The card is the centerpiece, not a panel. Real glass, not a frosted div.

- **Surface** — `backdrop-filter: blur(28px) saturate(180%) brightness(1.08) contrast(1.05)`, ultra-thin 1px highlight stroke (top-left bright, bottom-right dim) via masked gradient borders, soft inner shadow for depth
- **Refraction** — SVG `feTurbulence (baseFreq 0.012) → feDisplacementMap (scale 6)` filter (id `#liquid-glass`, defined once in `__root.tsx`), animated baseFreq for the slow shimmer that bends the sunset behind the card
- **Specular sheen** — conic-gradient pseudo-element orbits the border at 14s/rev for the wet sheen
- **Caustic edge** — a second pseudo with chromatic-aberration split (red/cyan offsets via `mix-blend-mode: screen`) to fake light splitting through the rim
- **Hover/cursor reactive** — card surface tilts ±2° on cursor (CSS variables in rAF, no React renders); a soft circular highlight follows the cursor across the glass
- **Inputs** — borderless, ember caret + 1px focus underline only; submit is a glass pill, not a button. Loading/report stages render *inside* the card; it grows fluidly and the sky behind dims for legibility
- **Performance** — single backdrop-filter element, displacement filter capped at 6px, devicePixelRatio capped at 1.5; mobile drops feDisplacementMap (keeps blur + saturate) to stay smooth

### Copy

- **Act I** — H1: *Your lawn isn't dying.* / H1 (ember): *Your soil is suffocating.*
- **Act II** — *Meridian sits on a sheet of red Mississippi clay that sheds water like a tarp. Your grass never had a chance.*
- **Act III** — *Affordable Landscaping are the stewards of your lawn — six inches deeper than anyone else looks.*
- **Act IV** — *Free, 20-second soil diagnostic. No callback queue. No upsell.*

### Files

- New: `src/components/SunsetStage.tsx` — canvas composite + scroll-jack controller + act state
- New: `src/components/LiquidGlassCard.tsx` — the glass surface (Act IV)
- New: `src/hooks/useScrollJack.ts` — wheel/touch/key → `t` integrator with spring
- Edit: `src/routes/index.tsx` — replace body with `<SunsetStage />`; old hero / Red Clay / Diagnostic / footer sections removed (footer becomes a tiny line under the glass)
- Edit: `src/components/DiagnosticEngine.tsx` — visual shell only (wrap fields/results in glass surfaces); server-fn logic untouched
- Edit: `src/routes/__root.tsx` — inject hidden SVG `<defs>` for `#liquid-glass`; lock body overflow on `/`
- Edit: `src/styles.css` — `.liquid-glass` utility, sheen + displacement keyframes, reduced-motion overrides
- Edit: `src/config/business.ts` — confirm name = "Affordable Landscaping", serviceArea = "Meridian, MS"
- Delete: `src/components/GrassSweep.tsx` (unused)

### Out of scope

- WebGL / Three.js (canvas 2D + the photo reads more cinematic and ships <10kb)
- Audio / sfx
- Additional routes / pages
- Payments, scheduling, upsells

Approved — hit **Implement plan** and I'll build it.
