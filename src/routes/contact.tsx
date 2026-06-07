import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { BUSINESS } from "@/config/business";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: `Contact — ${BUSINESS.shortName}` },
      {
        name: "description",
        content: `Call, email, or send a note. ${BUSINESS.name} — owned by ${BUSINESS.owner} in ${BUSINESS.serviceArea}. ${BUSINESS.phone}.`,
      },
      { property: "og:title", content: `Contact — ${BUSINESS.shortName}` },
      {
        property: "og:description",
        content: "Real people. One business day. No automated systems.",
      },
    ],
  }),
});

function ContactPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title={<>Real people. <span className="text-ember">One business day.</span></>}
        body="Call, email, or run the diagnostic and we'll come to you. No automated systems, no offshore call center."
      />

      <PageSection>
        <a
          href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`}
          aria-label={`Call ${BUSINESS.shortName} at ${BUSINESS.phone}`}
          className="block rounded-2xl border border-ember/40 p-8 md:p-10 backdrop-blur-md transition hover:border-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255,140,80,0.18) 0%, rgba(58,29,58,0.55) 60%, rgba(8,4,12,0.65) 100%)",
            boxShadow: "0 24px 60px -30px rgba(255,140,80,0.45)",
          }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember copy-shadow">
            Call us · fastest path
          </p>
          <p className="mt-3 font-display text-4xl md:text-6xl text-bone copy-shadow">
            {BUSINESS.phone}
          </p>
          <p className="mt-3 text-sm md:text-base text-bone/90">
            Answered by a real person. One business day, no automated systems.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-[0.18em]">
            {["Free yard walk", "No contracts", "Meridian + 25 mi"].map((c) => (
              <li
                key={c}
                className="rounded-full border border-bone/20 px-3 py-1 text-bone/85"
              >
                {c}
              </li>
            ))}
          </ul>
        </a>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <ContactCard label="Email" value={BUSINESS.email} href={`mailto:${BUSINESS.email}`} />
          <ContactCard label="Service area" value={BUSINESS.serviceArea} />
        </div>

        <form
          action={`mailto:${BUSINESS.email}`}
          method="post"
          encType="text/plain"
          className="mt-12 mx-auto max-w-xl rounded-2xl border border-bone/10 bg-loam/40 p-8 backdrop-blur-sm space-y-5"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember copy-shadow">
            Send a note
          </p>
          <h2 className="font-display text-3xl text-bone copy-shadow">Tell us about your yard.</h2>

          <input
            required
            name="name"
            autoComplete="name"
            placeholder="Your name"
            className="liquid-input"
            aria-label="Your name"
          />
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            className="liquid-input"
            aria-label="Email"
          />
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Phone (optional)"
            className="liquid-input"
            aria-label="Phone"
          />
          <textarea
            required
            name="message"
            rows={4}
            placeholder="What's going on with your lawn?"
            className="liquid-input resize-none"
            aria-label="Message"
          />
          <div className="flex justify-end">
            <button type="submit" className="liquid-pill">
              Send →
            </button>
          </div>
        </form>
      </PageSection>
    </PageShell>
  );
}

function ContactCard({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/55">{label}</p>
      <p className="mt-3 font-display text-2xl text-bone copy-shadow">{value}</p>
    </>
  );
  const cls = "block rounded-2xl border border-bone/10 bg-loam/40 p-6 backdrop-blur-sm transition hover:border-ember/40";
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
