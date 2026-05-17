## Goal

Make the homepage feel like a controlled cinematic joyride instead of rushing straight to the lead form:

- Copy must be readable immediately and at each act.
- The wheel/trackpad journey must settle into story beats.
- The lead form must arrive only after the story lands.
- The grass/sunset photo must feel full-bleed and cinematic again, not small.

## Changes

### 1. Slow and stabilize the scroll-jack timing

In `src/hooks/useScrollJack.ts`:

- Increase the travel distance from `1350` to about `4200`, so one flick no longer jumps from hero to form.
- Strengthen magnetic stops so the journey catches at the act positions: `0`, `0.25`, `0.55`, `0.80`.
- Reduce the idle delay slightly so the camera settles after the user pauses.
- Add gentle launch friction near `t = 0`, so the first interaction does not rocket past the opening copy.

### 2. Fix copy visibility and act timing

In `src/routes/index.tsx`:

- Replace the current single-peak fade with a plateau fade: each act fades in, stays fully visible, then fades out.
- Make Act I full opacity at page load instead of starting half-transparent and blurred.
- Align acts to the magnetic stops:

```text
Act I    readable immediately, holds before fading
Act II   red clay copy holds around the first stop
Act III  steward copy holds before the form
Act IV   glass form appears only near the end
```

### 3. Delay the lead form

In `src/routes/index.tsx`:

- Move form reveal start later, from around `t=0.70` to around `t=0.82`.
- Only allow form pointer interactions once it is substantially visible.
- Delay the footer/phone reveal until the glass form act.

### 4. Fix the photo scale

In `src/components/SunsetStage.tsx`:

- Enlarge the grass/sunset photo draw area so it covers the lower hero properly at the current preview size.
- Anchor it lower and wider so it reads as cinematic foreground, not a small inserted image.
- Keep the tunnel transition, but start from a bigger full-bleed grass layer.

## Files to edit

- `src/hooks/useScrollJack.ts`
- `src/routes/index.tsx`
- `src/components/SunsetStage.tsx`

## Validation

After implementation, check the preview behavior:

- Initial load shows readable copy.
- First wheel/trackpad input does not skip straight to the form.
- Each act can be seen before the next one.
- The form is delayed until the final act.
- The photo fills the hero foreground again.
