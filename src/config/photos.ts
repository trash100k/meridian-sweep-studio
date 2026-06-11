import heroLawn from "@/assets/demo/hero-lawn.jpg.asset.json";
import stripedLawn from "@/assets/demo/striped-lawn.jpg.asset.json";
import flagstonePatio from "@/assets/demo/flagstone-patio.jpg.asset.json";
import stoneWalkway from "@/assets/demo/stone-walkway.jpg.asset.json";
import dryCreek from "@/assets/demo/dry-creek.jpg.asset.json";
import waterFeature from "@/assets/demo/water-feature.jpg.asset.json";
import stoneSteps from "@/assets/demo/stone-steps.jpg.asset.json";
import flowerBed from "@/assets/demo/flower-bed.jpg.asset.json";
import truck from "@/assets/demo/truck.jpg.asset.json";
import owner from "@/assets/demo/owner.jpg.asset.json";

export const PHOTOS = {
  heroLawn: heroLawn.url,
  stripedLawn: stripedLawn.url,
  flagstonePatio: flagstonePatio.url,
  stoneWalkway: stoneWalkway.url,
  dryCreek: dryCreek.url,
  waterFeature: waterFeature.url,
  stoneSteps: stoneSteps.url,
  flowerBed: flowerBed.url,
  truck: truck.url,
  richard: owner.url, // legacy alias for owner portrait
  owner: owner.url,
} as const;
