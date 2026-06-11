import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { LiquidGlassCard } from "@/components/LiquidGlassCard";
import { DiagnosticEngine } from "@/components/DiagnosticEngine";
import { BUSINESS } from "@/config/business";

export const Route = createFileRoute("/diagnostic")({
  component: DiagnosticPage,
  head: () => ({
    meta: [
      { title: `Free Lawn Soil Diagnostic — ${BUSINESS.shortName}` },
      {
        name: "description",
        content:
          `Free 20-second soil diagnostic for ${BUSINESS.serviceArea} lawns. Real soil data, no call required, no spam.`,
      },
      { property: "og:title", content: `Free Soil Diagnostic — ${BUSINESS.shortName}` },
      {
        property: "og:description",
        content: "Find out what's actually under your grass before you spend another dollar.",
      },
    ],
  }),
});

function DiagnosticPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Silent Siphon"
        title={<>Free <span className="text-ember">60-second</span> soil diagnostic.</>}
        body="No call required. Pull real soil data for your address — clay percentage, bulk density, compaction grade — before you spend another dollar on fertilizer that can't reach the roots."
      />

      <PageSection>
        <div className="mx-auto max-w-lg">
          <LiquidGlassCard reveal={1}>
            <DiagnosticEngine />
          </LiquidGlassCard>

          <p className="mt-8 text-center text-[11px] font-mono text-bone/65 copy-shadow">
            Used by neighbors across {BUSINESS.serviceArea} · Soil data from ISRIC SoilGrids · Your address is never shared.
          </p>
        </div>
      </PageSection>
    </PageShell>
  );
}
