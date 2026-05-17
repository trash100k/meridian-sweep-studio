import { createFileRoute } from "@tanstack/react-router";
import { SunsetStage } from "@/components/SunsetStage";
import { LiquidGlassCard } from "@/components/LiquidGlassCard";
import { DiagnosticEngine } from "@/components/DiagnosticEngine";
import { BUSINESS } from "@/config/business";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: `${BUSINESS.name} — Stewards of your lawn in Meridian, MS` },
      {
        name: "description",
        content:
          "Meridian's red clay sheds water like a tarp. Affordable Landscaping reads the soil six inches deeper than anyone else looks. Free 20-second diagnostic.",
      },
      { property: "og:title", content: `${BUSINESS.name} — Free soil diagnostic` },
      {
        property: "og:description",
        content: "Your lawn isn't dying. Your soil is suffocating. Meridian, MS.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
});

// Plateau fade: ramps in over [in0,in1], holds at 1 across [in1,out0], ramps out over [out0,out1].
const fade = (t: number, in0: number, in1: number, out0: number, out1: number) => {
  if (t <= in0) return in0 === in1 ? 1 : 0;
  if (t < in1) return (t - in0) / (in1 - in0);
  if (t <= out0) return 1;
  if (t < out1) return 1 - (t - out0) / (out1 - out0);
  return 0;
};

function Index() {
  return (
    <SunsetStage>
      {({ t, setT }) => {
        // Act I is fully visible at rest (in0 === in1 === 0).
        const act1 = fade(t, 0, 0, 0.18, 0.28);
        const act2 = fade(t, 0.20, 0.30, 0.48, 0.58);
        const act3 = fade(t, 0.50, 0.60, 0.74, 0.82);
        const act4Reveal = Math.max(0, Math.min(1, (t - 0.82) / 0.1));

        return (
          <div className="relative h-full w-full">
            {/* Top bar */}
            <header className="absolute inset-x-0 top-0 z-30 px-6 md:px-10 py-6 flex items-center justify-between">
              <button
                onClick={() => setT(0)}
                className="font-display text-xl text-bone tracking-wide hover:text-wheat transition"
              >
                {BUSINESS.shortName}
              </button>
              <span className="text-[10px] uppercase tracking-[0.3em] text-bone/60 font-mono">
                {BUSINESS.serviceArea}
              </span>
            </header>

            {/* Acts I–III — crossfading copy stacked center-left */}
            <div className="absolute inset-0 z-20 flex items-center px-6 md:px-12 pointer-events-none">
              <div className="max-w-2xl w-full">
                {/* Act I */}
                <ActLayer opacity={act1}>
                  <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-balance leading-[1.02] text-bone">
                    Your lawn isn't dying.
                    <br />
                    <span className="text-ember">Your soil is suffocating.</span>
                  </h1>
                  <p className="mt-6 text-lg md:text-xl text-bone/80 max-w-xl text-balance">
                    A free, 20-second look at the dirt under your feet — before you spend another
                    dollar on fertilizer that can't reach the roots.
                  </p>
                </ActLayer>

                {/* Act II */}
                <ActLayer opacity={act2}>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-ember mb-4 font-mono">
                    The Red Clay Problem
                  </p>
                  <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-balance leading-[1.05] text-bone">
                    Meridian sits on a sheet of <span className="text-ember">red Mississippi clay</span> that
                    sheds water like a tarp.
                  </h2>
                  <p className="mt-6 text-lg md:text-xl text-bone/80 max-w-xl text-balance">
                    Your grass never had a chance. Most lawn services treat the blade. The damage is
                    six inches deeper.
                  </p>
                </ActLayer>

                {/* Act III */}
                <ActLayer opacity={act3}>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-wheat mb-4 font-mono">
                    The Stewards
                  </p>
                  <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-balance leading-[1.05] text-bone">
                    {BUSINESS.shortName} are the
                    <br />
                    <span className="text-wheat italic">stewards of your lawn</span> —
                    <br />
                    six inches deeper than anyone else looks.
                  </h2>
                  <p className="mt-6 text-lg md:text-xl text-bone/80 max-w-xl text-balance">
                    Born and raised on Meridian dirt. Family-run. Honest pricing.
                  </p>
                </ActLayer>
              </div>
            </div>

            {/* Act IV — liquid glass form, center */}
            <div
              className="absolute inset-0 z-30 flex items-center justify-center px-4"
              style={{ pointerEvents: act4Reveal > 0.6 ? "auto" : "none" }}
            >
              <LiquidGlassCard reveal={act4Reveal} className="w-full max-w-lg">
                <DiagnosticEngine />
              </LiquidGlassCard>
            </div>

            {/* Tiny footer credit */}
            <footer
              className="absolute inset-x-0 bottom-0 z-20 px-6 md:px-10 py-5 flex items-center justify-between text-[10px] font-mono text-bone/40 transition-opacity duration-500"
              style={{ opacity: t > 0.85 ? 1 : 0 }}
            >
              <span>{BUSINESS.phone}</span>
              <span>Powered by SoilGrids · ISRIC</span>
            </footer>
          </div>
        );
      }}
    </SunsetStage>
  );
}

function ActLayer({ opacity, children }: { opacity: number; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{
        opacity,
        filter: `blur(${(1 - opacity) * 10}px)`,
        transform: `translateY(${(1 - opacity) * 12}px)`,
        transition: "opacity 200ms linear, filter 200ms linear, transform 200ms linear",
        pointerEvents: opacity > 0.5 ? "auto" : "none",
      }}
    >
      <div>{children}</div>
    </div>
  );
}
