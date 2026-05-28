// Server functions for the Silent Siphon diagnostic engine.
// All four "Mycelium" pulls + the orchestrator that stores leads.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { hashString, mulberry32 } from "@/lib/seeded-random";
import { SITE_CONFIG } from "@/config/site";

// PLACEHOLDER: When you add MAPBOX_TOKEN via the secrets tool, real geocoding
// + real satellite imagery turn on automatically.
function getMapboxToken(): string | undefined {
  return process.env.MAPBOX_TOKEN;
}

function fallbackCentroid(zip: string) {
  if (SITE_CONFIG.diagnostic.fallbackCentroids[zip])
    return SITE_CONFIG.diagnostic.fallbackCentroids[zip];

  // Generic fallback: jitter from the first fallback centroid based on zip hash
  const fallbackValues = Object.values(SITE_CONFIG.diagnostic.fallbackCentroids);
  const basePoint = fallbackValues[0] || { lat: 32.3643, lng: -88.7034 };
  const r = mulberry32(hashString(zip));
  return {
    lat: basePoint.lat + (r() - 0.5) * 0.4,
    lng: basePoint.lng + (r() - 0.5) * 0.4,
  };
}

// --- Geocode -----------------------------------------------------------------
async function geocode(zip: string, address: string) {
  const token = getMapboxToken();
  if (token) {
    try {
      const q = encodeURIComponent(`${address}, ${zip}`);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json?access_token=${token}&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const json = (await res.json()) as { features?: Array<{ center: [number, number] }> };
        const f = json.features?.[0];
        if (f) return { lat: f.center[1], lng: f.center[0], source: "mapbox" as const };
      }
    } catch (e) {
      console.error("Mapbox geocode failed, falling back:", e);
    }
  }
  return { ...fallbackCentroid(zip), source: "fallback" as const };
}

// --- SoilGrids ---------------------------------------------------------------
type SoilLayer = {
  depth_label: string;
  values?: { mean?: number };
};
type SoilProperty = {
  name: string;
  layers?: Array<{ name?: string; depths?: SoilLayer[] }>;
};

async function pullSoil(lat: number, lng: number) {
  // ISRIC SoilGrids — free, no key. Pull clay, sand, bulk-density at 0–30cm.
  const props = ["clay", "sand", "bdod"];
  const url = new URL("https://rest.isric.org/soilgrids/v2.0/properties/query");
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("lat", String(lat));
  for (const p of props) url.searchParams.append("property", p);
  url.searchParams.append("depth", "0-5cm");
  url.searchParams.append("depth", "5-15cm");
  url.searchParams.append("depth", "15-30cm");
  url.searchParams.append("value", "mean");

  const fallback = {
    clay: SITE_CONFIG.diagnostic.mockClayPercent,
    sand: SITE_CONFIG.diagnostic.mockSandPercent,
    bdod: SITE_CONFIG.diagnostic.mockBulkDensity,
    source: "fallback" as const,
  };

  try {
    const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    if (!res.ok) {
      console.error("SoilGrids non-OK:", res.status);
      return fallback;
    }
    const json = (await res.json()) as { properties?: { layers?: SoilProperty[] } };
    const layers = json.properties?.layers ?? [];

    function avg(name: string, scale: number) {
      const layer = layers.find((l) => (l as unknown as { name: string }).name === name) as
        | { depths?: SoilLayer[] }
        | undefined;
      const depths = layer?.depths ?? [];
      const vals = depths
        .map((d) => d.values?.mean)
        .filter((v): v is number => typeof v === "number");
      if (vals.length === 0) return null;
      return (vals.reduce((a, b) => a + b, 0) / vals.length) * scale;
    }

    const clay = avg("clay", 0.1); // SoilGrids returns g/kg * 10 → percent
    const sand = avg("sand", 0.1);
    const bdod = avg("bdod", 0.01); // returns cg/cm³ * 100 → g/cm³

    if (clay == null || sand == null || bdod == null) return fallback;
    return { clay, sand, bdod, source: "soilgrids" as const };
  } catch (e) {
    console.error("SoilGrids fetch failed:", e);
    return fallback;
  }
}

export type SoilGrade = "A" | "B" | "C" | "D" | "F";

function gradeFromSoil(soil: { clay: number; sand: number; bdod: number }): {
  grade: SoilGrade;
  score: number;
  headline: string;
  detail: string;
} {
  // Higher clay + higher bulk density = worse compaction.
  // Score 0 (perfect) → 100 (catastrophic).
  const clayScore = Math.min(100, Math.max(0, (soil.clay - 10) * 1.6)); // 10% clay = 0, 72.5%+ = 100
  const bdodScore = Math.min(100, Math.max(0, (soil.bdod - 1.1) * 200)); // 1.1 = 0, 1.6 = 100
  const sandRelief = Math.min(20, Math.max(0, soil.sand - 30) * 0.4);
  const score = Math.round(
    Math.max(0, Math.min(100, clayScore * 0.55 + bdodScore * 0.45 - sandRelief)),
  );

  let grade: SoilGrade;
  let headline: string;
  let detail: string;
  if (score < 20) {
    grade = "A";
    detail = "Loose, well-drained soil. Roots can breathe. Maintenance-mode care.";
    headline = "Healthy structure";
  } else if (score < 40) {
    grade = "B";
    detail = "Mild compaction. A single aeration pass next season prevents drift toward C.";
    headline = "Mostly clear";
  } else if (score < 60) {
    grade = "C";
    detail = "Moderate compaction. Water is pooling instead of soaking. Roots are getting shallow.";
    headline = "Suffocating";
  } else if (score < 80) {
    grade = "D";
    detail = "Severe compaction. Most of the rain you paid for is running off the property.";
    headline = "Critical";
  } else {
    grade = "F";
    detail =
      "Functionally impervious. The lawn isn't dying from drought — it's drowning above sealed clay.";
    headline = "Catastrophic";
  }
  return { grade, score, headline, detail };
}

// --- Property mock -----------------------------------------------------------
function pullProperty(zip: string, address: string) {
  const r = mulberry32(hashString(`${zip}|${address}`));
  const lotSize = Math.round((0.18 + r() * 0.62) * 100) / 100; // acres
  const yearBuilt = 1948 + Math.floor(r() * 72);
  const sqft = 1100 + Math.floor(r() * 2600);
  const baseValue = 95_000 + Math.floor(r() * 380_000);
  return {
    lotSize,
    yearBuilt,
    sqft,
    estimatedValue: Math.round(baseValue / 1000) * 1000,
    source: "estimated" as const,
  };
}

// --- Satellite ---------------------------------------------------------------
function pullSatellite(lat: number, lng: number): { url: string | null; fallback: boolean } {
  const token = getMapboxToken();
  if (!token) return { url: null, fallback: true };
  // Mapbox Static Images — top-down satellite of the property
  const url =
    `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/` +
    `${lng},${lat},18,0/640x400@2x?access_token=${token}`;
  return { url, fallback: false };
}

// --- Orchestrator ------------------------------------------------------------
const RunDiagnosticInput = z.object({
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Enter a 5-digit zip code"),
  address: z.string().trim().min(4).max(200),
});

export const runDiagnostic = createServerFn({ method: "POST" })
  .inputValidator((input) => RunDiagnosticInput.parse(input))
  .handler(async ({ data }) => {
    const { zip, address } = data;
    const geo = await geocode(zip, address);
    const [soil, property, satellite] = await Promise.all([
      pullSoil(geo.lat, geo.lng),
      Promise.resolve(pullProperty(zip, address)),
      Promise.resolve(pullSatellite(geo.lat, geo.lng)),
    ]);
    const grade = gradeFromSoil(soil);

    const { data: inserted, error } = await supabaseAdmin
      .from("leads")
      .insert({
        zip,
        address,
        lat: geo.lat,
        lng: geo.lng,
        soil_grade: grade.grade,
        soil_payload: { ...soil, ...grade },
        property_payload: property,
        satellite_url: satellite.url,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to insert lead:", error);
      throw new Error("Could not save your diagnostic. Please try again.");
    }

    return {
      leadId: inserted.id,
      geo,
      soil,
      grade,
      property,
      satellite,
    };
  });

// --- Phone capture -----------------------------------------------------------
const AttachPhoneInput = z.object({
  leadId: z.string().uuid(),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[\d\s\-+()]+$/, "Phone number contains invalid characters"),
});

export const attachPhone = createServerFn({ method: "POST" })
  .inputValidator((input) => AttachPhoneInput.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("leads")
      .update({ phone: data.phone })
      .eq("id", data.leadId);
    if (error) {
      console.error("Failed to attach phone:", error);
      throw new Error("Could not save your phone number. Please try again.");
    }
    return { ok: true };
  });
