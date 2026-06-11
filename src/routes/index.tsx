import { createFileRoute, Link } from "@tanstack/react-router";
import { SunsetStage } from "@/components/SunsetStage";
import { LiquidGlassCard } from "@/components/LiquidGlassCard";
import { BUSINESS } from "@/config/business";
import { PHOTOS } from "@/config/photos";


export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: `${BUSINESS.name} — Landscaping, Masonry & Lawn Care in ${BUSINESS.serviceArea}` },
      {
        name: "description",
        content: `Family-run landscaping, hardscaping, stone masonry, outdoor lighting, and weekly lawn care across ${BUSINESS.serviceArea}. Owned by ${BUSINESS.owner}. Call ${BUSINESS.phone}.`,
      },
      { property: "og:title", content: `${BUSINESS.name} — ${BUSINESS.serviceArea}` },
      {
        property: "og:description",
        content: `Landscaping, masonry, lighting, and lawn care. Owned by ${BUSINESS.owner}.`,
      },
      { property: "og:image", content: PHOTOS.heroLawn },
      { name: "twitter:image", content: PHOTOS.heroLawn },
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

const fade = (t: number, in0: number, in1: number, out0: number, out1: number) => {
  if (t <= in0) return in0 === in1 ? 1 : 0;
  if (t < in1) return (t - in0) / (in1 - in0);
  if (t <= out0) return 1;
  if (t < out1) return 1 - (t - out0) / (out1 - out0);
  return 0;
};

const easeOutQuint = (x: number) => 1 - Math.pow(1 - x, 5);

const SERVICES = [
  { name: "Lawn Maintenance", note: "Weekly mowing, edging, cleanups", photo: PHOTOS.stripedLawn },
  { name: "Landscape Design", note: "Beds, plantings, refreshes", photo: PHOTOS.flowerBed },
  { name: "Hardscaping", note: "Patios, walls, fire pits", photo: PHOTOS.flagstonePatio },
  { name: "Stone Masonry", note: "Hand-laid stonework that lasts", photo: PHOTOS.stoneWalkway },
  { name: "Outdoor Lighting", note: "Low-voltage LED, paths + uplighting", photo: PHOTOS.flagstonePatio },
  { name: "Free Soil Diagnostic", note: "When grass won't take", to: "/diagnostic" as const, photo: PHOTOS.dryCreek },
];

function Index() {
  return (
    <SunsetStage>
      {({ t, setT }) => {
        const act1 = fade(t, 0, 0, 0.16, 0.24);
        const act2 = fade(t, 0.20, 0.26, 0.36, 0.46);
        const act3 = fade(t, 0.44, 0.52, 0.66, 0.76);
        const act4Reveal = Math.max(0, Math.min(1, (t - 0.80) / 0.1));

        return (
          <div className="relative h-full w-full">
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

            <div className="absolute inset-0 z-20 flex items-center px-6 md:px-12 pointer-events-none">
              <div className="max-w-2xl w-full">
                <ActLayer opacity={act1} hidden={act4Reveal > 0.5}>
                  <div className="readability-scrim pr-4">
                    <div className="flex items-center gap-4 mb-6">
                      <span aria-hidden className="eyebrow-rule" />
                      <span className="eyebrow copy-shadow">{BUSINESS.serviceArea} · Family-run since {BUSINESS.founded}</span>
                      <span aria-hidden className="eyebrow-rule" />
                    </div>
                    <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-balance leading-[1.02] tracking-tight text-bone copy-shadow">
                      Landscaping, masonry, and lawn care —
                      <br />
                      <span className="text-ember italic">done by hand, done right.</span>
                    </h1>
                    <p className="support-line copy-shadow mt-8 max-w-xl text-balance">
                      {BUSINESS.name}. Owned and run by {BUSINESS.owner} and a small in-house crew.
                    </p>
                  </div>
                </ActLayer>

                <ActLayer opacity={act2} hidden={act4Reveal > 0.5}>
                  <div className="readability-scrim pr-4">
                    <div className="flex items-center gap-4 mb-6">
                      <span aria-hidden className="eyebrow-rule" />
                      <span className="eyebrow copy-shadow">What we do</span>
                      <span aria-hidden className="eyebrow-rule" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-balance leading-[1.04] tracking-tight text-bone copy-shadow">
                      One crew for the <span className="text-ember italic">whole yard</span> — from weekly mowing to hand-laid stone.
                    </h2>
                    <p className="support-line copy-shadow mt-8 max-w-xl text-balance">
                      Lawn care · Landscape design · Hardscaping · Stone masonry · Outdoor lighting.
                    </p>
                  </div>
                </ActLayer>

                <ActLayer opacity={act3} hidden={act4Reveal > 0.5}>
                  <div className="readability-scrim pr-4">
                    <div className="flex items-center gap-4 mb-6">
                      <span aria-hidden className="eyebrow-rule" />
                      <span className="eyebrow copy-shadow">Why people call us</span>
                      <span aria-hidden className="eyebrow-rule" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-balance leading-[1.02] tracking-tight text-bone copy-shadow">
                      The <span className="text-wheat">owner</span> answers the phone. The crew you meet is the crew that <span className="text-ember italic">does the work.</span>
                    </h2>
                    <p className="support-line copy-shadow mt-8 max-w-xl text-balance">
                      ★ {BUSINESS.rating.stars} on Google ({BUSINESS.rating.count} reviews) · 5.0 on Facebook · Licensed & insured.
                    </p>
                  </div>
                </ActLayer>

              </div>
            </div>

            {/* Act IV — services card + phone CTA */}
            <div
              className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 py-20 overflow-y-auto"
              style={{ pointerEvents: act4Reveal > 0.5 ? "auto" : "none" }}
            >
              <LiquidGlassCard reveal={act4Reveal} className="w-full max-w-2xl">
                <div className="p-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember mb-2 copy-shadow">
                    Services
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl text-bone copy-shadow mb-5">
                    What can we do for your yard?
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-2.5">
                    {SERVICES.map((s) => {
                      const inner = (
                        <>
                          <img
                            src={s.photo}
                            alt=""
                            aria-hidden
                            loading="lazy"
                            className="h-11 w-11 shrink-0 rounded-lg object-cover border border-bone/15"
                          />
                          <div className="min-w-0">
                            <p className="font-display text-lg text-bone copy-shadow leading-tight truncate">{s.name}</p>
                            <p className="text-[12px] text-bone/70 mt-0.5">{s.note}</p>
                          </div>
                        </>
                      );
                      return s.to ? (
                        <li key={s.name}>
                          <Link
                            to={s.to}
                            className="flex items-center gap-3 rounded-xl border border-bone/15 hover:border-ember/50 px-3 py-2.5 transition bg-loam/30"
                          >
                            {inner}
                          </Link>
                        </li>
                      ) : (
                        <li key={s.name}>
                          <Link
                            to="/services"
                            className="flex items-center gap-3 rounded-xl border border-bone/10 hover:border-ember/50 px-3 py-2.5 transition bg-loam/20"
                          >
                            {inner}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/services" className="liquid-pill text-sm">All services →</Link>
                    <Link to="/contact" className="liquid-pill text-sm">Request a quote →</Link>
                  </div>
                </div>
              </LiquidGlassCard>

              <div
                className="mt-6 w-full max-w-2xl rounded-2xl border border-bone/15 backdrop-blur-md px-5 py-4"
                style={{
                  opacity: act4Reveal,
                  transform: `translateY(${(1 - act4Reveal) * 12}px)`,
                  transition: "opacity 480ms cubic-bezier(0.22,1,0.36,1), transform 480ms cubic-bezier(0.22,1,0.36,1)",
                  background:
                    "linear-gradient(135deg, rgba(255,140,80,0.12) 0%, rgba(8,4,12,0.55) 100%)",
                }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember mb-3 copy-shadow">
                  Or just call {BUSINESS.owner}
                </p>
                <ul className="space-y-1.5 text-[13px] text-bone/90">
                  <li className="flex gap-2"><span className="text-ember">·</span>Free walkthrough — no obligation, no upsell</li>
                  <li className="flex gap-2"><span className="text-ember">·</span>Same-week scheduling — {BUSINESS.serviceArea} + 25 mi</li>
                  <li className="flex gap-2"><span className="text-ember">·</span>Real person answers — one business day</li>
                </ul>
                <a
                  href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-4 inline-flex items-center gap-2 font-display text-2xl text-bone hover:text-ember transition copy-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded"
                  aria-label={`Call ${BUSINESS.phone}`}
                >
                  <span aria-hidden>📞</span>
                  {BUSINESS.phone}
                </a>
              </div>
            </div>

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
              <span>{BUSINESS.name} · Licensed & insured</span>
            </footer>

            <Link
              to="/services"
              className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 text-[10px] font-mono uppercase tracking-[0.25em] text-bone/70 hover:text-wheat transition-opacity duration-500 copy-shadow"
              style={{ opacity: t > 0.04 && t < 0.78 ? 1 : 0, pointerEvents: t > 0.04 && t < 0.78 ? "auto" : "none" }}
            >
              Skip the story → see services
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
