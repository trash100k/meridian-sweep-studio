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
          "How we work: free walkthrough, written estimate, hands-on build by our own crew, and a check-back after the job.",
      },
      { property: "og:title", content: `Our Process — ${BUSINESS.shortName}` },
      {
        property: "og:description",
        content: "Call. Walk. Quote. Build. Check back.",
      },
    ],
  }),
});

const STEPS = [
  {
    n: "01",
    title: "Call",
    body: "You call or text. Richard answers — usually same day. We talk through what you want done and whether we're the right fit.",
  },
  {
    n: "02",
    title: "Walk",
    body: "We come to your yard, take measurements, listen to what you want, and look at anything tricky — drainage, slope, access, existing plantings.",
  },
  {
    n: "03",
    title: "Quote",
    body: "You get a written estimate with clear line items. No verbal-only handshake numbers, no surprise add-ons after the job starts.",
  },
  {
    n: "04",
    title: "Build",
    body: "Our own crew does the work. Richard is on most jobs. Daily cleanup, respect for your property, and the timeline we promised.",
  },
  {
    n: "05",
    title: "Check back",
    body: "We swing by after the job to make sure everything settled right — plantings rooted, pavers level, lighting still aimed. Fix anything that isn't.",
  },
];

function ProcessPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Process"
        title={<>How we work, <span className="text-ember">from first call to follow-up.</span></>}
        body="Five steps, every job — whether it's weekly mowing or a hand-laid stone wall."
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
          <Link to="/contact" className="liquid-pill">
            Start with step 01 →
          </Link>
        </div>
      </PageSection>

      <CallBand
        headline="Ready for the walkthrough?"
        sub={`Call ${BUSINESS.owner} and we'll set a time this week — Meridian + 25 miles, no obligation.`}
      />
    </PageShell>
  );
}
