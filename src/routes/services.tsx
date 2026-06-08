import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import { BUSINESS } from "@/config/business";
import { PHOTOS } from "@/config/photos";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: `Services — ${BUSINESS.shortName}` },
      {
        name: "description",
        content:
          "Lawn maintenance, landscape design, hardscaping, stone masonry, outdoor lighting, and free soil diagnostics across Meridian, MS.",
      },
      { property: "og:title", content: `Services — ${BUSINESS.shortName}` },
      {
        property: "og:description",
        content: "Full-service landscaping, masonry, and outdoor living in Meridian, MS.",
      },
      { property: "og:image", content: PHOTOS.stripedLawn },
      { name: "twitter:image", content: PHOTOS.stripedLawn },
    ],
  }),
});

const SERVICES = [
  {
    name: "Lawn Maintenance",
    photo: PHOTOS.stripedLawn,
    solves: "A yard that always looks tended, never overgrown.",
    includes: "Weekly or biweekly mowing, edging, blowing, seasonal cleanups, and shrub trimming.",
    when: "Year-round. Most clients sign on for the season.",
  },
  {
    name: "Landscape Design & Planting",
    photo: PHOTOS.flowerBed,
    solves: "Front yards that look like nobody's home, or beds that never grew in.",
    includes: "Site walk, plant plan, soil prep, install, and a 30-day check-back.",
    when: "Spring and fall are best for new plantings.",
  },
  {
    name: "Hardscaping",
    photo: PHOTOS.flagstonePatio,
    solves: "Muddy paths, unusable slopes, no real outdoor space to enjoy.",
    includes: "Patios, walkways, retaining walls, fire pits, and outdoor kitchens. Paver or natural stone.",
    when: "Any season — we build year-round when weather allows.",
  },
  {
    name: "Stone Masonry",
    photo: PHOTOS.stoneWalkway,
    solves: "Wanting craftsmanship that lasts decades, not seasons.",
    includes: "Hand-laid stone walls, pillars, veneer, chimneys, and custom features.",
    when: "Booked by quote. Most jobs scheduled 2–4 weeks out.",
  },
  {
    name: "Outdoor Lighting",
    photo: PHOTOS.flagstonePatio,
    solves: "A yard that disappears at sunset, or unsafe walkways at night.",
    includes: "Path lights, uplighting on trees and architecture, low-voltage LED systems, install + warranty.",
    when: "Often paired with a hardscape or planting project.",
  },
  {
    name: "Free Soil Diagnostic",
    photo: PHOTOS.dryCreek,
    solves: "Lawns that won't take, no matter how much you water or fertilize.",
    includes: "Address-level soil read, compaction grade, and a written plan. No obligation.",
    when: "Always free. Start here if the grass keeps dying.",
  },
];

function ServicesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Services"
        title={<>Everything your yard needs, from <span className="text-ember">one family-run crew.</span></>}
        body={`${BUSINESS.shortName} handles weekly lawn care, landscape design, hardscaping, stone masonry, and outdoor lighting across ${BUSINESS.serviceArea} and the surrounding 25 miles.`}
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

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link to="/contact" className="liquid-pill">
            Request a quote →
          </Link>
          <Link to="/diagnostic" className="liquid-pill">
            Or run the free diagnostic →
          </Link>
        </div>
      </PageSection>

      <CallBand
        headline="Not sure which service you need?"
        sub={`Call Richard and tell him about your yard. One short conversation, an honest recommendation — no pressure, no auto-renew contracts.`}
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
