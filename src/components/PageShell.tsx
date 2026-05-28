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
          background: "radial-gradient(60% 40% at 85% 20%, rgba(255,170,90,0.18), transparent 70%)",
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
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
}) {
  return (
    <section className="px-6 md:px-10 pb-12">
      <div className="mx-auto max-w-4xl readability-scrim">
        <p className="text-[11px] uppercase tracking-[0.3em] text-ember mb-4 font-mono copy-shadow">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-balance leading-[1.04] text-bone copy-shadow">
          {title}
        </h1>
        {body && (
          <p className="mt-6 text-base md:text-xl text-bone/90 max-w-2xl text-balance copy-shadow">
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
