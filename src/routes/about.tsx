import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import { BUSINESS } from "@/config/business";
import { PHOTOS } from "@/config/photos";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: `About — ${BUSINESS.shortName}` },
      {
        name: "description",
        content: `Family-run landscaping and stone masonry in Meridian, MS. Owned and operated by ${BUSINESS.owner}. 4.5 stars on Google.`,
      },
      { property: "og:title", content: `About — ${BUSINESS.shortName}` },
      {
        property: "og:description",
        content: `Meet ${BUSINESS.owner} and the family crew behind ${BUSINESS.shortName}.`,
      },
    ],
  }),
});

const ZIPS = ["39301", "39305", "39307", "39309", "39320"];

function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About"
        title={<>A <span className="text-wheat italic">family crew</span>, rooted in Meridian.</>}
        body={`${BUSINESS.name} is owned and run by ${BUSINESS.owner} — a small team that treats every yard like it's our own.`}
      />

      <PageSection>
        <div className="grid gap-12 md:grid-cols-2 items-start">
          <div className="space-y-5 text-bone/90 leading-relaxed">
            <p>
              {BUSINESS.shortName} is run by {BUSINESS.owner} — born and raised in
              Meridian, working these yards for the better part of his life. What started as
              weekend mowing for neighbors grew into a full landscaping, masonry, and lawn
              care company that's now trusted by 30+ families across the area.
            </p>
            <p>
              We're small on purpose. Richard answers the phone. The crew you meet on the
              first walk is the crew that does the work. No call centers, no rotating
              subcontractors, no surprise upcharges in the final bill.
            </p>
            <p>
              We do it all — weekly lawn care, landscape design, paver patios, retaining
              walls, hand-laid stonework, and low-voltage lighting. And when something
              doesn't grow right, we read the soil before we sell you anything.
            </p>
            <p className="font-display text-2xl text-bone copy-shadow pt-2">
              {BUSINESS.tagline}
            </p>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-bone/10 bg-loam/40 backdrop-blur-sm overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={PHOTOS.richard}
                  alt={`${BUSINESS.owner}, owner of ${BUSINESS.shortName}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember mb-3 copy-shadow">
                  Owner
                </p>
                <p className="font-display text-3xl text-bone copy-shadow">
                  {BUSINESS.owner}
                </p>
                <p className="mt-3 text-sm text-bone/80 leading-relaxed">
                  Hands-on owner. On nearly every job. Reachable by phone, day-of.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-bone/10 bg-loam/40 p-7 backdrop-blur-sm">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember mb-4 copy-shadow">
                Service area
              </p>
              <p className="font-display text-3xl text-bone copy-shadow">
                {BUSINESS.serviceArea}
              </p>
              <p className="mt-5 text-sm text-bone/70 mb-3">Zip codes we currently serve:</p>
              <ul className="flex flex-wrap gap-2">
                {ZIPS.map((z) => (
                  <li
                    key={z}
                    className="font-mono text-[12px] text-bone/85 border border-bone/15 rounded-full px-3 py-1"
                  >
                    {z}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[12px] text-bone/55 leading-relaxed">
                Not on the list? Call us anyway — we go about 25 miles out depending on the week.
              </p>
            </div>

            <div className="rounded-2xl border border-bone/10 bg-loam/40 p-7 backdrop-blur-sm">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember mb-4 copy-shadow">
                Reputation
              </p>
              <p className="font-display text-3xl text-bone copy-shadow">
                ★ {BUSINESS.rating.stars} <span className="text-bone/55 text-xl">({BUSINESS.rating.count} Google reviews)</span>
              </p>
              <p className="mt-3 text-sm text-bone/80 leading-relaxed">
                Plus 5.0 across 16 Facebook reviews. Most of our work comes from word of mouth.
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-bone/10 bg-loam/30 backdrop-blur-sm">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={PHOTOS.truck}
              alt="R & C Landscaping work truck and trailer"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <p className="px-6 py-4 text-sm text-bone/80 text-center">
            The rig you'll see in your driveway — same truck, same crew, every visit.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link to="/services" className="liquid-pill">
            See our services →
          </Link>
          <Link to="/contact" className="liquid-pill">
            Talk to Richard →
          </Link>
        </div>
      </PageSection>

      <CallBand
        headline="Talk to Richard directly."
        sub="No call center, no offshore intake form. Pick up the phone and you'll get the owner — usually same day."
      />
    </PageShell>
  );
}
