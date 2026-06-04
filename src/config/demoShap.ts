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
};

// Base cost before any attribute impacts — calibrated so original demo attributes sum to $7.24
// Original: sleeves=Long sleeve(+0.15) + neck=Mock neck(+0.12) + pockets=Flap pockets(+0.25) = +0.52
export const DEMO_BASE_COST = 6.72;

export const DEMO_CATEGORY_BASELINE = 6.90;
