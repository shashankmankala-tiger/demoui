import type { ShapLookup } from "@/types/api.types";

// Synthetic per-attribute cost impacts for demo mode.
// Values represent the $ cost delta of each option relative to a neutral baseline.

export const DEMO_SHAP: ShapLookup = {
  "WOMENS FLEECE": {
    silhouette: { label: "Silhouette", values: {
      "Column": -0.12, "Fitted": 0.05, "Boxy": 0.00, "A-Line": 0.08,
      "Peplum": 0.18, "Empire": 0.10, "Wrap": 0.12, "Tunic": 0.06,
      "Cropped": -0.08, "Oversized": 0.10, "High-Low": 0.14,
      "Asymmetrical": 0.16, "Cape": 0.20, "Smocked": 0.22, "Babydoll": 0.08,
    }},
    length: { label: "Length", values: {
      "Cropped": -0.10, "Waist-length": 0.00, "Hip-length": 0.08,
      "Low hip": 0.10, "Tunic length": 0.12, "Longline": 0.15,
    }},
    sleeves_type: { label: "Sleeves", values: {
      "Sleeveless": -0.35, "Cap sleeve": -0.20, "Short sleeve": -0.05,
      "Elbow sleeve": 0.05, "Three-quarter sleeve": 0.08, "Long sleeve": 0.15,
      "Puff sleeve": 0.25, "Bell sleeve": 0.20, "Bishop sleeve": 0.22,
      "Flutter sleeve": 0.18, "Raglan sleeve": 0.10, "Dolman sleeve": 0.08,
      "Batwing sleeve": 0.12, "Kimono sleeve": 0.14, "Lantern sleeve": 0.22,
      "Petal sleeve": 0.16, "Slit sleeve": 0.10, "Cold shoulder sleeve": 0.06,
      "Off-shoulder sleeve": 0.08, "Balloon sleeve": 0.24,
    }},
    neck_line_type: { label: "Neckline", values: {
      "Crew neck": 0.00, "Round neck": 0.00, "Scoop neck": 0.03,
      "V-neck": 0.05, "Deep V-neck": 0.08, "Square neck": 0.06,
      "Boat neck (Bateau)": 0.08, "Sweetheart neck": 0.10, "Halter neck": 0.06,
      "Keyhole neck": 0.10, "Mock neck": 0.12, "Turtleneck": 0.18,
      "Cowl neck": 0.14, "Off-shoulder": 0.10, "One-shoulder": 0.12,
      "Asymmetrical neck": 0.14, "Collared neck": 0.10, "Peter Pan collar": 0.12,
      "Mandarin collar": 0.10, "Notch neck": 0.06, "Henley neck": 0.08,
    }},
    waist_type: { label: "Waist Type", values: {
      "Fitted waist": 0.10, "Relaxed waist": 0.00, "Empire waist": 0.12,
      "Peplum waist": 0.18, "Drop waist": 0.08, "Blouson waist": 0.10,
      "Elastic waist": 0.00, "Drawstring waist": 0.05, "Smocked waist": 0.15,
      "Belted waist": 0.20, "Gathered waist": 0.12, "Cinched waist": 0.10,
    }},
    back: { label: "Back Construction", values: {
      "Closed back": 0.00, "Low back": 0.05, "Backless": 0.08,
      "V-back": 0.08, "U-back": 0.06, "Keyhole back": 0.10,
      "Racerback": 0.06, "Crisscross back": 0.12, "Tie back": 0.08,
      "Button back": 0.10, "Corset/Lace-up back": 0.22, "Cut-out back": 0.14,
      "Sheer/back panel": 0.16, "Peplum back": 0.18, "Pleated back": 0.12,
      "Open-back with straps": 0.10,
    }},
    pockets: { label: "Pockets", values: {
      "No pockets": -0.15, "On-seam pockets (curved side entry)": 0.08,
      "Side seam pockets": 0.10, "Welt pockets (rear)": 0.15,
      "Hidden zip pocket": 0.20, "Flap pockets": 0.25, "Cargo pockets (side thigh)": 0.35,
      "5-pocket (Jeans style)": 0.30, "Back patch pockets": 0.12,
    }},
    panels_count: { label: "Panel Count", values: {
      "2": -0.30, "4": -0.20, "6": -0.10, "8": 0.00, "10": 0.15,
      "12": 0.25, "14": 0.35, "16": 0.50, "18": 0.60, "20": 0.75,
    }},
    seam_count: { label: "Seam Count", values: {
      "4": -0.25, "6": -0.18, "8": -0.15, "10": -0.05, "12": 0.00,
      "14": 0.10, "16": 0.25, "18": 0.35, "20": 0.50, "22": 0.60, "24": 0.75,
    }},
    pockets_count: { label: "Pocket Count", values: {
      "0": -0.20, "1": -0.10, "2": 0.00, "3": 0.15, "4": 0.30, "5": 0.45, "6": 0.60,
    }},
  },
  "W DRESSES & SKIRTS": {
    silhouette: { label: "Silhouette", values: {
      "A-line": -0.10, "Mermaid": 0.25, "Trumpet": 0.22, "Ball gown": 0.50,
      "Fit and flare": 0.15, "Slip": -0.15, "Sheath": 0.05, "Column": 0.00,
      "Tea-length": 0.08, "Empire": 0.06, "Mini": -0.12, "Midi": 0.00,
      "High-low": 0.12, "Drop-waist": 0.10, "Tunic": 0.00,
    }},
    length: { label: "Length", values: {
      "Mini (above mid-thigh)": -0.15, "Knee length": -0.05, "Midi (mid-calf)": 0.05,
      "Maxi (ankle length)": 0.12, "Floor length": 0.18, "Tunic length": 0.00,
    }},
    sleeves_type: { label: "Sleeves", values: {
      "Sleeveless": -0.20, "Cap sleeve": -0.10, "Short sleeve": 0.00,
      "Elbow sleeve": 0.06, "Three-quarter sleeve": 0.10, "Long sleeve": 0.15,
      "Puff sleeve": 0.22, "Bell sleeve": 0.18, "Bishop sleeve": 0.20,
      "Flutter sleeve": 0.14,
    }},
    neck_line_type: { label: "Neckline", values: {
      "Crew / round": 0.00, "V-neck": 0.03, "Square neck": 0.04,
      "Sweetheart": 0.10, "Boat neck": 0.06, "Halter": 0.05,
      "Off-shoulder": 0.08, "One shoulder": 0.10, "Collared / shirt dress": 0.14,
      "Collared neck": 0.14,
    }},
    waist_type: { label: "Waist Type", values: {
      "Natural waist": -0.05, "Empire waist": 0.08, "Drop waist": 0.10,
      "Elastic waist": -0.05, "Belted waist": 0.18, "Smocked waist": 0.15,
      "Corset waist": 0.25, "Relaxed waist": 0.00,
    }},
    skirt_construction: { label: "Skirt Construction", values: {
      "Straight skirt": 0.00, "Pleated skirt": 0.12, "Tiered skirt": 0.18,
      "Circle skirt": 0.10, "Gathered skirt": 0.14, "Asymmetric skirt": 0.15,
      "Wrap skirt": 0.08, "Ruffle skirt": 0.20,
    }},
    back: { label: "Back Construction", values: {
      "Closed Back": 0.00, "Low Back": 0.05, "Backless": 0.10,
      "V Back": 0.08, "U Back": 0.06, "Keyhole Back": 0.12,
      "Racerback": 0.06, "Crisscross Back": 0.14, "Tie Back": 0.08,
      "Button Back": 0.10, "Corset / Lace Up": 0.25, "Cut-Out Back": 0.15,
      "Pleated back": 0.00,
    }},
    pockets: { label: "Pockets", values: {
      "No pockets": -0.10, "Side seam pockets": 0.08, "Welt pockets (rear)": 0.12,
      "Patch pockets": 0.10, "Hidden zip pocket": 0.15, "Unknown": 0.00,
    }},
    panels_count: { label: "Panel Count", values: {
      "4": -0.15, "6": -0.08, "8": -0.03, "10": 0.00, "12": 0.10,
      "14": 0.20, "16": 0.32, "18": 0.45, "20": 0.58,
    }},
    seam_count: { label: "Seam Count", values: {
      "6": -0.20, "8": -0.12, "10": -0.06, "12": -0.02, "14": 0.00,
      "16": 0.10, "18": 0.22, "20": 0.35, "22": 0.48, "24": 0.60,
    }},
    pockets_count: { label: "Pocket Count", values: {
      "0": 0.00, "1": 0.08, "2": 0.16, "3": 0.25, "4": 0.35, "5": 0.45,
    }},
  },
};

// Per-department base cost (before any attribute SHAP impacts).
// Calibrated so the default demo attributes sum back to the predicted cost.
export const DEMO_BASE_COSTS: Record<string, number> = {
  "WOMENS FLEECE":      6.72,  // default attrs: sleeves(+0.15)+neck(+0.12)+pockets(+0.25)=+0.52 → 6.72+0.52=7.24
  "W DRESSES & SKIRTS": 8.89,  // default attrs: neck "Collared neck"(+0.14) → 8.89+0.14=9.03 (predicted); category baseline is 8.70
};

export const DEMO_CATEGORY_BASELINES: Record<string, number> = {
  "WOMENS FLEECE":      6.90,
  "W DRESSES & SKIRTS": 8.70,
};

// Fallbacks
export const DEMO_BASE_COST         = 7.24;
export const DEMO_CATEGORY_BASELINE = 7.00;
