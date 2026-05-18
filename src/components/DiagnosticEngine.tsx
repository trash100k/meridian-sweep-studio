import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runDiagnostic, attachPhone } from "@/lib/diagnostic.functions";
import { BUSINESS } from "@/config/business";

type DiagnosticResult = Awaited<ReturnType<typeof runDiagnostic>>;
type Stage = "idle" | "loading" | "report" | "thanks";

const SPRING = "cubic-bezier(0.22, 1, 0.36, 1)";
const LOADER_CEILING_MS = 45000;

export function DiagnosticEngine() {
  const run = useServerFn(runDiagnostic);
  const attach = useServerFn(attachPhone);

  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaderKey, setLoaderKey] = useState(0);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoaderKey((k) => k + 1);
    setStage("loading");
    try {
      const r = await run({ data: { zip: zip.trim(), address: address.trim() } });
      // brief hold so the sun dips below the ridge before swapping views
      await new Promise((res) => setTimeout(res, 350));
      setResult(r);
      setStage("report");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setStage("idle");
    }
  };

  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    setError(null);
    try {
      await attach({ data: { leadId: result.leadId, phone: phone.trim() } });
      setStage("thanks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save phone.");
    }
  };

  if (stage === "loading") {
    return <SunsetLoader key={loaderKey} onRetry={() => submit()} />;
  }

  if (stage === "report" && result) {
    return <Report result={result} phone={phone} setPhone={setPhone} submitPhone={submitPhone} error={error} />;
  }

  if (stage === "thanks") {
    return (
      <div className="text-center py-2">
        <p className="font-display text-3xl md:text-4xl text-bone mb-3">
          We've got it.
        </p>
        <p className="text-bone/70 text-sm">
          {BUSINESS.shortName} will call within one business day to walk your yard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-bone/60 font-mono mb-3">
          Free soil diagnostic · 20 seconds
        </p>
        <p className="font-display text-3xl md:text-4xl text-bone leading-[1.05] text-balance">
          What's actually under your grass?
        </p>
      </div>
      <div className="space-y-1">
        <input
          required
          inputMode="numeric"
          maxLength={5}
          pattern="\d{5}"
          autoComplete="postal-code"
          placeholder="Zip code"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          className="liquid-input"
          aria-label="Zip code"
        />
        <input
          required
          maxLength={200}
          autoComplete="street-address"
          placeholder="Property address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="liquid-input"
          aria-label="Property address"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-[11px] text-bone/70 font-mono">
          No phone required. No spam.
        </p>
        <button type="submit" className="liquid-pill">
          Read my soil →
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SunsetLoader — the sun descends behind a rolling hill while we read soil.
// Copy escalates if the server takes longer than usual.
// ─────────────────────────────────────────────────────────────────────────

function SunsetLoader({ onRetry }: { onRetry: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(performance.now());

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setElapsed(7000);
      return;
    }
    let raf = 0;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      setElapsed(performance.now() - startRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  // progress easing — asymptotic toward 0.95
  const seconds = elapsed / 1000;
  const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
  const base = Math.min(1, seconds / 6);
  const progress = Math.min(0.95, easeOutCubic(base) * 0.85 + (1 - Math.exp(-seconds / 14)) * 0.15);

  // Sun y-position 18% (top) → 82% (below ridge). Slow path parks at ~70% (ridge crest).
  const slow = seconds > 14;
  const sunFall = easeOutCubic(Math.min(1, seconds / 6));
  let sunY = 18 + sunFall * (slow ? 52 : 64); // %
  // Slow-path breathing
  if (slow) {
    const b = Math.sin(seconds * 1.4) * 0.6;
    sunY += b;
  }

  // Copy beats
  const phase = seconds < 6 ? 0 : seconds < 14 ? 1 : seconds < 22 ? 2 : 3;
  const lines = [
    "Reading your dirt…",
    "Pulling deeper records — Meridian clay is thick today.",
    "Letting the sun rest on the ridge while we finish.",
    "Still working. This parcel is taking longer than usual.",
  ];

  // Star opacity after dusk
  const starOpacity = Math.max(0, (progress - 0.85) / 0.15);
  // God-ray intensity
  const rayOpacity = Math.min(0.6, Math.max(0, (sunY - 30) / 60));
  // Sky tint progresses with sun
  const dusk = Math.min(1, sunFall);

  return (
    <div className="space-y-5">
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-bone/10"
        style={{ aspectRatio: "16 / 9" }}
        aria-live="polite"
        aria-label="Reading your soil"
      >
        {/* Sky */}
        <svg viewBox="0 0 320 180" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={mix("#ffb070", "#0a0420", dusk)} />
              <stop offset="35%" stopColor={mix("#e88a3a", "#1a1238", dusk)} />
              <stop offset="65%" stopColor={mix("#a64a2c", "#3a1d3a", dusk)} />
              <stop offset="100%" stopColor={mix("#5a2b18", "#08030f", dusk)} />
            </linearGradient>
            <radialGradient id="bloom" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,220,170,0.85)" />
              <stop offset="40%" stopColor="rgba(255,170,90,0.35)" />
              <stop offset="100%" stopColor="rgba(255,120,70,0)" />
            </radialGradient>
            <radialGradient id="disc" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,240,210,1)" />
              <stop offset="70%" stopColor="rgba(255,180,110,0.95)" />
              <stop offset="100%" stopColor="rgba(255,140,80,0)" />
            </radialGradient>
            <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c0e08" />
              <stop offset="100%" stopColor="#08030a" />
            </linearGradient>
          </defs>
          <rect width="320" height="180" fill="url(#sky)" />

          {/* Stars */}
          {starOpacity > 0 &&
            STARS.map(([sx, sy, sr], i) => (
              <circle key={i} cx={sx} cy={sy} r={sr} fill="#f5ecd6" opacity={starOpacity * 0.9} />
            ))}

          {/* Sun bloom */}
          <g transform={`translate(180 ${sunY * 1.8})`}>
            <circle r="56" fill="url(#bloom)" />
            <circle r="18" fill="url(#disc)" />
          </g>

          {/* God rays */}
          {rayOpacity > 0.01 && (
            <g opacity={rayOpacity} style={{ mixBlendMode: "screen" }}>
              {[-0.35, -0.1, 0.18].map((slope, i) => (
                <line
                  key={i}
                  x1={180}
                  y1={sunY * 1.8}
                  x2={180 + slope * 260}
                  y2={sunY * 1.8 - 180}
                  stroke="rgba(255,220,170,0.55)"
                  strokeWidth={1.1}
                />
              ))}
            </g>
          )}

          {/* Horizon haze */}
          <rect x="0" y="118" width="320" height="14" fill="url(#bloom)" opacity="0.35" />

          {/* Hill silhouette */}
          <path
            d="M0,180 L0,138 C30,128 55,118 90,124 C120,129 140,138 170,132 C205,125 230,116 260,122 C285,127 305,134 320,130 L320,180 Z"
            fill="url(#hill)"
          />
          {/* Ridge light */}
          <path
            d="M0,138 C30,128 55,118 90,124 C120,129 140,138 170,132 C205,125 230,116 260,122 C285,127 305,134 320,130"
            fill="none"
            stroke="rgba(255,180,110,0.55)"
            strokeWidth="0.6"
            opacity={Math.max(0, 1 - dusk * 0.7)}
          />
        </svg>

        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, transparent 40%, rgba(8,4,12,0.55) 100%)",
          }}
        />
      </div>

      {/* Copy beats */}
      <div className="relative h-12">
        {lines.map((line, i) => (
          <p
            key={i}
            className="absolute inset-0 font-display text-xl md:text-2xl text-bone leading-snug text-balance"
            style={{
              opacity: i === phase ? 1 : 0,
              transform: `translateY(${i === phase ? 0 : 6}px)`,
              transition: `opacity 420ms ${SPRING}, transform 480ms ${SPRING}`,
            }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="relative h-px w-full overflow-hidden rounded-full bg-bone/15">
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, var(--ember), var(--wheat))",
              transition: `width 640ms ${SPRING}`,
            }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-bone/50">
          <span>{Math.round(progress * 100)}%</span>
          <span>t+{Math.floor(seconds).toString().padStart(2, "0")}s</span>
        </div>
      </div>

      {/* Slow-path actions */}
      {phase === 3 && (
        <div className="flex items-center justify-end gap-3 pt-1">
          <span className="text-[11px] font-mono text-bone/50">No data was lost.</span>
          <button type="button" onClick={onRetry} className="liquid-pill">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

const STARS: Array<[number, number, number]> = [
  [42, 22, 0.7],
  [78, 38, 0.5],
  [126, 18, 0.6],
  [205, 30, 0.5],
  [248, 14, 0.7],
  [284, 44, 0.5],
  [302, 22, 0.6],
];

function mix(aHex: string, bHex: string, t: number): string {
  const a = hex(aHex);
  const b = hex(bHex);
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function hex(h: string): [number, number, number] {
  const s = h.replace("#", "");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

function Report({
  result,
  phone,
  setPhone,
  submitPhone,
  error,
}: {
  result: DiagnosticResult;
  phone: string;
  setPhone: (s: string) => void;
  submitPhone: (e: React.FormEvent) => void;
  error: string | null;
}) {
  const { soil, grade, property } = result;
  const gradeColor =
    grade.grade === "A" || grade.grade === "B"
      ? "text-wheat"
      : grade.grade === "C"
        ? "text-ember"
        : "text-destructive";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-bone/60 font-mono mb-2">
          Soil Compaction Grade
        </p>
        <div className="flex items-baseline gap-4">
          <span className={`font-display text-7xl md:text-8xl leading-none ${gradeColor}`}>
            {grade.grade}
          </span>
          <span className="font-display text-xl text-bone/85">{grade.headline}</span>
        </div>
      </div>
      <p className="text-bone/80 leading-relaxed text-sm md:text-base">{grade.detail}</p>
      <dl className="grid grid-cols-3 gap-3 pt-2 text-sm border-t border-bone/10">
        <Stat label="Clay" value={`${soil.clay.toFixed(0)}%`} />
        <Stat label="Sand" value={`${soil.sand.toFixed(0)}%`} />
        <Stat label="Density" value={`${soil.bdod.toFixed(2)}`} unit="g/cm³" />
        <Stat label="Lot" value={`${property.lotSize}`} unit="acres" />
        <Stat label="Built" value={`${property.yearBuilt}`} />
        <Stat label="Est." value={`$${(property.estimatedValue / 1000).toFixed(0)}k`} />
      </dl>

      <form onSubmit={submitPhone} className="pt-4 border-t border-bone/10 space-y-4">
        <p className="font-display text-2xl text-bone leading-tight">
          Want us to walk it?
        </p>
        <p className="text-xs text-bone/60">
          Drop a number — {BUSINESS.shortName} calls within one business day. No automated systems.
        </p>
        <input
          required
          type="tel"
          placeholder="Your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={20}
          className="liquid-input"
          aria-label="Phone number"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end">
          <button type="submit" className="liquid-pill">
            Book my walk →
          </button>
        </div>
      </form>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="pt-3">
      <dt className="text-[10px] uppercase tracking-widest text-bone/50 font-mono">{label}</dt>
      <dd className="font-display text-xl text-bone mt-0.5">
        {value}
        {unit && <span className="text-[10px] text-bone/50 ml-1 font-mono">{unit}</span>}
      </dd>
    </div>
  );
}
