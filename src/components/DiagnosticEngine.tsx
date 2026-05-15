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
      <div>
        <p className="font-display text-2xl md:text-3xl text-bone mb-6">
          Reading your dirt…
        </p>
        <ul className="space-y-3 font-sans">
          {STEPS.map((s, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <li key={s} className="flex items-center gap-3 text-sm">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                    done
                      ? "border-ember bg-ember text-primary-foreground"
                      : active
                        ? "border-ember/60 animate-pulse"
                        : "border-bone/20"
                  }`}
                >
                  {done ? "✓" : ""}
                </span>
                <span className={done ? "text-bone" : active ? "text-bone/80" : "text-bone/50"}>
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
          placeholder="Zip code"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          className="liquid-input"
          aria-label="Zip code"
        />
        <input
          required
          maxLength={200}
          placeholder="Property address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="liquid-input"
          aria-label="Property address"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-[11px] text-bone/50 font-mono">
          No phone required. No spam.
        </p>
        <button type="submit" className="liquid-pill">
          Read my soil →
        </button>
      </div>
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
