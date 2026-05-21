import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import { SITE_CONFIG } from "@/config/site";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: `Services — ${SITE_CONFIG.business.shortName}` },
      {
        name: "description",
        content: `Soil diagnostics, core aeration, deep soil restoration, and drainage engineering for ${SITE_CONFIG.business.serviceArea} lawns.`,
      },
      { property: "og:title", content: `Services — ${SITE_CONFIG.business.shortName}` },
      {
        property: "og:description",
        content: "Four ways we get water and air back to your roots.",
      },
    ],
  }),
});

function ServicesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Four ways we get <span className="text-ember">water and air</span> back to your roots.
          </>
        }
        body="Every service starts with the free diagnostic. We won't sell you aeration if the soil doesn't need it."
      />

      <PageSection>
        <div className="grid gap-6 md:grid-cols-2">
          {SITE_CONFIG.content.services.map((s) => (
            <article
              key={s.name}
              className="rounded-2xl border border-bone/10 bg-loam/40 p-7 backdrop-blur-sm"
            >
              <h2 className="font-display text-3xl text-bone copy-shadow">{s.name}</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <Row label="Solves" value={s.solves} />
                <Row label="Includes" value={s.includes} />
                <Row label="When" value={s.when} />
              </dl>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/diagnostic" className="liquid-pill">
            Start with the free diagnostic →
          </Link>
        </div>
      </PageSection>

      <CallBand
        headline="Not sure which service your yard needs?"
        sub="One short call and we'll tell you straight — no quote pressure, no auto-renew contracts. If the soil doesn't need it, we say so."
      />
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-20 shrink-0 text-[10px] uppercase tracking-[0.2em] font-mono text-bone/55 pt-1">
        {label}
      </dt>
      <dd className="text-bone/90 leading-relaxed">{value}</dd>
    </div>
  );
}
