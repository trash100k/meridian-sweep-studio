## Photo inventory (what you uploaded)

| File | What it shows | Best use |
|---|---|---|
| `474795964...` | Front yard with diamond-stripe mow pattern on a brick home | **Hero / Home Act II** — flagship lawn shot |
| `480410472...` | Tight crop of checkerboard stripe lawn | Lawn Maintenance service tile |
| `153550340...` | Flagstone patio at dusk with planting bed | Hardscaping service tile + Results "Paver/Stone Patio" |
| `494240261...` | Long flagstone walkway with stone borders + plantings | Stone Masonry service tile + Results |
| `494210412...` | Wooded backyard, brick path, river-rock dry creek | Landscape Design tile + Results "Drainage / Dry Creek" |
| `498303759...` | Stone-edged koi/water feature with river rock | Results "Water Feature" project |
| `496927980...` | Cottage home with terraced stone steps + plantings | Results "Full Landscape Refresh" |
| `106108690...` | Lush mixed flower bed (impatiens, caladiums) | Landscape Design tile or About accent |
| `494173890...` | R & C branded work truck + trailer with mower | About page — "the crew you meet" |
| `494437795...` | Selfie of Richard + daughter + dog in truck | About page — owner portrait |

## Plan

### 1. Upload as CDN assets
Run `lovable-assets create` on all 10 files → write `src/assets/rc/*.jpg.asset.json` pointers. Keeps the repo light, gives stable URLs.

Create a small index module `src/config/photos.ts` that imports all 10 pointers and exports named constants (`HERO_LAWN`, `STRIPED_LAWN`, `FLAGSTONE_PATIO`, `STONE_WALKWAY`, `DRY_CREEK`, `WATER_FEATURE`, `STONE_STEPS`, `FLOWER_BED`, `TRUCK`, `RICHARD_PORTRAIT`).

### 2. Home page (`src/routes/index.tsx`)
- **Act I** stays text-only (the sunset stage carries it).
- **Act II ("One crew for the whole yard")**: add a subtle right-side image collage — 3 stacked photos (striped lawn, flagstone patio, stone walkway) fading in with the act. Low opacity so the sunset still reads.
- **Act IV services card**: each of the 6 service tiles gets a small thumbnail (40×40 rounded) on the left of the title.

### 3. Results page (`src/routes/results.tsx`)
Rewrite the `PROJECTS` array so each card has a real photo + caption tied to what's actually in the photo. Cards become image-first (16:9 photo on top, text below). Six projects, all with real imagery:
- 29th Ave → flagstone patio at dusk
- Poplar Springs → long stone walkway
- North Hills → terraced steps + cottage refresh
- Bonita Lakes → water feature / koi pond
- West End → dry creek drainage
- Toomsuba → striped front lawn

### 4. About page (`src/routes/about.tsx`)
- Add the Richard + daughter selfie as the owner portrait (rounded, ~280px, beside the founder paragraph).
- Add the branded truck photo lower down as "the crew & rig you'll see in your driveway."

### 5. Services page (`src/routes/services.tsx`)
Each of the 6 services gets a hero thumbnail matching its category (lawn / design / hardscape / masonry / lighting / diagnostic). Lighting + diagnostic don't have real photos — they stay text-only or use the dusk flagstone shot for lighting.

### 6. SEO
Set `og:image` on Home + Results + About to the striped-lawn hero so link previews look real.

## Out of scope
- No Facebook/Google scraping (blocked + ToS risk).
- No AI-generated landscape stock — your real photos are stronger than anything I'd fake.
- No new routes; just wiring existing pages to real imagery.
