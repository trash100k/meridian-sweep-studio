# Meridian Sunset Sweep — Build Plan (v2)

Build the full cinematic experience now. Leave clearly marked placeholders for the things you're still deciding on so they're easy to flip on later.

---

## What ships

### 1. Hero — Meridian Sunset Sweep (full viewport)
- WebGL grass field via Three.js + `InstancedMesh` (~30k blades, scaled down on mobile)
- Camera fixed ~6in above turf, continuous +Z tunnel, recycling tile = infinite runway
- Vertex shader: wind sway + subtle parting near camera
- Fragment shader: warm rim light on tips, deep loam shadow at roots
- Headline materializes in air: *"Your lawn isn't dying. Your soil is suffocating."*
- Single CTA: **Run my free diagnostic →**
- Reduced-motion users get a still painterly hero; no-WebGL users get a looping golden-hour video poster

### 2. The Red Clay Problem
Three short revelations fade in via IntersectionObserver as the sweep continues. Per-character opacity + Z-translate + blur falloff (text condensing out of haze).

### 3. The Diagnostic Engine (the Silent Siphon)
- Two fields only: **Zip code** + **Property address**
- Submit → loading sequence shows three "Mycelium" pulls happening with check-marks as each resolves:
  - Querying USDA soil maps…
  - Pulling parcel data…
  - Capturing satellite imagery…

### 4. Diagnostic Report (renders inline after submit)
- Satellite tile of the address — **placeholder until Mapbox token is added**, falls back to stylized SVG yard sketch
- **Soil Compaction Grade A–F** — real data from SoilGrids (free, no key)
- Estimated Lot Size + Estate Value — deterministic mock seeded by address hash
- Phone capture CTA: *"Book your restoration window — we'll call within 1 business day."*

### 5. Footer
Minimal: business name, service area, tiny "Powered by SoilGrids" line.

---

## Backend (Lovable Cloud)

**Table: `leads`**
- id, created_at, zip, address, lat, lng, phone (nullable), soil_grade, soil_payload (jsonb), property_payload (jsonb), satellite_url
- RLS: anon insert allowed (lead capture), select denied (service-role only)

**Server functions** (`src/lib/diagnostic.functions.ts`)
- `geocodeAddress` — Mapbox geocoding when token present, else zip-centroid lookup
- `pullSoil` — SoilGrids `/properties/query` for clay/sand/bulk-density at 0–30cm → Compaction Grade
- `pullProperty` — deterministic mock (lot size, year built, estimated value)
- `pullSatellite` — Mapbox Static Images when token present, else `{ fallback: true }`
- `runDiagnostic` — orchestrates all four in parallel via `Promise.allSettled`, inserts the lead, returns the report
- `attachPhone` — updates the lead with phone number

**Public API for OpenClaw — placeholder, off by default**

I'll scaffold these routes but leave them returning 501 until you decide:
- `GET /api/public/leads?since=&limit=&include_phone=` — returns lead rows (phone hidden unless flag set)
- `GET /api/public/stats` — totals, average grade, top zips, leads-with-phone count

Both will check `Bearer $LEADS_API_KEY`. The secret won't be added yet — when you're ready, you flip them on by:
1. Adding the `LEADS_API_KEY` secret
2. Removing the `// PLACEHOLDER:` 501 short-circuit at the top of each handler

A `// PLACEHOLDER:` comment block in each file documents exactly what to change.

---

## Placeholders left open (clearly marked in code)

| What | Where | How to enable later |
| --- | --- | --- |
| **Mapbox token** | `MAPBOX_TOKEN` env var | Add via secrets tool → real satellite + geocoding turn on automatically |
| **OpenClaw leads endpoint** | `src/routes/api/public/leads.ts` | Add `LEADS_API_KEY` secret + remove 501 guard |
| **OpenClaw stats endpoint** | `src/routes/api/public/stats.ts` | Same |
| **Business name / phone / service area** | Single constants file `src/config/business.ts` | One edit to swap "Meridian Turf Restoration / Meridian, MS / (601) 555-0142" for the real ones |
| **Real property data (Regrid)** | `pullProperty` server fn | Drop in Regrid call when you're ready |
| **Email/SMS notification on new lead** | n/a yet | Add Resend or Twilio later |

---

## Design system
- Palette: deep loam black, soil shadow, ember orange, wheat highlight, off-white
- Typography: Instrument Serif for display, Inter for body/form
- Tokens in `src/styles.css` as oklch
- Restrained per the manifesto: minimal nav, no "trusted by" row, no footer link columns

---

## Routes
- `/` — full cinematic experience (single page, `src/routes/index.tsx`)
- `/api/public/leads` — placeholder (501)
- `/api/public/stats` — placeholder (501)

---

## Out of scope for this build
- Admin dashboard (query Lovable Cloud table directly for now)
- Payments / scheduling
- Multi-page split (this is a single funnel by design)
