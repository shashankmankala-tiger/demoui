/**
 * Human-readable labels, valid options, and groupings for LLM-extracted
 * garment attributes returned by POST /v2/predict/full.
 *
 * Options are sourced directly from attribute_extraction.yaml in the model repo.
 */

// ── Core attribute keys (all lowercase) ─────────────────────────────────────

/** The 13 attributes we show in the UI. All others (decorative_elements,
 *  confidence_scores, next_best_options, raw, summary) are filtered out. */
export const VALID_ATTR_KEYS = new Set([
  "silhouette", "length", "sleeves_type", "neck_line_type", "waist_type",
  "skirt_construction", "back", "rise", "leg_shape", "pockets",
  "panels_count", "seam_count", "pockets_count",
]);

/** Normalize an attribute key from the API to the lowercase canonical form.
 *  The LLM sometimes returns "Silhouette" with a capital S. */
export function normalizeAttrKey(key: string): string {
  return key.toLowerCase();
}

// ── Label map ────────────────────────────────────────────────────────────────

/** Display label for each canonical attribute key. */
export const ATTR_LABELS: Record<string, string> = {
  silhouette:        "Silhouette",
  length:            "Length",
  sleeves_type:      "Sleeves",
  neck_line_type:    "Neckline",
  waist_type:        "Waist Type",
  skirt_construction:"Skirt Construction",
  back:              "Back Construction",
  rise:              "Rise",
  leg_shape:         "Leg Shape",
  pockets:           "Pockets",
  panels_count:      "Panel Count",
  seam_count:        "Seam Count",
  pockets_count:     "Pocket Count",
  summary:           "Summary",
};

// ── Attribute groups (for CostDriverBars grouping) ───────────────────────────

export const ATTR_GROUPS: Record<string, string[]> = {
  "Shape & fit":  ["silhouette", "length", "back", "neck_line_type", "sleeves_type"],
  "Construction": ["panels_count", "pockets", "pockets_count", "seam_count"],
  "Bottoms":      ["leg_shape", "rise", "waist_type", "skirt_construction"],
};

// ── Options by garment type (from attribute_extraction.yaml) ─────────────────

const COMMON_UNKNOWN = ["Unknown"];

const BOTTOMS_OPTIONS: Record<string, string[]> = {
  silhouette:        ["Skinny", "Slim", "Straight", "Athletic", "Relaxed", "Loose", "Oversized", "Tapered", "Cargo", "Jogger"],
  rise:              ["Low rise", "Mid rise (Regular)", "High rise", "Drop crotch"],
  leg_shape:         ["Straight leg", "Tapered leg", "Bootcut", "Flare", "Wide leg", "Cropped leg", "Elastic cuff (Jogger)"],
  waist_type:        ["Button fly", "Zipper fly", "Drawstring waist", "Elastic waist", "Belt loops", "Side adjusters", "Flat front", "Pleated front (Single or Double pleat)"],
  length:            ["Full length", "Ankle length", "Cropped", "Short (7\" or 9\" inseam)", "Stacked (extra long hem)"],
  pockets:           ["5-pocket (Jeans style)", "Chino/Slant pockets", "On-seam pockets (curved side entry)", "Side seam pockets", "Cargo pockets (side thigh)", "Back patch pockets", "Welt pockets (rear)", "Flap pockets", "Carpenter/Tool pockets", "Hidden zip pocket", "Coin/Watch pocket"],
  sleeves_type:      [],
  neck_line_type:    [],
  skirt_construction:[],
  back:              [],
};

const DRESSES_OPTIONS: Record<string, string[]> = {
  silhouette:        ["A-line", "Mermaid", "Trumpet", "Ball gown", "Fit and flare", "Slip", "Sheath", "Column", "Tea-length", "Empire", "Mini", "Midi", "High-low", "Drop-waist"],
  length:            ["Mini (above mid-thigh)", "Knee length", "Midi (mid-calf)", "Maxi (ankle length)", "Floor length"],
  sleeves_type:      ["Sleeveless", "Cap sleeve", "Short sleeve", "Elbow sleeve", "Three-quarter sleeve", "Long sleeve", "Puff sleeve", "Bell sleeve", "Bishop sleeve", "Flutter sleeve"],
  neck_line_type:    ["Crew / round", "V-neck", "Square neck", "Sweetheart", "Boat neck", "Halter", "Off-shoulder", "One shoulder", "Collared / shirt dress"],
  waist_type:        ["Natural waist", "Empire waist", "Drop waist", "Elastic waist", "Belted waist", "Smocked waist", "Corset waist"],
  skirt_construction:["Straight skirt", "Pleated skirt", "Tiered skirt", "Circle skirt", "Gathered skirt", "Asymmetric skirt", "Wrap skirt", "Ruffle skirt"],
  back:              ["Closed Back", "Low Back", "Backless", "V Back", "U Back", "Keyhole Back", "Racerback", "Crisscross Back", "Tie Back", "Button Back", "Corset / Lace Up", "Cut-Out Back"],
  rise:              [],
  leg_shape:         [],
};

const TOPS_OPTIONS: Record<string, string[]> = {
  silhouette:        ["Column", "Fitted", "Boxy", "A-Line", "Peplum", "Empire", "Wrap", "Tunic", "Cropped", "Oversized", "High-Low", "Asymmetrical", "Cape", "Smocked", "Babydoll"],
  length:            ["Cropped", "Waist-length", "Hip-length", "Low hip", "Tunic length", "Longline"],
  sleeves_type:      ["Sleeveless", "Cap sleeve", "Short sleeve", "Elbow sleeve", "Three-quarter sleeve", "Long sleeve", "Puff sleeve", "Bell sleeve", "Bishop sleeve", "Flutter sleeve", "Raglan sleeve", "Dolman sleeve", "Batwing sleeve", "Kimono sleeve", "Lantern sleeve", "Petal sleeve", "Slit sleeve", "Cold shoulder sleeve", "Off-shoulder sleeve", "Balloon sleeve"],
  neck_line_type:    ["Crew neck", "Round neck", "Scoop neck", "V-neck", "Deep V-neck", "Square neck", "Boat neck (Bateau)", "Sweetheart neck", "Halter neck", "Keyhole neck", "Mock neck", "Turtleneck", "Cowl neck", "Off-shoulder", "One-shoulder", "Asymmetrical neck", "Collared neck", "Peter Pan collar", "Mandarin collar", "Notch neck", "Henley neck"],
  waist_type:        ["Fitted waist", "Relaxed waist", "Empire waist", "Peplum waist", "Drop waist", "Blouson waist", "Elastic waist", "Drawstring waist", "Smocked waist", "Belted waist", "Gathered waist", "Cinched waist"],
  back:              ["Closed back", "Low back", "Backless", "V-back", "U-back", "Keyhole back", "Racerback", "Crisscross back", "Tie back", "Button back", "Corset/Lace-up back", "Cut-out back", "Sheer/back panel", "Peplum back", "Pleated back", "Open-back with straps"],
  skirt_construction:[],
  rise:              [],
  leg_shape:         [],
};

const TEES_OPTIONS: Record<string, string[]> = {
  silhouette:        ["Standard/Classic", "Slim Fit", "Boxy", "Relaxed", "Oversized", "A-Line", "Baby Tee", "Bodycon", "Straight", "Muscle"],
  length:            ["Super Crop", "Cropped", "Waist-length", "Hip-length", "Low hip", "Tunic length", "Longline"],
  sleeves_type:      ["Sleeveless", "Cap sleeve", "Short sleeve", "Elbow sleeve", "Three-quarter sleeve", "Long sleeve", "Drop shoulder", "Rolled/Cuffed sleeve", "Raglan sleeve", "Flutter sleeve", "Puff sleeve"],
  neck_line_type:    ["Crew neck", "Round neck", "Scoop neck", "V-neck", "Deep V-neck", "Square neck", "Boat neck (Bateau)", "Sweetheart neck", "Halter neck", "Keyhole neck", "Mock neck", "Turtleneck", "Cowl neck", "Henley neck", "Notch neck", "Off-shoulder"],
  waist_type:        ["Relaxed waist", "Fitted waist", "Straight waist", "Drawstring waist", "Elastic waist", "Knotted/Tie-waist", "Cinched waist"],
  back:              ["Closed back", "Low back", "V-back", "U-back", "Keyhole back", "Racerback", "Crisscross back", "Tie back", "Cut-out back", "Sheer panel", "Open-back with straps"],
  skirt_construction:[],
  rise:              [],
  leg_shape:         [],
};

// ── Dept-type resolution ─────────────────────────────────────────────────────

type DeptType = "bottoms" | "dresses" | "tops" | "tees";

const DEPT_OPTIONS: Record<DeptType, Record<string, string[]>> = {
  bottoms: BOTTOMS_OPTIONS,
  dresses: DRESSES_OPTIONS,
  tops:    TOPS_OPTIONS,
  tees:    TEES_OPTIONS,
};

/** Map a predicted department string to one of the four analysis types. */
function getDeptType(dept: string): DeptType {
  const d = dept.toLowerCase();
  if (d.includes("pant") || d.includes("short") || d.includes("bottom") || d.includes("denim")) return "bottoms";
  if (d.includes("dress") || d.includes("skirt")) return "dresses";
  if (d.includes("tee") || d.includes("knit") || d.includes("graphic")) return "tees";
  // fleece, top, blouse, shirt, jacket, vest → tops
  return "tops";
}

/**
 * Returns the valid dropdown options for a given (department, attribute) pair.
 * Returns an empty array for attributes marked NA in that department type.
 */
export function getAttrOptions(dept: string, feature: string): string[] {
  const type = getDeptType(dept);
  return DEPT_OPTIONS[type][feature] ?? COMMON_UNKNOWN;
}

// ── Formatting helpers ───────────────────────────────────────────────────────

const COUNT_KEYS = new Set(["panels_count", "pockets_count", "seam_count"]);

/**
 * Formats a raw attribute value for display.
 * Counts are shown as plain numbers; strings are title-cased.
 */
export function formatAttrValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return "Unknown";
  if (typeof value === "number") {
    if (COUNT_KEYS.has(key)) return String(value);
    if (value > 0 && value < 1) return `${Math.round(value * 100)}%`;
    return String(value);
  }
  if (typeof value === "string") {
    if (value === "" || value.toLowerCase() === "unknown" || value === "N/A" || value === "NA") return "Unknown";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return String(value);
}

/**
 * Returns true when the value conveys no useful information
 * (null, empty, "unknown", "N/A", "NA", or zero for count keys).
 */
export function isUnknownValue(key: string, value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    return lower === "unknown" || lower === "n/a" || lower === "na" || value === "";
  }
  if (typeof value === "number" && COUNT_KEYS.has(key)) return value === 0;
  return false;
}
