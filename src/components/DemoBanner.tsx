import { BUSINESS } from "@/config/business";

/**
 * Slim banner shown when BUSINESS.isDemo is true.
 * Signals to prospects that this is a template they can buy & customize.
 */
export function DemoBanner() {
  if (!BUSINESS.isDemo) return null;
  return (
    <div
      role="note"
      aria-label="Demo template notice"
      className="relative z-40 w-full bg-ember/95 text-loam text-center text-[11px] font-mono uppercase tracking-[0.22em] py-2 px-4"
    >
      Demo template · This site could be yours.
    </div>
  );
}
