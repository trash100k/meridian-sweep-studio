import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runDiagnostic, attachPhone } from "@/lib/diagnostic.functions";
import { BUSINESS } from "@/config/business";

type DiagnosticResult = Awaited<ReturnType<typeof runDiagnostic>>;
type Stage = "idle" | "loading" | "report" | "thanks";

const STEPS = [
  "Querying USDA soil maps…",
  "Pulling parcel data…",
  "Capturing satellite imagery…",
];

export function DiagnosticEngine() {
  const run = useServerFn(runDiagnostic);
  const attach = useServerFn(attachPhone);

  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStage("loading");
    setStepIdx(0);
    // Stagger the visual step ticks
    const tickers = [400, 1100, 1900].map((d, i) =>
      window.setTimeout(() => setStepIdx(i + 1), d),
    );
    try {
      const r = await run({ data: { zip: zip.trim(), address: address.trim() } });
      tickers.forEach(clearTimeout);
      setStepIdx(3);
      setTimeout(() => {
        setResult(r);
        setStage("report");
      }, 350);
    } catch (err) {
      tickers.forEach(clearTimeout);
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
    return (
      <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-8 md:p-10">
        <p className="font-display text-2xl md:text-3xl text-bone mb-6">
          Running your diagnostic…
        </p>
        <ul className="space-y-3 font-sans">
          {STEPS.map((s, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <li key={s} className="flex items-center gap-3">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                    done
                      ? "border-ember bg-ember text-primary-foreground"
                      : active
                        ? "border-ember/60 animate-pulse"
                        : "border-border/60"
                  }`}
                >
                  {done ? "✓" : ""}
                </span>
                <span
                  className={
                    done ? "text-bone" : active ? "text-bone/80" : "text-muted-foreground"
                  }
                >
                  {s}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (stage === "report" && result) {
    return <Report result={result} phone={phone} setPhone={setPhone} submitPhone={submitPhone} error={error} />;
  }

  if (stage === "thanks") {
    return (
      <div className="rounded-2xl border border-ember/40 bg-card/40 backdrop-blur p-10 text-center">
        <p className="font-display text-3xl md:text-4xl text-bone mb-3">
          We've got it.
        </p>
        <p className="text-muted-foreground">
          {BUSINESS.shortName} will call within one business day to schedule your restoration window.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-8 md:p-10 space-y-5">
      <div>
        <p className="font-display text-2xl md:text-3xl text-bone leading-tight">
          Run the free diagnostic.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Two fields. Twenty seconds. No phone number required.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3">
        <input
          required
          inputMode="numeric"
          maxLength={5}
          pattern="\d{5}"
          placeholder="Zip code"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          className="rounded-md border border-input bg-background/60 px-4 py-3 text-bone placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ember"
          aria-label="Zip code"
        />
        <input
          required
          maxLength={200}
          placeholder="Property address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="rounded-md border border-input bg-background/60 px-4 py-3 text-bone placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ember"
          aria-label="Property address"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        className="w-full rounded-md bg-ember text-primary-foreground font-medium px-6 py-3.5 transition hover:brightness-110 shadow-ember"
      >
        Analyze my soil →
      </button>
    </form>
  );
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
  const { soil, grade, property, satellite } = result;
  const gradeColor =
    grade.grade === "A" || grade.grade === "B"
      ? "text-wheat"
      : grade.grade === "C"
        ? "text-ember"
        : "text-destructive";

  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Satellite */}
        <div className="aspect-[4/3] bg-loam relative overflow-hidden">
          {satellite.url ? (
            <img
              src={satellite.url}
              alt="Satellite view of property"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <YardSketch />
          )}
          <div className="absolute bottom-2 left-2 text-[10px] uppercase tracking-widest text-bone/60 font-mono">
            {satellite.url ? "Mapbox satellite" : "Generated sketch"}
          </div>
        </div>

        {/* Grade */}
        <div className="p-8 md:p-10 space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Soil Compaction Grade
            </p>
            <div className="flex items-baseline gap-4">
              <span className={`font-display text-7xl md:text-8xl leading-none ${gradeColor}`}>
                {grade.grade}
              </span>
              <span className="font-display text-xl text-bone/80">{grade.headline}</span>
            </div>
          </div>
          <p className="text-bone/80 leading-relaxed">{grade.detail}</p>
          <dl className="grid grid-cols-3 gap-3 pt-2 text-sm">
            <Stat label="Clay" value={`${soil.clay.toFixed(0)}%`} />
            <Stat label="Sand" value={`${soil.sand.toFixed(0)}%`} />
            <Stat label="Density" value={`${soil.bdod.toFixed(2)}`} unit="g/cm³" />
            <Stat label="Lot" value={`${property.lotSize}`} unit="acres" />
            <Stat label="Built" value={`${property.yearBuilt}`} />
            <Stat
              label="Est. value"
              value={`$${(property.estimatedValue / 1000).toFixed(0)}k`}
            />
          </dl>
        </div>
      </div>

      {/* Phone capture */}
      <form onSubmit={submitPhone} className="border-t border-border/60 p-8 md:p-10 bg-loam/40 space-y-4">
        <p className="font-display text-2xl md:text-3xl text-bone leading-tight">
          Book your restoration window.
        </p>
        <p className="text-sm text-muted-foreground">
          {BUSINESS.shortName} will call within one business day. No automated systems.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <input
            required
            type="tel"
            placeholder="Your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
            className="rounded-md border border-input bg-background/60 px-4 py-3 text-bone placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ember"
            aria-label="Phone number"
          />
          <button
            type="submit"
            className="rounded-md bg-ember text-primary-foreground font-medium px-6 py-3.5 transition hover:brightness-110 shadow-ember"
          >
            Book my call →
          </button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="font-display text-xl text-bone mt-0.5">
        {value}
        {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
      </dd>
    </div>
  );
}

function YardSketch() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="Stylized yard sketch">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3a1d12" />
          <stop offset="100%" stopColor="#1a0e08" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#g)" />
      {Array.from({ length: 80 }).map((_, i) => {
        const x = (i % 10) * 40 + 10;
        const y = Math.floor(i / 10) * 35 + 12;
        return (
          <line
            key={i}
            x1={x}
            y1={y + 12}
            x2={x + 4}
            y2={y}
            stroke="#a55a2a"
            strokeWidth={1.5}
            opacity={0.55}
          />
        );
      })}
      <rect x="120" y="100" width="160" height="100" fill="#0c0805" stroke="#a55a2a" strokeWidth={1.5} opacity={0.7} />
    </svg>
  );
}
