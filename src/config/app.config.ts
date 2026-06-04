// Centralised app configuration — swap values here for environment-specific overrides

export const APP_CONFIG = {
  name: "Flash Costing",
  brand: "GAP",
  tagline: "Product cost intelligence",
  phase: "Phase 1 POC",

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
    // Model inference can take 20–40 s; set a generous ceiling
    timeout: 90_000,
    endpoints: {
      predict: "/v2/predict/full",
    },
  },

  // Sketch image CDN / service — replace with real URL in production
  sketchBaseUrl:
    process.env.NEXT_PUBLIC_SKETCH_BASE_URL ?? "/assets/prototype_sketches",

  // Model version string included in feedback payloads
  modelVersion: process.env.NEXT_PUBLIC_MODEL_VERSION ?? "sketchrd_subclass_prob@2026-04-24",

  /** All supported departments — shown in the department override dropdown. */
  departments: [
    "MENS PANTS",
    "W DRESSES & SKIRTS",
    "WOMENS FLEECE",
    "WOMENS KNITS",
  ] as const,
} as const;

export function sketchUrl(styleNumber: number): string {
  return `${APP_CONFIG.sketchBaseUrl}/${styleNumber}.jpg`;
}
