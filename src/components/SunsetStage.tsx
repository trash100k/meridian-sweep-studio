// SunsetStage — pinned cinematic canvas. Scroll-jacked.
// Composites: sky gradient + sun, grass photo, soil cross-section, god-ray beam.
// Cursor parallax + spring-tracked beam endpoint. 4 acts driven by t ∈ [0,1].
import { useEffect, useRef, useState, type ReactNode } from "react";
import heroImage from "@/assets/hero-grass-sunset.jpg";
import { useScrollJack } from "@/hooks/useScrollJack";

type Props = {
  children?: (api: { t: number; act: number; setT: (v: number) => void }) => ReactNode;
};

// Easing helpers
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export function SunsetStage({ children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgReady, setImgReady] = useState(false);
  const [, force] = useState(0);

  // Cursor (smoothed)
  const cursorTarget = useRef({ x: 0.5, y: 0.55 });
  const cursorCurr = useRef({ x: 0.5, y: 0.55 });

  // Beam tip (spring tracked toward cursor in act I/II, vertical in III/IV)
  const beamTip = useRef({ x: 0.5, y: 0.55 });

  // Stage progress (mirrored for React-driven UI overlay)
  const tRef = useRef(0);
  const [tState, setTState] = useState(0);
  const lastReact = useRef(0);

  const scrollJack = useScrollJack({
    onChange: (t) => {
      tRef.current = t;
      // throttle React updates to ~30fps
      const now = performance.now();
      if (now - lastReact.current > 33) {
        lastReact.current = now;
        setTState(t);
      }
    },
  });

  // Load hero image
  useEffect(() => {
    const img = new Image();
    img.src = heroImage;
    img.onload = () => {
      imgRef.current = img;
      setImgReady(true);
      force((n) => n + 1);
    };
    return () => {
      img.onload = null;
    };
  }, []);

  // Cursor tracking
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: PointerEvent) => {
      cursorTarget.current.x = e.clientX / window.innerWidth;
      cursorTarget.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Render loop
  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    let resizeRaf = 0;
    const onResize = () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        resize();
      });
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let alive = true;

    const draw = () => {
      if (!alive) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Smooth cursor toward target
      cursorCurr.current.x = lerp(cursorCurr.current.x, cursorTarget.current.x, 0.12);
      cursorCurr.current.y = lerp(cursorCurr.current.y, cursorTarget.current.y, 0.12);

      const t = tRef.current;
      const cx = cursorCurr.current.x;
      const cy = cursorCurr.current.y;

      // ─── Sky layer ────────────────────────────────────────────────────────
      // Color shifts ember → indigo as t increases.
      const horizonY = lerp(h * 0.42, h * 1.08, smoothstep(0.35, 0.85, t));
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      // Top of sky
      sky.addColorStop(0, mix("#1a0f2e", "#0a0420", smoothstep(0.5, 1, t)));
      sky.addColorStop(0.35, mix("#3a1d3a", "#1a1238", smoothstep(0.5, 1, t)));
      sky.addColorStop(0.65, mix("#a64a2c", "#5a2240", smoothstep(0.5, 1, t)));
      sky.addColorStop(0.9, mix("#e88a3a", "#8a3450", smoothstep(0.55, 1, t)));
      sky.addColorStop(1, mix("#ffb070", "#a04050", smoothstep(0.6, 1, t)));
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Sun position — drifts slightly with cursor parallax + rises slightly during tunnel
      const sunBaseX = w * lerp(0.18, 0.5, smoothstep(0.55, 0.85, t));
      const sunX = sunBaseX + (cx - 0.5) * -16;
      const sunY = horizonY - lerp(8, h * 0.25, smoothstep(0.55, 0.95, t));
      const sunR = lerp(70, 180, smoothstep(0.55, 1, t));

      // Sun bloom
      const bloomR = sunR * 4;
      const bloom = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, bloomR);
      bloom.addColorStop(0, "rgba(255, 220, 170, 0.9)");
      bloom.addColorStop(0.2, "rgba(255, 170, 90, 0.55)");
      bloom.addColorStop(0.55, "rgba(220, 90, 60, 0.18)");
      bloom.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      // Sun disc
      const disc = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
      disc.addColorStop(0, "rgba(255,240,210,1)");
      disc.addColorStop(0.6, "rgba(255,180,110,0.9)");
      disc.addColorStop(1, "rgba(255,120,70,0)");
      ctx.fillStyle = disc;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fill();

      // ─── Beam (god-ray) ───────────────────────────────────────────────────
      // Tip springs toward cursor in early acts; vertical during tunnel.
      const tunnelMix = smoothstep(0.5, 0.85, t);
      const tipTargetX = lerp(cx * w, sunX, tunnelMix);
      const tipTargetY = lerp(cy * h, -h * 0.2, tunnelMix);
      beamTip.current.x = lerp(beamTip.current.x, tipTargetX, 0.1);
      beamTip.current.y = lerp(beamTip.current.y, tipTargetY, 0.1);

      drawBeam(ctx, sunX, sunY, beamTip.current.x, beamTip.current.y, w, h, t);

      // ─── Soil cross-section (Act II) ──────────────────────────────────────
      const soilProgress = smoothstep(0.18, 0.45, t) * (1 - smoothstep(0.55, 0.78, t));
      if (soilProgress > 0.01) {
        drawSoilCrossSection(ctx, w, h, soilProgress, cx, cy);
      }

      // ─── Grass layer ──────────────────────────────────────────────────────
      const img = imgRef.current;
      if (img) {
        // Grass slides off bottom as we tunnel up.
        const grassY = lerp(-h * 0.22, h * 1.1, smoothstep(0.5, 0.92, t));
        const grassParallaxX = (cx - 0.5) * 24;
        const grassParallaxY = (cy - 0.5) * 12;
        const scale = lerp(1.05, 1.18, smoothstep(0.2, 0.55, t));
        drawGrassPhoto(ctx, img, w, h, grassY + grassParallaxY, grassParallaxX, scale, t);
      }

      // ─── Final atmosphere — vignette + left-biased copy scrim ──────────────
      const vignette = ctx.createRadialGradient(
        w * 0.5,
        h * 0.42,
        Math.min(w, h) * 0.2,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.85,
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, `rgba(8,4,12,${lerp(0.55, 0.78, t)})`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // Left-anchored scrim — keeps copy zone readable through every act.
      const copyScrim = ctx.createRadialGradient(
        w * 0.22,
        h * 0.5,
        Math.min(w, h) * 0.05,
        w * 0.22,
        h * 0.5,
        Math.max(w, h) * 0.7,
      );
      copyScrim.addColorStop(0, "rgba(8,4,12,0.48)");
      copyScrim.addColorStop(0.5, "rgba(8,4,12,0.22)");
      copyScrim.addColorStop(1, "rgba(8,4,12,0)");
      ctx.fillStyle = copyScrim;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
    };
  }, [imgReady]);

  // Compute current "act" from t (for crossfading copy)
  const act = tState < 0.22 ? 0 : tState < 0.5 ? 1 : tState < 0.78 ? 2 : 3;

  return (
    <div ref={wrapRef} className="fixed inset-0 overflow-hidden bg-loam" style={{ touchAction: "none" }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      {/* Foreground UI/copy provided by parent */}
      <div className="relative z-10 h-full w-full">
        {children?.({
          t: tState,
          act,
          setT: (v) => scrollJack.setTarget(v),
        })}
      </div>
      {/* Scroll progress hint, fades when t > 0.05 */}
      <div
        className="pointer-events-none absolute bottom-4 left-1/2 z-20 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.26em] leading-relaxed text-bone/60 font-mono transition-opacity duration-500"
        style={{ opacity: tState < 0.04 ? 1 : 0 }}
      >
        wheel · drag · type — no scrolling
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────

function mix(aHex: string, bHex: string, t: number): string {
  const a = hexToRgb(aHex);
  const b = hexToRgb(bHex);
  const r = Math.round(lerp(a[0], b[0], t));
  const g = Math.round(lerp(a[1], b[1], t));
  const bl = Math.round(lerp(a[2], b[2], t));
  return `rgb(${r},${g},${bl})`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function drawBeam(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  w: number,
  h: number,
  t: number,
) {
  const intensity = lerp(0.55, 1.0, smoothstep(0.45, 0.85, t));
  const len = Math.hypot(tx - sx, ty - sy);
  if (len < 1) return;
  const nx = (tx - sx) / len;
  const ny = (ty - sy) / len;
  // Perpendicular for width
  const px = -ny;
  const py = nx;
  const halfW = lerp(80, 220, smoothstep(0.4, 0.9, t));

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  // Gradient along the beam
  const grad = ctx.createLinearGradient(sx, sy, tx, ty);
  grad.addColorStop(0, `rgba(255, 220, 170, ${0.55 * intensity})`);
  grad.addColorStop(0.5, `rgba(255, 180, 110, ${0.35 * intensity})`);
  grad.addColorStop(1, "rgba(255, 150, 90, 0)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(sx + px * halfW * 0.3, sy + py * halfW * 0.3);
  ctx.lineTo(sx - px * halfW * 0.3, sy - py * halfW * 0.3);
  ctx.lineTo(tx - px * halfW, ty - py * halfW);
  ctx.lineTo(tx + px * halfW, ty + py * halfW);
  ctx.closePath();
  ctx.fill();

  // Hot core
  ctx.strokeStyle = `rgba(255, 240, 210, ${0.4 * intensity})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(tx, ty);
  ctx.stroke();

  ctx.restore();
}

function drawSoilCrossSection(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  cx: number,
  cy: number,
) {
  // Rises from below, reveals red Mississippi clay strata.
  const rise = (1 - p) * h * 0.5;
  ctx.save();
  ctx.translate(0, rise);
  // Topsoil dark band
  const top = ctx.createLinearGradient(0, h * 0.55, 0, h);
  top.addColorStop(0, `rgba(40, 22, 14, ${0.0})`);
  top.addColorStop(0.15, `rgba(40, 22, 14, ${0.85 * p})`);
  top.addColorStop(0.45, `rgba(110, 45, 25, ${0.92 * p})`);
  top.addColorStop(0.75, `rgba(165, 65, 35, ${0.95 * p})`);
  top.addColorStop(1, `rgba(190, 80, 40, ${0.95 * p})`);
  ctx.fillStyle = top;
  ctx.fillRect(0, h * 0.55, w, h * 0.5);
  // Strata lines
  ctx.strokeStyle = `rgba(255, 200, 150, ${0.18 * p})`;
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const y = h * 0.62 + i * (h * 0.06);
    ctx.beginPath();
    for (let x = 0; x <= w; x += 8) {
      const yy = y + Math.sin((x / w) * 6 + i) * 4;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawGrassPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  yOffset: number,
  xParallax: number,
  scale: number,
  t: number,
) {
  // Cover-fit the image full-bleed across the bottom of the stage.
  const baseH = h * 1.05 * scale;
  const ratio = img.width / img.height;
  let drawW = baseH * ratio;
  let drawH = baseH;
  // Guarantee horizontal cover — never letter-box the sides.
  if (drawW < w * 1.1) {
    drawW = w * 1.1;
    drawH = drawW / ratio;
  }
  // Anchor bottom-center, biased slightly past the bottom so the foreground crops cleanly.
  const x = (w - drawW) / 2 + xParallax;
  const y = h - drawH * 0.92 + yOffset;
  ctx.save();
  // Slight golden tint that fades in early acts
  ctx.globalAlpha = 1;
  ctx.drawImage(img, x, y, drawW, drawH);

  // Warm overlay across grass
  const warm = ctx.createLinearGradient(0, y, 0, y + drawH);
  warm.addColorStop(0, `rgba(255, 170, 90, ${lerp(0.18, 0, smoothstep(0.55, 0.85, t))})`);
  warm.addColorStop(1, "rgba(60, 25, 10, 0)");
  ctx.fillStyle = warm;
  ctx.fillRect(x, y, drawW, drawH);
  ctx.restore();
}
