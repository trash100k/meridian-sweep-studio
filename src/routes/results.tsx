import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import { SITE_CONFIG } from "@/config/site";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      { title: `Results — ${SITE_CONFIG.business.shortName}` },
      {
        name: "description",
        content: `Before-and-after soil grade lifts and homeowner quotes from ${SITE_CONFIG.business.serviceArea} lawns we've restored.`,
      },
      { property: "og:title", content: `Results — ${SITE_CONFIG.business.shortName}` },
      {
        property: "og:description",
        content: "Real soil grades before and after. Not opinions.",
      },
    ],
  }),
});

function ResultsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Results"
        title={
          <>
            Real <span className="text-ember">grade lifts</span>. Not opinions.
          </>
        }
        body="Every job ends with a 90-day re-read using the same soil source we started with. Here's what changed."
      />

      <PageSection>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SITE_CONFIG.content.lifts.map((l) => (
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
          {SITE_CONFIG.content.testimonials.map((q) => (
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
