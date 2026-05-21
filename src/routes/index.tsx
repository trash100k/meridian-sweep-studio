import { createFileRoute, Link } from "@tanstack/react-router";
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

// Snappy attack, soft tail — Apple-style.
const easeOutQuint = (x: number) => 1 - Math.pow(1 - x, 5);

function Index() {
  return (
    <SunsetStage>
      {({ t, setT }) => {
        // Act I is fully visible at rest (in0 === in1 === 0).
        const act1 = fade(t, 0, 0, 0.16, 0.24);
        const act2 = fade(t, 0.20, 0.26, 0.36, 0.46);
        const act3 = fade(t, 0.44, 0.52, 0.66, 0.76);
        const act4Reveal = Math.max(0, Math.min(1, (t - 0.80) / 0.1));

        return (
          <div className="relative h-full w-full">
            {/* Top bar */}
            <header className="absolute inset-x-0 top-0 z-30 px-6 md:px-10 py-6 flex items-center justify-between">
              <button
                onClick={() => setT(0)}
                aria-label="Restart story"
                className="font-display text-xl text-bone tracking-wide hover:text-wheat transition copy-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded px-1"
              >
                {BUSINESS.shortName}
              </button>
              <a
                href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`}
                aria-label={`Call ${BUSINESS.phone}`}
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-bone/90 hover:text-ember font-mono copy-shadow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded px-2 py-1"
                style={{ minHeight: 36 }}
              >
                <span aria-hidden>📞</span>
                <span className="tracking-normal normal-case text-sm">{BUSINESS.phone}</span>
              </a>
            </header>

            {/* Acts I–III — crossfading copy stacked center-left */}
            <div className="absolute inset-0 z-20 flex items-center px-6 md:px-12 pointer-events-none">
              <div className="max-w-2xl w-full">
                {/* Act I */}
                <ActLayer opacity={act1} hidden={act4Reveal > 0.5}>
                  <div className="readability-scrim pr-4">
                    <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-balance leading-[1.02] text-bone copy-shadow">
                      Your lawn isn't dying.
                      <br />
                      <span className="text-ember">Your soil is suffocating.</span>
                    </h1>
                    <p className="mt-6 text-base md:text-xl text-bone/90 max-w-xl text-balance copy-shadow">
                      A free, 20-second look at the dirt under your feet — before you spend another
                      dollar on fertilizer that can't reach the roots.
                    </p>
                  </div>
                </ActLayer>

                {/* Act II */}
                <ActLayer opacity={act2} hidden={act4Reveal > 0.5}>
                  <div className="readability-scrim pr-4">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-ember mb-4 font-mono copy-shadow">
                      The Red Clay Problem
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-balance leading-[1.05] text-bone copy-shadow">
                      Meridian sits on a sheet of <span className="text-ember">red Mississippi clay</span> that
                      sheds water like a tarp.
                    </h2>
                    <p className="mt-6 text-base md:text-xl text-bone/90 max-w-xl text-balance copy-shadow">
                      Your grass never had a chance. Most lawn services treat the blade. The damage is
                      six inches deeper.
                    </p>
                  </div>
                </ActLayer>

                {/* Act III */}
                <ActLayer opacity={act3} hidden={act4Reveal > 0.5}>
                  <div className="readability-scrim pr-4">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-wheat mb-4 font-mono copy-shadow">
                      The Stewards
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-balance leading-[1.05] text-bone copy-shadow">
                      {BUSINESS.shortName} are the
                      <br />
                      <span className="text-wheat italic">stewards of your lawn</span> —
                      <br />
                      six inches deeper than anyone else looks.
                    </h2>
                    <p className="mt-6 text-base md:text-xl text-bone/90 max-w-xl text-balance copy-shadow">
                      Born and raised on Meridian dirt. Family-run. Honest pricing.
                    </p>
                  </div>
                </ActLayer>
              </div>
            </div>

            {/* Act IV — liquid glass form, center */}
            <div
              className="absolute inset-0 z-30 flex items-center justify-center px-4"
              style={{ pointerEvents: act4Reveal > 0.5 ? "auto" : "none" }}
            >
              <LiquidGlassCard reveal={act4Reveal} className="w-full max-w-lg">
                <DiagnosticEngine />
              </LiquidGlassCard>
            </div>

            {/* Tiny footer credit */}
            <footer
              className="absolute inset-x-0 bottom-0 z-20 px-6 md:px-10 py-5 flex items-center justify-between text-[10px] font-mono text-bone/80 copy-shadow transition-opacity duration-500"
              style={{ opacity: t > 0.86 ? 1 : 0 }}
            >
              <a
                href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`}
                className="hover:text-ember transition"
                aria-label={`Call ${BUSINESS.phone}`}
              >
                {BUSINESS.phone}
              </a>
              <span>Powered by SoilGrids · ISRIC</span>
            </footer>

            {/* Skip-the-story link — appears once cinema is past Act II */}
            <Link
              to="/diagnostic"
              className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 text-[10px] font-mono uppercase tracking-[0.25em] text-bone/70 hover:text-wheat transition-opacity duration-500 copy-shadow"
              style={{ opacity: t > 0.04 && t < 0.78 ? 1 : 0, pointerEvents: t > 0.04 && t < 0.78 ? "auto" : "none" }}
            >
              Skip the story → run diagnostic
            </Link>

          </div>
        );
      }}
    </SunsetStage>
  );
}

function ActLayer({ opacity, hidden, children }: { opacity: number; hidden?: boolean; children: React.ReactNode }) {
  const eased = easeOutQuint(Math.max(0, Math.min(1, opacity)));
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <div
      aria-hidden={hidden || eased < 0.05}
      className="absolute inset-0 flex items-center"
      style={{
        opacity: eased,
        filter: prefersReduced ? undefined : `blur(${(1 - eased) * 6}px)`,
        transform: prefersReduced ? undefined : `translateY(${(1 - eased) * 8}px)`,
        transition: prefersReduced
          ? "opacity 360ms cubic-bezier(0.22, 1, 0.36, 1)"
          : "opacity 360ms cubic-bezier(0.22, 1, 0.36, 1), filter 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        pointerEvents: eased > 0.5 && !hidden ? "auto" : "none",
      }}
    >
      <div>{children}</div>
    </div>
  );
}
