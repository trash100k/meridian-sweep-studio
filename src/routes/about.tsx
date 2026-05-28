import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import { SITE_CONFIG } from "@/config/site";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: `About — ${SITE_CONFIG.business.shortName}` },
      {
        name: "description",
        content: `Family-run lawn stewards born and raised on ${SITE_CONFIG.content.localized.dirtName}. Honest pricing, real diagnostics.`,
      },
      { property: "og:title", content: `About — ${SITE_CONFIG.business.shortName}` },
      {
        property: "og:description",
        content: `Born and raised on ${SITE_CONFIG.content.localized.dirtName}. Family-run. Honest pricing.`,
      },
    ],
  }),
});

function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About"
        title={
          <>
            <span className="text-wheat italic">Stewards</span> of{" "}
            {SITE_CONFIG.content.localized.dirtName}.
          </>
        }
        body="A family-run crew that got tired of watching neighbors pay for fertilizer their soil couldn't absorb."
      />

      <PageSection>
        <div className="grid gap-12 md:grid-cols-2 items-start">
          <div className="space-y-5 text-bone/90 leading-relaxed">
            <p>
              {SITE_CONFIG.business.shortName} started because the answer to "why is my lawn dying?"
              in this part of{" "}
              {SITE_CONFIG.business.serviceArea.split(",")[1]?.trim() || "the state"} is almost
              never the answer the big chains give you. It's not your watering schedule. It's not
              your blade height. It's the {SITE_CONFIG.content.localized.soilType} sitting six
              inches under the grass, packed so tight rain runs off before it ever reaches a root.
            </p>
            <p>
              We're a small crew. We read soil before we touch it. We tell you when you don't need
              anything done. And when you do, the bill matches the work — no upsell, no contract
              lock-ins.
            </p>
            <p className="font-display text-2xl text-bone copy-shadow pt-2">
              {SITE_CONFIG.business.tagline}
            </p>
          </div>

          <aside className="rounded-2xl border border-bone/10 bg-loam/40 p-7 backdrop-blur-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember mb-4 copy-shadow">
              Service area
            </p>
            <p className="font-display text-3xl text-bone copy-shadow">
              {SITE_CONFIG.business.serviceArea}
            </p>
            <p className="mt-5 text-sm text-bone/70 mb-3">Zip codes we currently steward:</p>
            <ul className="flex flex-wrap gap-2">
              {SITE_CONFIG.business.zipCodes.map((z) => (
                <li
                  key={z}
                  className="font-mono text-[12px] text-bone/85 border border-bone/15 rounded-full px-3 py-1"
                >
                  {z}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[12px] text-bone/55 leading-relaxed">
              Not on the list? Run the diagnostic anyway — we'll tell you if we can reach you.
            </p>
          </aside>
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/diagnostic" className="liquid-pill">
            Read my soil →
          </Link>
        </div>
      </PageSection>

      <CallBand
        headline="Talk to the family who'll actually be on your yard."
        sub="No call center, no offshore intake form. Pick up the phone and you'll get one of us — usually same day."
      />
    </PageShell>
  );
}
