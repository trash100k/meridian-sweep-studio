// LiquidGlassCard — Apple-grade glassmorphism.
// Backdrop blur + saturate, SVG turbulence/displacement refraction,
// orbiting conic sheen, chromatic edge, cursor-driven tilt + highlight.
import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  visible?: boolean;
  // 0..1 — drives entry transform/opacity
  reveal?: number;
};

export function LiquidGlassCard({ children, className = "", visible = true, reveal = 1 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  // Cursor-driven tilt + spotlight, refs only.
  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const target = { x: 0.5, y: 0.5 };
    const curr = { x: 0.5, y: 0.5 };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = (e.clientY - r.top) / r.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      curr.x += (target.x - curr.x) * 0.08;
      curr.y += (target.y - curr.y) * 0.08;
      const tiltX = (curr.y - 0.5) * -3; // deg
      const tiltY = (curr.x - 0.5) * 3;
      inner.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      el.style.setProperty("--mx", `${curr.x * 100}%`);
      el.style.setProperty("--my", `${curr.y * 100}%`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const opacity = Math.max(0, Math.min(1, reveal));
  const translate = (1 - opacity) * 60;

  return (
    <div
      ref={ref}
      className={`liquid-glass-wrap ${className}`}
      style={{
        opacity: visible ? opacity : 0,
        transform: `translateY(${translate}px)`,
        transition: "opacity 600ms ease, transform 800ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        pointerEvents: visible && opacity > 0.4 ? "auto" : "none",
      }}
    >
      <div ref={innerRef} className="liquid-glass">
        {/* Inner refraction layer — applied via SVG filter */}
        <div className="liquid-glass__refract" aria-hidden />
        {/* Specular sheen */}
        <div className="liquid-glass__sheen" aria-hidden />
        {/* Cursor spotlight */}
        <div className="liquid-glass__spot" aria-hidden />
        {/* Chromatic rim */}
        <div className="liquid-glass__rim" aria-hidden />
        {/* Content */}
        <div className="liquid-glass__content">{children}</div>
      </div>
    </div>
  );
}
