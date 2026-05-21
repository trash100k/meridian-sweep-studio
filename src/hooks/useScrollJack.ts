// Scroll-jack joyride: wheel + touch + keyboard feed a velocity integrator
// with friction, magnetic act stops, and rubber-band ends. One rAF loop.
// Feels like coasting a convertible — not snapping between sections.
import { useEffect, useRef } from "react";

const DEFAULT_STOPS = [0, 0.28, 0.58, 0.88];

type Options = {
  // Pixels of accumulated input to traverse t = 0 → 1.
  travel?: number;
  // Stops the integrator magnetically settles toward when idle.
  stops?: number[];
  enabled?: boolean;
  onChange?: (t: number) => void;
};

export type ScrollJackHandle = {
  t: { current: number };
  setTarget: (t: number) => void;
};

export function useScrollJack({
  travel = 4200,
  stops = DEFAULT_STOPS,
  enabled = true,
  onChange,
}: Options = {}): ScrollJackHandle {
  const tRef = useRef(0);
  // We integrate position directly with velocity (input deltas → velocity)
  const posRef = useRef(0); // 0..travel, but allowed to rubber-band outside
  const velRef = useRef(0); // pixels per frame
  const lastInputRef = useRef(0);
  const onChangeRef = useRef(onChange);
  const stopsRef = useRef(stops);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    stopsRef.current = stops;
  }, [stops]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setTargetT = (v: number) => {
      const clamped = Math.max(0, Math.min(1, v));
      posRef.current = clamped * travel;
      velRef.current = 0;
    };

    // A nudge from user input — adds velocity, doesn't teleport.
    const addInput = (dy: number, scale = 0.9) => {
      lastInputRef.current = performance.now();
      // Launch friction: first beats of the story shouldn't rocket past the opening.
      const tNow = posRef.current / travel;
      const launchDamp = tNow < 0.02 ? 0.55 : tNow < 0.06 ? 0.78 : 1;
      // Scale wheel pixels into a comfortable velocity range.
      velRef.current += dy * scale * 0.09 * launchDamp;
      // Cap velocity so a furious scroll doesn't shoot past everything.
      const maxV = 46;
      if (velRef.current > maxV) velRef.current = maxV;
      if (velRef.current < -maxV) velRef.current = -maxV;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      addInput(normalizeWheelDelta(e));
    };

    let touchY: number | null = null;
    let touchT: number = 0;
    let touchVel = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
      touchT = performance.now();
      velRef.current = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY == null) return;
      e.preventDefault();
      const y = e.touches[0]?.clientY ?? touchY;
      const now = performance.now();
      const dy = touchY - y;
      const dt = Math.max(8, now - touchT);
      let tv = (dy / dt) * 16;
      if (tv > 20) tv = 20;
      else if (tv < -20) tv = -20;
      touchVel = tv;
      touchY = y;
      touchT = now;
      // Direct drag — small velocity injection
      addInput(dy * 2.2, 0.4);
    };
    const onTouchEnd = () => {
      if (touchY != null && Math.abs(touchVel) > 0.5) {
        // Flick — keep the momentum
        velRef.current += touchVel * 2.2;
      }
      touchY = null;
      touchVel = 0;
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        // Jump toward the next stop.
        const cur = posRef.current / travel;
        const next = stopsRef.current.find((s) => s > cur + 0.02) ?? 1;
        setTargetT(next);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const cur = posRef.current / travel;
        const prev = [...stopsRef.current].reverse().find((s) => s < cur - 0.02) ?? 0;
        setTargetT(prev);
      } else if (e.key === "Home") {
        e.preventDefault();
        setTargetT(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setTargetT(1);
      } else if (e.key === "Tab") {
        if (posRef.current / travel < 0.82) setTargetT(0.9);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    let raf = 0;
    let last = performance.now();
    let alive = true;

    const FRICTION = 0.94; // velocity decay per frame
    const MAGNET_RADIUS = 0.09; // in t-units
    const MAGNET_STRENGTH = 0.55; // how hard idle attractor pulls
    const IDLE_MS = 260; // ms after last input before magnets engage
    const RUBBER = 0.18; // overshoot decay at ends

    const tick = (now: number) => {
      if (!alive) return;
      const dtMs = Math.min(48, now - last);
      last = now;
      const dt = dtMs / 16.67; // in frames

      if (prefersReduced) {
        // No physics — just clamp.
        const clampedPos = Math.max(0, Math.min(travel, posRef.current));
        posRef.current = clampedPos;
        velRef.current = 0;
      } else {
        // Apply velocity to position.
        posRef.current += velRef.current * dt;
        // Friction.
        velRef.current *= Math.pow(FRICTION, dt);
        if (Math.abs(velRef.current) < 0.005) velRef.current = 0;

        // Magnetic stops — only when input has been quiet for a beat.
        const idle = now - lastInputRef.current > IDLE_MS;
        if (idle && Math.abs(velRef.current) < 0.6) {
          const curT = posRef.current / travel;
          let nearest = stops[0];
          let bestD = Infinity;
          for (const s of stopsRef.current) {
            const d = Math.abs(curT - s);
            if (d < bestD) {
              bestD = d;
              nearest = s;
            }
          }
          if (bestD < MAGNET_RADIUS) {
            const pull = (nearest * travel - posRef.current) * MAGNET_STRENGTH * (dt / 4);
            posRef.current += pull;
          }
        }

        // Rubber-band ends: allow brief overshoot, then snap back.
        if (posRef.current < 0) {
          posRef.current += (0 - posRef.current) * RUBBER * dt;
          velRef.current *= 0.6;
          if (posRef.current > -0.5) posRef.current = 0;
        } else if (posRef.current > travel) {
          posRef.current += (travel - posRef.current) * RUBBER * dt;
          velRef.current *= 0.6;
          if (posRef.current < travel + 0.5) posRef.current = travel;
        }
      }

      const next = Math.max(0, Math.min(1, posRef.current / travel));
      if (Math.abs(next - tRef.current) > 0.00005) {
        tRef.current = next;
        onChangeRef.current?.(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        lastInputRef.current = last;
        velRef.current = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    // Lock body scroll while mounted.
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [travel, enabled]);

  return {
    t: tRef,
    setTarget: (v: number) => {
      const clamped = Math.max(0, Math.min(1, v));
      posRef.current = clamped * travel;
      velRef.current = 0;
    },
  };
}

function normalizeWheelDelta(e: WheelEvent): number {
  let dy = e.deltaY;
  if (e.deltaMode === 1) dy *= 16;
  else if (e.deltaMode === 2) dy *= window.innerHeight;
  return dy;
}
