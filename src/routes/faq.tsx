import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SITE_CONFIG } from "@/config/site";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: `FAQ — ${SITE_CONFIG.business.shortName}` },
      {
        name: "description",
        content: `Answers about ${SITE_CONFIG.content.localized.soilType}, aeration, pricing, scheduling, and what to expect from a soil diagnostic in ${SITE_CONFIG.business.serviceArea}.`,
      },
      { property: "og:title", content: `FAQ — ${SITE_CONFIG.business.shortName}` },
      {
        property: "og:description",
        content: "Common questions about soil, lawns, and our work.",
      },
    ],
  }),
});

function FaqPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Questions <span className="text-ember">we hear most.</span>
          </>
        }
        body="Don't see yours? Call or text and a real person will answer within one business day."
      />

      <PageSection>
        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {SITE_CONFIG.content.faqs.map((f, i) => (
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

        <div className="mt-12 flex justify-center">
          <Link to="/diagnostic" className="liquid-pill">
            Run the diagnostic →
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
