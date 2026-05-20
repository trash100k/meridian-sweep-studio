import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
          backgroundColor:
            !isHome && scrolled ? "rgba(8,4,12,0.55)" : "rgba(8,4,12,0.18)",
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
            {BUSINESS.shortName}
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-[12px] uppercase tracking-[0.18em] font-mono text-bone/75 hover:text-bone transition copy-shadow"
                  activeProps={{ className: "text-wheat" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-[11px] uppercase tracking-[0.2em] font-mono text-bone/85 copy-shadow"
          >
            {open ? "Close" : "Menu"}
          </button>
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
        </ul>
      </div>
    </>
  );
}
