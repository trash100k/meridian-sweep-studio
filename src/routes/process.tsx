import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import { SITE_CONFIG } from "@/config/site";

export const Route = createFileRoute("/process")({
  component: ProcessPage,
  head: () => ({
    meta: [
      { title: `Our Process — ${SITE_CONFIG.business.shortName}` },
      {
        name: "description",
        content: `Four steps from a free soil diagnostic to a lawn that holds the rain it's given. ${SITE_CONFIG.business.serviceArea}.`,
      },
      { property: "og:title", content: `Our Process — ${SITE_CONFIG.business.shortName}` },
      {
        property: "og:description",
        content: "Diagnose. Map. Restore. Steward.",
      },
    ],
  }),
});

function ProcessPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Process"
        title={
          <>
            How we work the <span className="text-ember">six inches</span> nobody else looks at.
          </>
        }
        body="Four steps, in order, every time. Skip any of them and you're just guessing."
      />

      <PageSection>
        <ol className="space-y-12 md:space-y-20">
          {SITE_CONFIG.content.process.map((s, i) => (
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
                  <span className="font-display text-7xl md:text-9xl text-bone/15">{s.n}</span>
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
        sub={`Steps 02 through 04 start on-site. Call and we'll set a time this week — ${SITE_CONFIG.business.serviceArea.split(",")[0]} + 25 miles, no obligation.`}
      />
    </PageShell>
  );
}
