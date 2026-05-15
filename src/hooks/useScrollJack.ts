// Scroll-jack: wheel + touch + keyboard → normalized progress t ∈ [0,1].
// Single rAF loop with spring smoothing. Refs only, no React renders.
import { useEffect, useRef } from "react";

type Options = {
  // Pixels of accumulated input to traverse t = 0 → 1.
  travel?: number;
  // Spring stiffness toward target.
  stiffness?: number;
  enabled?: boolean;
  onChange?: (t: number) => void;
};

export type ScrollJackHandle = {
  t: { current: number };
  target: { current: number };
  setTarget: (t: number) => void;
};

export function useScrollJack({
  travel = 3200,
  stiffness = 0.09,
  enabled = true,
  onChange,
}: Options = {}): ScrollJackHandle {
  const t = useRef(0);
  const target = useRef(0);
  const accum = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clamp = (v: number) => Math.max(0, Math.min(1, v));

    const setTarget = (v: number) => {
      target.current = clamp(v);
      accum.current = target.current * travel;
    };

    const addDelta = (dy: number) => {
      accum.current = Math.max(0, Math.min(travel, accum.current + dy));
      target.current = accum.current / travel;
    };

    const onWheel = (e: WheelEvent) => {
      // Always preventDefault so browser scroll never fires.
      e.preventDefault();
      const dy = normalizeWheelDelta(e);
      addDelta(dy);
    };

    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY == null) return;
      e.preventDefault();
      const y = e.touches[0]?.clientY ?? touchY;
      const dy = (touchY - y) * 2.2;
      touchY = y;
      addDelta(dy);
    };
    const onTouchEnd = () => {
      touchY = null;
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        addDelta(e.key === "PageDown" ? 700 : 220);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        addDelta(e.key === "PageUp" ? -700 : -220);
      } else if (e.key === "Home") {
        e.preventDefault();
        setTarget(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setTarget(1);
      } else if (e.key === "Tab") {
        // Pull form into view on first Tab.
        if (target.current < 0.82) {
          setTarget(0.92);
        }
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

    const tick = (now: number) => {
      if (!alive) return;
      const dt = Math.min(64, now - last);
      last = now;
      const k = prefersReduced ? 1 : 1 - Math.pow(1 - stiffness, dt / 16.67);
      const next = t.current + (target.current - t.current) * k;
      if (Math.abs(next - t.current) > 0.0001 || next !== t.current) {
        t.current = next;
        onChange?.(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [travel, stiffness, enabled, onChange]);

  return {
    t,
    target,
    setTarget: (v: number) => {
      target.current = Math.max(0, Math.min(1, v));
    },
  };
}

function normalizeWheelDelta(e: WheelEvent): number {
  // mode 0 = pixels, 1 = lines, 2 = pages.
  let dy = e.deltaY;
  if (e.deltaMode === 1) dy *= 16;
  else if (e.deltaMode === 2) dy *= window.innerHeight;
  return dy;
}
