// Illustrative cost-theme, origin, and positioning multipliers.
// Replace with real values (or wire to backend) before production.

import type { ThemeConfig, OriginConfig } from "@/types/app.types";

export const THEMES: ThemeConfig[] = [
  { id: "premium_trims", label: "Expensive trims", hint: "+", pct: 0.08 },
  { id: "heavy_graphics", label: "Heavy graphics / print", hint: "+", pct: 0.05 },
  { id: "embellished", label: "Embellishment / beading", hint: "+", pct: 0.1 },
  { id: "sustainable", label: "Sustainable / organic", hint: "+", pct: 0.07 },
  { id: "fashion", label: "Fashion-forward", hint: "+", pct: 0.06 },
  { id: "core_basic", label: "Core / basic", hint: "−", pct: -0.05 },
  { id: "simple_make", label: "Simple construction", hint: "−", pct: -0.06 },
];

export const POSITIONING: Record<string, number> = {
  budget: -0.12,
  standard: 0,
  premium: 0.14,
};

export const ORIGINS: OriginConfig[] = [
  { v: "unknown", label: "Not specified", mult: 0 },
  { v: "bangladesh", label: "Bangladesh", mult: -0.05 },
  { v: "vietnam", label: "Vietnam", mult: -0.02 },
  { v: "india", label: "India", mult: -0.03 },
  { v: "china", label: "China", mult: 0.0 },
  { v: "brazil", label: "Brazil", mult: 0.01 },
  { v: "turkey", label: "Turkey", mult: 0.03 },
  { v: "usa", label: "United States", mult: 0.12 },
  { v: "italy", label: "Italy", mult: 0.18 },
];

export const COTTON_ORIGINS: OriginConfig[] = [
  { v: "unknown", label: "Not specified", mult: 0 },
  { v: "india", label: "India", mult: -0.04 },
  { v: "china", label: "China", mult: -0.02 },
  { v: "pakistan", label: "Pakistan", mult: -0.05 },
  { v: "usa", label: "United States", mult: 0.08 },
  { v: "brazil", label: "Brazil", mult: -0.01 },
  { v: "egypt", label: "Egypt", mult: 0.05 },
  { v: "turkey", label: "Turkey", mult: 0.02 },
  { v: "australia", label: "Australia", mult: 0.1 },
];

// Features that belong to fabric composition (used to conditionally show fabric section)
export const FABRIC_FEATURES = [
  "pct_cotton",
  "pct_polyester",
  "pct_elastane_spandex",
  "pct_viscose_rayon",
  "pct_linen",
  "pct_nylon",
  "pct_modal",
  "pct_polystyrene",
  "pct_lyocell_tencel",
  "pct_metallic",
  "pct_other",
];
