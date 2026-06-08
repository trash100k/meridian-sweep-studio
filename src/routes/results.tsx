import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import { BUSINESS } from "@/config/business";
import { PHOTOS } from "@/config/photos";

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
      { property: "og:image", content: PHOTOS.heroLawn },
      { name: "twitter:image", content: PHOTOS.heroLawn },
    ],
  }),
});

const PROJECTS = [
  {
    area: "29th Ave",
    type: "Flagstone Patio",
    note: "Irregular flagstone laid in decomposed granite, integrated with the existing planting bed. Built in 6 days.",
    photo: PHOTOS.flagstonePatio,
  },
  {
    area: "Poplar Springs",
    type: "Stone Walkway & Borders",
    note: "Hand-laid stone walkway with cut-stone edging and seasonal plantings flanking both sides.",
    photo: PHOTOS.stoneWalkway,
  },
  {
    area: "North Hills",
    type: "Terraced Stone Steps",
    note: "Stacked stone steps and tiered beds rebuilt to handle slope drainage, with fresh sod and mature shrub install.",
    photo: PHOTOS.stoneSteps,
  },
  {
    area: "Bonita Lakes",
    type: "Water Feature",
    note: "Stone-edged pond with river-rock spillway, integrated into a wooded backyard for year-round visual interest.",
    photo: PHOTOS.waterFeature,
  },
  {
    area: "West End",
    type: "Dry Creek & Drainage",
    note: "River-rock dry creek paired with a brick path — turned a wet, unusable side yard into a feature.",
    photo: PHOTOS.dryCreek,
  },
  {
    area: "Toomsuba",
    type: "Weekly Lawn Care",
    note: "Going on 3 seasons. Diamond mow stripes, edged, blown, with seasonal cleanups.",
    photo: PHOTOS.heroLawn,
  },
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
              className="overflow-hidden rounded-2xl border border-bone/10 bg-loam/40 backdrop-blur-sm"
            >
              <div className="aspect-[4/3] overflow-hidden bg-loam/60">
                <img
                  src={p.photo}
                  alt={`${p.type} — ${p.area}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/55">
                  {p.area}
                </p>
                <h3 className="mt-2 font-display text-2xl text-bone copy-shadow leading-tight">
                  {p.type}
                </h3>
                <p className="mt-3 text-sm text-bone/85 leading-relaxed">{p.note}</p>
              </div>
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
