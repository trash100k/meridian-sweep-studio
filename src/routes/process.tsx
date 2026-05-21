import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import { BUSINESS } from "@/config/business";

export const Route = createFileRoute("/process")({
  component: ProcessPage,
  head: () => ({
    meta: [
      { title: `Our Process — ${BUSINESS.shortName}` },
      {
        name: "description",
        content:
          "Four steps from a free soil diagnostic to a lawn that holds the rain it's given. Meridian, MS.",
      },
      { property: "og:title", content: `Our Process — ${BUSINESS.shortName}` },
      {
        property: "og:description",
        content: "Diagnose. Map. Restore. Steward.",
      },
    ],
  }),
});

const STEPS = [
  {
    n: "01",
    title: "Diagnose",
    body: "Free, 60-second address-level soil read. Clay %, bulk density, a written compaction grade. No call. No card.",
  },
  {
    n: "02",
    title: "Map",
    body: "If the grade warrants it, we walk your yard and mark zones — high traffic, low spots, drainage paths. You see the same map we do.",
  },
  {
    n: "03",
    title: "Restore",
    body: "Aeration, deep fracturing, drainage build — only what your soil actually needs. Honest line items, no upsell.",
  },
  {
    n: "04",
    title: "Steward",
    body: "90-day re-read included. We compare before/after grades, leave you a one-page maintenance plan, and check back next season.",
  },
];

function ProcessPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Process"
        title={<>How we work the <span className="text-ember">six inches</span> nobody else looks at.</>}
        body="Four steps, in order, every time. Skip any of them and you're just guessing."
      />

      <PageSection>
        <ol className="space-y-12 md:space-y-20">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className={`grid gap-6 md:gap-12 md:grid-cols-2 items-center ${
                i % 2 === 1 ? "md:[&>:first-child]:order-2" : ""
              }`}
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember mb-3 copy-shadow">
                  Step {s.n}
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-bone copy-shadow">
                  {s.title}
                </h2>
                <p className="mt-5 text-base md:text-lg text-bone/90 max-w-md leading-relaxed">
                  {s.body}
                </p>
              </div>
              <div
                aria-hidden
                className="aspect-video rounded-2xl border border-bone/10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,170,90,0.15) 0%, rgba(58,29,58,0.4) 60%, rgba(8,4,12,0.6) 100%)",
                }}
              >
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-7xl md:text-9xl text-bone/15">
                    {s.n}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex justify-center">
          <Link to="/diagnostic" className="liquid-pill">
            Run step 01 now →
          </Link>
        </div>
      </PageSection>

      <CallBand
        headline="Skip the guesswork. Book the free yard walk."
        sub="Steps 02 through 04 start on-site. Call and we'll set a time this week — Meridian + 25 miles, no obligation."
      />
    </PageShell>
  );
}
