import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import { BUSINESS } from "@/config/business";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      { title: `Recent Work — ${BUSINESS.shortName}` },
      {
        name: "description",
        content: `Hardscaping, masonry, lighting, and lawn restoration projects ${BUSINESS.shortName} has completed across Meridian, MS.`,
      },
      { property: "og:title", content: `Recent Work — ${BUSINESS.shortName}` },
      {
        property: "og:description",
        content: "Patios, stonework, plantings, lighting — completed jobs across Meridian.",
      },
    ],
  }),
});

const PROJECTS = [
  { area: "29th Ave", type: "Paver Patio", note: "550 sq ft of charcoal pavers + fire pit. Built in 6 days." },
  { area: "Poplar Springs", type: "Stone Retaining Wall", note: "Hand-laid limestone, 38 ft long, terraced planting above." },
  { area: "North Hills", type: "Full Landscape Refresh", note: "Bed redesign, 22 new shrubs, mulch reset, sprinkler tune-up." },
  { area: "Bonita Lakes", type: "Outdoor Lighting", note: "12-fixture path + tree uplighting. Low-voltage LED, 10-year warranty." },
  { area: "West End", type: "Drainage + Sod Restoration", note: "French drain install, regraded back yard, fresh sod that finally held." },
  { area: "Toomsuba", type: "Weekly Lawn Care", note: "Going on 3 seasons. Mow, edge, blow, seasonal cleanups." },
];

const QUOTES = [
  {
    body: "Richard and his crew built us a patio we use every weekend now. Came in on budget, finished a day early, and cleaned up like they were never there.",
    by: "Marcus T., Meridian",
  },
  {
    body: "Honest pricing, showed up when they said. The stone wall they built looks like it's been there forever. Couldn't be happier.",
    by: "Linda R., Poplar Springs",
  },
  {
    body: "We've tried three other lawn companies. R & C is the only one that does it right every time and actually answers the phone.",
    by: "James K., North Hills",
  },
];

function ResultsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Recent Work"
        title={<>Jobs we're <span className="text-ember">proud to point at.</span></>}
        body="A small sample of what we've built around Meridian. Want to see more? Ask Richard — he'll text you photos from his phone."
      />

      <PageSection>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <article
              key={p.area + p.type}
              className="rounded-2xl border border-bone/10 bg-loam/40 p-6 backdrop-blur-sm"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/55">
                {p.area}
              </p>
              <h3 className="mt-3 font-display text-2xl text-bone copy-shadow leading-tight">
                {p.type}
              </h3>
              <p className="mt-4 text-sm text-bone/85 leading-relaxed">{p.note}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-6 md:grid-cols-3">
          {QUOTES.map((q) => (
            <figure
              key={q.by}
              className="rounded-2xl border border-bone/10 bg-loam/30 p-6 backdrop-blur-sm"
            >
              <blockquote className="font-display text-lg text-bone/95 leading-snug">
                "{q.body}"
              </blockquote>
              <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/55">
                — {q.by}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/contact" className="liquid-pill">
            Get a quote for your project →
          </Link>
        </div>
      </PageSection>

      <CallBand
        headline="Want work like this on your property?"
        sub={`Every job above started with one phone call to ${BUSINESS.owner}. We'll tell you on the spot whether it's a fit and what it'd realistically cost.`}
      />
    </PageShell>
  );
}
