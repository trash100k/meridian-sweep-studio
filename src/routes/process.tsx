import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero, PageSection } from "@/components/PageShell";
import { CallBand } from "@/components/CallBand";
import { BUSINESS } from "@/config/business";

export const Route = createFileRoute("/process")({
  component: ProcessPage,
  head: () => ({
    meta: [
      { title: `Our Process — ${BUSINESS.shortName}` },
      {
        name: "description",
        content:
          "How we work: from the first phone call through walkthrough, written estimate, hands-on build, and a check-back after the job.",
      },
      { property: "og:title", content: `Our Process — ${BUSINESS.shortName}` },
      {
        property: "og:description",
        content: "Call. Walk. Qu