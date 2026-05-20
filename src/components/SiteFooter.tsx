import { Link, useLocation } from "@tanstack/react-router";
import { BUSINESS } from "@/config/business";

const LINKS = [
  { to: "/diagnostic", label: "Diagnostic" },
  { to: "/services", label: "Services" },
  { to: "/process", label: "Process" },
  { to: "/results", label: "Results" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
] as const;

export function SiteFooter() {
  const { pathname } = useLocation();
  // Homepage has its own minimal in-canvas footer; skip rendering there.
  if (pathname === "/") return null;

  return (
    <footer className="relative z-10 mt-24 border-t border-bone/10 px-6 md:px-10 py-10">
      <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3 items-start">
        <div>
          <p className="font-display text-xl text-bone copy-shadow">
            {BUSINESS.shortName}
          </p>
          <p className="mt-2 text-sm text-bone/70 max-w-xs">
            {BUSINESS.tagline}
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="text-[12px] uppercase tracking-[0.18em] font-mono text-bone/70 hover:text-wheat transition"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="md:text-right text-sm text-bone/70 space-y-1">
          <p>{BUSINESS.phone}</p>
          <p>{BUSINESS.serviceArea}</p>
          <p className="text-[10px] font-mono text-bone/45 pt-2">
            Soil data · ISRIC SoilGrids
          </p>
        </div>
      </div>
    </footer>
  );
}
