import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BUSINESS } from "@/config/business";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: `FAQ — ${BUSINESS.shortName}` },
      {
        name: "description",
        content: `Answers about lawn care, landscaping, hardscaping, stone masonry, lighting, pricing, and scheduling in ${BUSINESS.serviceArea}.`,
      },
      { property: "og:title", content: `FAQ — ${BUSINESS.shortName}` },
      {
        property: "og:description",
        content: "Common questions about our services, pricing, and scheduling.",
      },
    ],
  }),
});

const FAQS = [
  {
    q: "What services do you offer?",
    a: "Weekly lawn maintenance, landscape design and planting, hardscaping (patios, walkways, retaining walls, fire pits), hand-laid stone masonry, and low-voltage outdoor lighting. We also offer a free soil diagnostic when a lawn isn't taking.",
  },
  {
    q: "Where do you work?",
    a: `${BUSINESS.serviceArea} and about 25 miles out — ${BUSINESS.nearbyTowns.join(", ")}, and the surrounding communities. Call us even if you're a little outside; we go further some weeks.`,
  },
  {
    q: "Do I need to sign a long-term contract for weekly lawn care?",
    a: "No long-term contracts. Most clients book seasonally and renew because they want to, not because they're locked in. Cancel any time with a week's notice.",
  },
  {
    q: "How do you price hardscaping and masonry?",
    a: "By the project, after a walkthrough. We take measurements, look at the material you want, and send a written estimate with clear line items. No verbal-only handshake numbers.",
  },
  {
    q: "How long does a patio or wall take?",
    a: "Most patios run 3–6 working days. Retaining walls depend on length and height — figure a week for a standard residential wall. We'll give you a real timeline before you sign.",
  },
  {
    q: "Are you licensed and insured?",
    a: `Yes — fully licensed in ${BUSINESS.state} and carrying general liability + workers' comp. Documentation provided before any on-site work.`,
  },
  {
    q: "Do you guarantee plantings?",
    a: "Yes. New plantings come with a 30-day check-back, and we replace anything that didn't root for free if you watered as instructed.",
  },
  {
    q: "What's the free soil diagnostic?",
    a: "A 60-second address-level read of your soil — clay percentage, compaction, and a written plan. Useful when grass keeps dying no matter what you do. Free, no obligation.",
  },
  {
    q: "Who's actually going to show up?",
    a: `${BUSINESS.owner} is on most jobs personally, with our small in-house crew. No rotating subs, no surprises.`,
  },
];

function FaqPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="FAQ"
        title={<>Questions <span className="text-ember">we hear most.</span></>}
        body={`Don't see yours? Call or text ${BUSINESS.owner} — a real person answers within one business day.`}
      />

      <PageSection>
        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-bone/10">
              <AccordionTrigger className="text-left font-display text-xl text-bone hover:text-wheat copy-shadow">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-bone/85 text-base leading-relaxed pb-6">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link to="/contact" className="liquid-pill">
            Ask a question →
          </Link>
          <Link to="/services" className="liquid-pill">
            See services →
          </Link>
        </div>
      </PageSection>

      <CallBand
        headline="Still have questions? We pick up the phone."
        sub="One business day, every time. Real person, real answers — not a chatbot pretending to schedule."
      />
    </PageShell>
  );
}
