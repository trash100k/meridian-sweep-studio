import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import { BUSINESS } from "@/config/business";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: `Services — ${BUSINESS.shortName}` },
      {
        name: "description",
        content:
          "Soil diagnostics, core aeration, deep soil restoration, and drainage engineering for Meridian, MS lawns.",
      },
      { property: "og:title", content: `Services — ${BUSINESS.shortName}` },
      {
        property: "og:description",
        content: "Four ways we get water and air back to your roots.",
      },
    ],
  }),
});

const SERVICES = [
  {
    name: "Soil Diagnostic",
    solves: "Not knowing what's actually wrong.",
    includes: "Address-level soil read, compaction grade, written plan. Free.",
    when: "Always start here.",
  },
  {
    name: "Core Aeration",
    solves: "Surface runoff and shallow roots.",
    includes: "3-inch plugs across the full lot, debris cleared, overseed-ready.",
    when: "Early fall or early spring.",
  },
  {
    name: "Deep Soil Restoration",
    solves: "Severe clay compaction (Grade D / F).",
    includes: "Vertical fracturing, gypsum + organic matter injection, follow-up read at 90 days.",
    when: "Once. Maintenance after.",
  },
  {
    name: "Drainage Engineering",
    solves: "Standing water, sloped runoff into the wrong place.",
    includes: "Site survey, French drain or swale design, build, and verification.",
    when: "Before the next big rain.",
  },
];

function ServicesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Services"
        title={<>Four ways we get <span className="text-ember">water and air</span> back to your roots.</>}
        body="Every service starts with the free diagnostic. We won't sell you aeration if the soil doesn't need it."
      />

      <PageSection>
        <div className="grid gap-6 md:grid-cols-2">
          {SERVICES.map((s) => (
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
