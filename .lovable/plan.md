Replace the small `wheel · drag · type — no scrolling` text at the bottom of the homepage stage with a large glassmorphism **up-arrow** that loops a flash animation: travels from bottom to top while fading in and out, repeating.

### File touched
`src/components/SunsetStage.tsx` — only.

### Changes

1. **Remove** the existing hint `<div>` near the bottom that renders `wheel · drag · type — no scrolling`.

2. **Insert** in the same place a glassmorphism arrow stack, centered bottom, `z-20`, `pointer-events-none`, fading out at the same threshold (`tState >= 0.04`):
   - A circular/pill glass container (~56–72 px) using the existing liquid-glass aesthetic: `backdrop-filter: blur(16px) saturate(180%)`, white-to-transparent gradient fill, soft inset highlight, ember-tinted glow shadow, `rounded-full`.
   - An SVG **chevron-up** icon (~28–32 px) in `text-bone`, centered inside.
   - A trailing "ghost" arrow layer behind it that runs the looping flash.

3. **Looping flash animation** (added as scoped keyframes in `SunsetStage.tsx` via a `<style>` tag or inline `<style jsx>`-style block, since `styles.css` should stay untouched per the request scope):
   - Keyframe `arrow-rise`:
     - `0%`  → `translateY(8px)`, `opacity: 0`
     - `25%` → `opacity: 1`
     - `100%` → `translateY(-22px)`, `opacity: 0`
   - Duration ~1.8s, `ease-out`, `infinite`.
   - Apply to the inner arrow SVG so the static glass disc stays put while the chevron repeatedly drifts upward and fades.
   - Add a second, delayed copy of the same SVG (delay ~0.9s) so there is always one arrow visible — produces the "flash bottom → top in repetition" feel.

4. **Accessibility**:
   - `aria-hidden="true"` on the visual.
   - Wrap in `@media (prefers-reduced-motion: reduce)` → disable the rise animation, leave the arrow statically centered.

5. **Fade with scroll**: keep the existing `opacity` binding to `tState < 0.04 ? 1 : 0` with the same `transition-opacity duration-500`, so as soon as the user advances the story, the arrow disappears.

### Acceptance
- Old "wheel · drag · type" text is gone.
- A beautiful glass disc with an up-chevron sits centered at the bottom of the hero on first load.
- The chevron repeatedly rises from inside the disc and fades, in a continuous loop, giving a "scroll up" nudge.
- Disappears smoothly the moment the user scrolls/drags.
- Reduced-motion users see the static arrow only.