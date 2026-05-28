/**
 * This file is the single source of truth for the site configuration.
 * It is designed to be easily modified by human operators or AI agents to spin up clones
 * for different landscaping businesses across different regions.
 */

export interface ThemeConfig {
  /** Deep loam black - primary background */
  loam: string;
  /** Soil shadow */
  soil: string;
  /** Ember orange - primary accent and highlight color */
  ember: string;
  /** Wheat highlight - secondary accent color */
  wheat: string;
  /** Off-white - primary text and foreground color */
  bone: string;
}

export interface BusinessConfig {
  /** Full legal or display name of the business */
  name: string;
  /** Shorter name used in UI elements like headers and buttons */
  shortName: string;
  /** The primary city and state serviced (e.g. "Meridian, MS") */
  serviceArea: string;
  /** List of zip codes the business actively services */
  zipCodes: string[];
  /** Primary contact phone number */
  phone: string;
  /** Primary contact email address */
  email: string;
  /** The main catchphrase or tagline for the business */
  tagline: string;
}

export interface LocalizedTerminology {
  /** The primary problematic soil type in the area (e.g., "red Mississippi clay", "Florida sand") */
  soilType: string;
  /** A short description of how the soil behaves (e.g., "sheds water like a tarp", "drains too fast to hold nutrients") */
  soilBehavior: string;
  /** The general geographic descriptor used in copy (e.g., "Meridian dirt", "Austin limestone") */
  dirtName: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface ServiceItem {
  name: string;
  solves: string;
  includes: string;
  when: string;
}

export interface ProcessStep {
  n: string;
  title: string;
  body: string;
}

export interface GradeLift {
  area: string;
  before: string;
  after: string;
  note: string;
}

export interface Testimonial {
  body: string;
  by: string;
}

export interface DiagnosticConfig {
  /** Fallback clay percentage when real data fails (0-100) */
  mockClayPercent: number;
  /** Fallback sand percentage when real data fails (0-100) */
  mockSandPercent: number;
  /** Fallback bulk density (g/cm³) when real data fails (typically 1.0 - 1.8) */
  mockBulkDensity: number;
  /** Messages to display during the 20-30s diagnostic loading phase */
  loadingMessages: [string, string, string, string];
  /** Map of zip codes to mock coordinates for fallback geocoding */
  fallbackCentroids: Record<string, { lat: number; lng: number }>;
}

export interface ContentConfig {
  localized: LocalizedTerminology;
  faqs: FAQ[];
  services: ServiceItem[];
  process: ProcessStep[];
  lifts: GradeLift[];
  testimonials: Testimonial[];
}

export interface SiteConfig {
  theme: ThemeConfig;
  business: BusinessConfig;
  content: ContentConfig;
  diagnostic: DiagnosticConfig;
}

export const SITE_CONFIG: SiteConfig = {
  theme: {
    // These are standard hex codes corresponding to the original oklch values
    loam: "#0a0414", // Approx oklch(0.18 0.02 290)
    soil: "#3b3644", // Approx oklch(0.28 0.045 55) -> greyish purple
    ember: "#ff6b35", // Approx oklch(0.72 0.18 45) -> bright orange
    wheat: "#f7d08a", // Approx oklch(0.88 0.10 80) -> pale yellow
    bone: "#f4f1f1", // Approx oklch(0.96 0.015 75) -> off white
  },
  business: {
    name: "Affordable Landscaping",
    shortName: "Affordable Landscaping",
    serviceArea: "Meridian, MS",
    zipCodes: ["39301", "39305", "39307", "39309", "39320"],
    phone: "(601) 604-0461",
    email: "hello@affordablelandscaping.example",
    tagline: "Stewards of your lawn — six inches deeper than anyone else looks.",
  },
  content: {
    localized: {
      soilType: "red Mississippi clay",
      soilBehavior: "sheds water like a tarp",
      dirtName: "Meridian dirt",
    },
    faqs: [
      {
        q: "Why is the diagnostic free?",
        a: "Because most lawns in our area don't need what they're being sold. The diagnostic tells us — and you — whether the soil is actually the problem. If it's not, we save you a service call. If it is, you know exactly why.",
      },
      {
        q: "What's actually wrong with our soil?",
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
        a: "Yes — fully licensed and carrying general liability + workers' comp. Documentation provided before any on-site work.",
      },
    ],
    services: [
      {
        name: "Soil Diagnostic",
        solves: "Not knowing what's actually wrong.",
        includes: "Address-level soil read, compaction grade, written plan. Free.",
        when: "Always start here.",
      },
      {
        name: "Core Aeration",
        solves: "Surface runoff and shallow roots.",
        includes: "3-inch plugs across the full lot, debris cleared, overseed-ready.",
        when: "Early fall or early spring.",
      },
      {
        name: "Deep Soil Restoration",
        solves: "Severe clay compaction (Grade D / F).",
        includes:
          "Vertical fracturing, gypsum + organic matter injection, follow-up read at 90 days.",
        when: "Once. Maintenance after.",
      },
      {
        name: "Drainage Engineering",
        solves: "Standing water, sloped runoff into the wrong place.",
        includes: "Site survey, French drain or swale design, build, and verification.",
        when: "Before the next big rain.",
      },
    ],
    process: [
      {
        n: "01",
        title: "Diagnose",
        body: "Free, 60-second address-level soil read. Clay %, bulk density, a written compaction grade. No call. No card.",
      },
      {
        n: "02",
        title: "Map",
        body: "If the grade warrants it, we walk your yard and mark zones — high traffic, low spots, drainage paths. You see the same map we do.",
      },
      {
        n: "03",
        title: "Restore",
        body: "Aeration, deep fracturing, drainage build — only what your soil actually needs. Honest line items, no upsell.",
      },
      {
        n: "04",
        title: "Steward",
        body: "90-day re-read included. We compare before/after grades, leave you a one-page maintenance plan, and check back next season.",
      },
    ],
    lifts: [
      { area: "29th Ave", before: "F", after: "B", note: "Standing water gone in one season." },
      { area: "Poplar Springs", before: "D", after: "B", note: "Roots down 4 inches in 90 days." },
      { area: "North Hills", before: "C", after: "A", note: "Cut watering by 40%." },
      { area: "Bonita Lakes", before: "F", after: "C", note: "Year-one fix. Tracking toward B." },
      { area: "West End", before: "D", after: "A", note: "Drainage rebuild + restoration." },
      { area: "Toomsuba", before: "C", after: "B", note: "Just aeration. No re-sod needed." },
    ],
    testimonials: [
      {
        body: "They told me my soil was the problem, not my fertilizer. They were right. First time in eight years the grass is green in August.",
        by: "Marcus T., Meridian",
      },
      {
        body: "Honest pricing, showed up when they said. The soil report alone was worth more than what most companies charge to mow.",
        by: "Linda R., Poplar Springs",
      },
      {
        body: "We were ready to re-sod the whole lot. They aerated, did the deep work, and the lawn came back on its own.",
        by: "James K., North Hills",
      },
    ],
  },
  diagnostic: {
    mockClayPercent: 38,
    mockSandPercent: 28,
    mockBulkDensity: 1.42,
    loadingMessages: [
      "Reading your dirt…",
      "Pulling deeper records — the clay is thick today.",
      "Letting the sun rest on the ridge while we finish.",
      "Still working. This parcel is taking longer than usual.",
    ],
    fallbackCentroids: {
      "39301": { lat: 32.3643, lng: -88.7034 },
      "39305": { lat: 32.4287, lng: -88.7264 },
      "39307": { lat: 32.3552, lng: -88.6708 },
      "39309": { lat: 32.4019, lng: -88.7681 },
      "39320": { lat: 32.5418, lng: -88.6961 },
    },
  },
};
