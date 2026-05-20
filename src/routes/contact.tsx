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
        content:
          "Call, email, or run the free soil diagnostic. Family-run lawn stewards in Meridian, MS.",
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
        <div className="grid gap-6 md:grid-cols-3">
          <ContactCard
            label="Phone"
            value={BUSINESS.phone}
            href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`}
          />
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
