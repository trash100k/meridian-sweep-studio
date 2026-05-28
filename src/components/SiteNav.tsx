import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SITE_CONFIG } from "@/config/site";

const LINKS = [
  { to: "/diagnostic", label: "Diagnostic" },
  { to: "/services", label: "Services" },
  { to: "/process", label: "Process" },
  { to: "/results", label: "Results" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
] as const;

const SPRING = "cubic-bezier(0.22, 1, 0.36, 1)";

export function SiteNav() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [hovered, setHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Top-of-viewport mouse reveal on home
  useEffect(() => {
    if (!isHome) return;
    const onMove = (e: MouseEvent) => setHovered(e.clientY < 80);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isHome]);

  // Scroll-aware reveal on sub-pages (just for the subtle glass tint)
  useEffect(() => {
    if (isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const visible = !isHome || hovered || open;

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 top-0 z-50"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: `transform 320ms ${SPRING}, background-color 240ms ease`,
          backgroundColor: !isHome && scrolled ? "rgba(8,4,12,0.55)" : "rgba(8,4,12,0.18)",
          backdropFilter: "blur(18px) saturate(160%)",
          WebkitBackdropFilter: "blur(18px) saturate(160%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        onMouseEnter={() => isHome && setHovered(true)}
        onMouseLeave={() => isHome && setHovered(false)}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 md:px-10">
          <Link
            to="/"
            className="font-display text-lg text-bone tracking-wide hover:text-wheat transition copy-shadow"
          >
            {SITE_CONFIG.business.shortName}
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-[12px] uppercase tracking-[0.18em] font-mono text-bone/75 hover:text-bone transition copy-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded px-1 py-2"
                  activeProps={{ className: "text-wheat" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={`tel:${SITE_CONFIG.business.phone.replace(/[^\d+]/g, "")}`}
                aria-label={`Call ${SITE_CONFIG.business.phone}`}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] font-mono text-ember hover:text-wheat transition copy-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded px-2 py-2"
                style={{ minHeight: 36 }}
              >
                <span aria-hidden>📞</span>
                <span className="tracking-normal normal-case">{SITE_CONFIG.business.phone}</span>
              </a>
            </li>
          </ul>

          {/* Mobile: phone + menu */}
          <div className="md:hidden flex items-center gap-3">
            <a
              href={`tel:${SITE_CONFIG.business.phone.replace(/[^\d+]/g, "")}`}
              aria-label={`Call ${SITE_CONFIG.business.phone}`}
              className="inline-flex items-center justify-center rounded-full bg-ember/25 border border-ember/40 text-bone copy-shadow"
              style={{ minHeight: 44, minWidth: 44 }}
            >
              <span aria-hidden>📞</span>
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="text-[11px] uppercase tracking-[0.2em] font-mono text-bone/85 copy-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded px-2"
              style={{ minHeight: 44, minWidth: 44 }}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        aria-hidden={!open}
        className="md:hidden fixed inset-0 z-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,4,12,0.96) 0%, rgba(26,18,56,0.96) 50%, rgba(58,29,58,0.96) 100%)",
          backdropFilter: "blur(8px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: `opacity 280ms ${SPRING}`,
        }}
      >
        <ul className="flex h-full flex-col items-center justify-center gap-6 px-6">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="font-display text-4xl text-bone hover:text-wheat transition copy-shadow"
                activeProps={{ className: "text-wheat italic" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-6 border-t border-bone/15 w-2/3 text-center mt-4">
            <a
              href={`tel:${SITE_CONFIG.business.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex flex-col items-center gap-1"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ember">
                Call us
              </span>
              <span className="font-display text-3xl text-bone copy-shadow">
                {SITE_CONFIG.business.phone}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
