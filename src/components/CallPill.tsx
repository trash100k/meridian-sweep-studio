import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { SITE_CONFIG } from "@/config/site";

const SPRING = "cubic-bezier(0.22, 1, 0.36, 1)";
const telHref = `tel:${SITE_CONFIG.business.phone.replace(/[^\d+]/g, "")}`;

/**
 * Persistent glass "Call" pill, fixed bottom-right.
 * Hidden during the very first frames of the homepage cinema so it doesn't
 * compete with Act I, then fades in for the rest of the journey.
 */
export function CallPill() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    setScrolled(false);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, pathname]);

  const visible = !isHome || scrolled;

  return (
    <a
      href={telHref}
      aria-label={`Call ${SITE_CONFIG.business.shortName} at ${SITE_CONFIG.business.phone}`}
      className="call-pill group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-loam"
      style={{
        position: "fixed",
        right: "max(1rem, env(safe-area-inset-right))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
        zIndex: 60,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 320ms ${SPRING}, transform 320ms ${SPRING}`,
        pointerEvents: visible ? "auto" : "none",
        minHeight: 44,
        minWidth: 44,
      }}
    >
      <span aria-hidden className="call-pill__icon">
        <PhoneIcon />
      </span>
      <span className="call-pill__label">
        <span className="call-pill__eyebrow">Call</span>
        <span className="call-pill__number">{SITE_CONFIG.business.phone}</span>
      </span>
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
