import { Link } from "@tanstack/react-router";
import { SITE_CONFIG } from "@/config/site";

const telHref = `tel:${SITE_CONFIG.business.phone.replace(/[^\d+]/g, "")}`;

/**
 * Inline CTA panel used near the bottom of every content sub-page.
 * Page-specific copy gives each band a distinct reason to call.
 */
export function CallBand({
  headline,
  sub,
  primaryLabel = `Call ${SITE_CONFIG.business.phone}`,
  secondaryLabel = "Run free diagnostic →",
}: {
  headline: string;
  sub?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="px-6 md:px-10 py-12" aria-labelledby="callband-heading">
      <div
        className="mx-auto max-w-5xl rounded-2xl border-l-4 border-ember bg-loam/50 backdrop-blur-md p-7 md:p-10"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(58,29,58,0.55) 0%, rgba(8,4,12,0.65) 100%)",
          boxShadow: "0 20px 60px -30px rgba(255,140,80,0.35)",
        }}
      >
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ember mb-3 copy-shadow">
              Talk to a real steward
            </p>
            <h2
              id="callband-heading"
              className="font-display text-2xl md:text-3xl text-bone leading-snug copy-shadow"
            >
              {headline}
            </h2>
            {sub && <p className="mt-3 text-sm md:text-base text-bone/85 max-w-xl">{sub}</p>}
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:items-end">
            <a
              href={telHref}
              aria-label={`Call ${SITE_CONFIG.business.shortName} at ${SITE_CONFIG.business.phone}`}
              className="liquid-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-loam whitespace-nowrap"
              style={{ minHeight: 44 }}
            >
              <span aria-hidden>📞</span>
              <span>{primaryLabel}</span>
            </a>
            <Link
              to="/diagnostic"
              className="text-[12px] uppercase tracking-[0.22em] font-mono text-bone/80 hover:text-wheat transition copy-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded px-2 py-2"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
