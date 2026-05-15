import { createFileRoute } from "@tanstack/react-router";
import heroImage from "@/assets/hero-grass-sunset.jpg";
import { HazeIn } from "@/components/HazeIn";
import { DiagnosticEngine } from "@/components/DiagnosticEngine";
import { BUSINESS } from "@/config/business";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: `${BUSINESS.name} — Soil-first lawn restoration` },
      {
        name: "description",
        content:
          "Free instant soil compaction diagnostic for your property. Real USDA soil data, satellite imagery, and an A–F grade in seconds.",
      },
      { property: "og:title", content: `${BUSINESS.name} — Free soil diagnostic` },
      {
        property: "og:description",
        content: "Your lawn isn't dying. Your soil is suffocating. Run the free diagnostic.",
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

function Index() {
  return (
    <main className="bg-loam text-bone">
      {/* HERO ----------------------------------------------------------------- */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <GrassSweep className="absolute inset-0" />
        </div>
        {/* Vignette to anchor the type */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(8,4,2,0.55) 70%, rgba(8,4,2,0.85) 100%)",
          }}
        />
        <div className="relative z-10 flex h-full flex-col">
          <header className="px-6 md:px-10 py-6 flex items-center justify-between">
            <span className="font-display text-xl text-bone tracking-wide">
              {BUSINESS.shortName}
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-bone/60 font-mono">
              {BUSINESS.serviceArea}
            </span>
          </header>
          <div className="flex-1 flex items-center px-6 md:px-10">
            <div className="max-w-3xl">
              <HazeIn as="h1" className="font-display text-5xl md:text-7xl lg:text-8xl text-balance leading-[1.02]">
                Your lawn isn't dying.
                <br />
                <span className="text-ember">Your soil is suffocating.</span>
              </HazeIn>
              <HazeIn delay={500} as="p" className="mt-6 text-lg md:text-xl text-bone/80 max-w-xl text-balance">
                A free, 20-second diagnostic of the dirt under your feet. Real soil data, satellite imagery, and a compaction grade — before you spend another dollar on fertilizer that can't reach the roots.
              </HazeIn>
              <HazeIn delay={1000} className="mt-10">
                <a
                  href="#diagnostic"
                  className="inline-flex items-center gap-2 rounded-md bg-ember text-primary-foreground font-medium px-7 py-4 shadow-ember transition hover:brightness-110"
                >
                  Run my free diagnostic →
                </a>
              </HazeIn>
            </div>
          </div>
        </div>
      </section>

      {/* RED CLAY PROBLEM ---------------------------------------------------- */}
      <section className="relative py-28 md:py-40 px-6 md:px-10">
        <div className="max-w-3xl mx-auto space-y-20 md:space-y-28">
          <HazeIn>
            <p className="text-xs uppercase tracking-[0.3em] text-ember mb-4">The Red Clay Problem</p>
            <p className="font-display text-3xl md:text-5xl text-balance leading-tight">
              Mississippi sits on a sheet of compacted clay that sheds water like a tarp.
            </p>
          </HazeIn>
          <HazeIn delay={120}>
            <p className="font-display text-3xl md:text-5xl text-balance leading-tight text-bone/85">
              Most lawn services treat the <em className="not-italic text-ember">blade</em>. The damage is six inches deeper.
            </p>
          </HazeIn>
          <HazeIn delay={240}>
            <p className="font-display text-3xl md:text-5xl text-balance leading-tight text-bone/85">
              You don't need more fertilizer. You need <em className="not-italic text-ember">air</em> in the ground.
            </p>
          </HazeIn>
        </div>
      </section>

      {/* DIAGNOSTIC ENGINE --------------------------------------------------- */}
      <section id="diagnostic" className="relative py-24 md:py-32 px-6 md:px-10 bg-soil/30 border-y border-border/40 scroll-mt-12">
        <div className="max-w-3xl mx-auto">
          <HazeIn>
            <p className="text-xs uppercase tracking-[0.3em] text-ember mb-4">The Diagnostic Engine</p>
            <h2 className="font-display text-4xl md:text-6xl text-balance leading-tight mb-12">
              Find out what's actually under your grass.
            </h2>
          </HazeIn>
          <DiagnosticEngine />
        </div>
      </section>

      {/* FOOTER -------------------------------------------------------------- */}
      <footer className="px-6 md:px-10 py-10 border-t border-border/40">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm">
          <div>
            <p className="font-display text-lg text-bone">{BUSINESS.name}</p>
            <p className="text-muted-foreground">
              {BUSINESS.serviceArea} · {BUSINESS.phone}
            </p>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Powered by SoilGrids · ISRIC
          </p>
        </div>
      </footer>
    </main>
  );
}
