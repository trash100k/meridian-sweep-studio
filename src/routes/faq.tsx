import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
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
        content:
          "Answers about red clay, aeration, pricing, scheduling, and what to expect from a soil diagnostic in Meridian, MS.",
      },
      { property: "og:title", content: `FAQ — ${BUSINESS.shortName}` },
      {
        property: "og:description",
        content: "Common questions about soil, lawns, and our work.",
      },
    ],
  }),
});

const FAQS = [
  {
    q: "Why is the diagnostic free?",
    a: "Because most lawns in Meridian don't need what they're being sold. The diagnostic tells us — and you — whether the soil is actually the problem. If it's not, we save you a service call. If it is, you know exactly why.",
  },
  {
    q: "What's actually wrong with red clay?",
    a: "Compacted clay sheds water like a tarp. Your sprinkler runs, the surface gets wet, and the water runs off before it ever reaches a root. Roots stay shallow, the grass dries out from underneath, and you blame the weather.",
  },
  {
    q: "How accurate is a 60-second diagnostic?",
    a: "We pull real soil composition data from ISRIC SoilGrids for your specific address — clay percentage, sand percentage, bulk density at 0–30cm. It's the same source agronomists use. We confirm with an on-site walk before any work.",
  },
  {
    q: "What does aeration cost?",
    a: "Pricing depends on lot size and grade. A typical 1/4-acre lot with a Grade C reads as $180–$280 for core aeration. We give you a written quote after the diagnostic — no obligation.",
  },
  {
    q: "When should I schedule?",
    a: "Early fall (September–October) and early spring (March) are the windows where aeration does the most good. Drainage work happens any time the ground isn't frozen. The diagnostic itself you can run right now.",
  },
  {
    q: "Do you do mowing, edging, or general landscaping?",
    a: "No. We do soil work — diagnostics, aeration, deep restoration, drainage. We'll happily refer you to good local crews for the weekly stuff.",
  },
  {
    q: "What if my zip isn't in your service area?",
    a: "Run the diagnostic anyway. We sometimes reach further depending on the week, and we'll always tell you up front if we can't.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes — fully licensed in Mississippi and carrying general liability + workers' comp. Documentation provided before any on-site work.",
  },
];

function FaqPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="FAQ"
        title={<>Questions <span className="text-ember">we hear most.</span></>}
        body="Don't see yours? Call or text and a real person will answer within one business day."
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

        <div className="mt-12 flex justify-center">
          <Link to="/diagnostic" className="liquid-pill">
            Run the diagnostic →
          </Link>
        </div>
      </PageSection>
    </PageShell>
  );
}
