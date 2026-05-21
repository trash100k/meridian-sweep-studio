import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import { BUSINESS } from "@/config/business";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      { title: `Results — ${BUSINESS.shortName}` },
      {
        name: "description",
        content:
          "Before-and-after soil grade lifts and homeowner quotes from Meridian, MS lawns we've restored.",
      },
      { property: "og:title", content: `Results — ${BUSINESS.shortName}` },
      {
        property: "og:description",
        content: "Real soil grades before and after. Not opinions.",
      },
    ],
  }),
});

const LIFTS = [
  { area: "29th Ave", before: "F", after: "B", note: "Standing water gone in one season." },
  { area: "Poplar Springs", before: "D", after: "B", note: "Roots down 4 inches in 90 days." },
  { area: "North Hills", before: "C", after: "A", note: "Cut watering by 40%." },
  { area: "Bonita Lakes", before: "F", after: "C", note: "Year-one fix. Tracking toward B." },
  { area: "West End", before: "D", after: "A", note: "Drainage rebuild + restoration." },
  { area: "Toomsuba", before: "C", after: "B", note: "Just aeration. No re-sod needed." },
];

const QUOTES = [
  {
    body: "They told me my soil was the problem, not my fertilizer. They were right. First time in eight years the grass is green in August.",
    by: "Marcus T., Meridian",
  },
  {
    body: "Honest pricing, showed up when they said. The soil report alone was worth more than what most companies charge to mow.",
    by: "Linda R., Poplar Springs",
  },
  {
    body: "We were ready to re-sod the whole lot. They aerated, did the deep work, and the lawn came back on its own.",
    by: "James K., North Hills",
  },
];

function ResultsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Results"
        title={<>Real <span className="text-ember">grade lifts</span>. Not opinions.</>}
        body="Every job ends with a 90-day re-read using the same soil source we started with. Here's what changed."
      />

      <PageSection>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LIFTS.map((l) => (
            <article
              key={l.area}
              className="rounded-2xl border border-bone/10 bg-loam/40 p-6 backdrop-blur-sm"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/55">
                {l.area}
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-5xl text-destructive">{l.before}</span>
                <span className="font-mono text-bone/40">→</span>
                <span className="font-display text-5xl text-wheat">{l.after}</span>
              </div>
              <p className="mt-4 text-sm text-bone/85 leading-relaxed">{l.note}</p>
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
          <Link to="/diagnostic" className="liquid-pill">
            See your starting grade →
          </Link>
        </div>
      </PageSection>

      <CallBand
        headline="Want grade lifts like these on your lawn?"
        sub="Every job above started with one phone call. We'll tell you on the spot if your soil is fixable — and what it'd realistically cost."
      />
    </PageShell>
  );
}
