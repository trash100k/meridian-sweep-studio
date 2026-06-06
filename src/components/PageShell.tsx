import type { ReactNode } from "react";

/**
 * Static dusk gradient background shared by all sub-pages.
 * No canvas animation — instant paint, matches the homepage palette.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen w-full"
      style={{
        background:
          "linear-gradient(180deg, #0a0420 0%, #1a1238 22%, #3a1d3a 55%, #5a2b18 80%, #08030f 100%)",
        color: "var(--bone)",
      }}
    >
      {/* Subtle ember bloom from the right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 85% 20%, rgba(255,170,90,0.18), transparent 70%)",
        }}
      />
      <main className="relative z-10 pt-24">{children}</main>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <section className="px-6 md:px-10 pb-12">
      <div
        className={`mx-auto max-w-4xl readability-scrim ${
          centered ? "text-center" : ""
        }`}
      >
        {/* Tier 1 — eyebrow with flanking ember hairlines */}
        <div
          className={`flex items-center gap-4 mb-6 ${
            centered ? "justify-center" : ""
          }`}
        >
          <span aria-hidden className="eyebrow-rule" />
          <span className="eyebrow copy-shadow">{eyebrow}</span>
          <span aria-hidden className="eyebrow-rule" />
        </div>

        {/* Tier 2 — display serif headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-balance leading-[1.02] tracking-tight text-bone copy-shadow">
          {title}
        </h1>

        {/* Tier 3 — italic serif support line */}
        {body && (
          <p
            className={`support-line copy-shadow mt-8 max-w-2xl text-balance ${
              centered ? "mx-auto" : ""
            }`}
          >
            {body}
          </p>
        )}
      </div>
    </section>
  );
}

export function PageSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`px-6 md:px-10 py-12 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
