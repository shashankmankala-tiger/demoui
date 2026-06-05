import type { PredictFullResponse } from "@/types/api.types";

export interface DemoDataset {
  sketchFile: string;   // path under /public
  sketchId:   string;   // ID printed on the sketch image (e.g. "C117295602")
  response:   (hasRd: boolean) => PredictFullResponse;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function buildSimilars(prefix: string, exts: string[]) {
  return exts.map((ext, i) => `/new_set/${prefix}_similar${i + 1}_normalized.${ext}`);
}

// ── Dataset 1 — Shirt dress (W DRESSES & SKIRTS) ──────────────────────────────

const S1_IMAGES  = buildSimilars("sketch1", ["jpg","jpg","jpg","png","jpg","jpg"]);
const S1_COSTS   = [9.50, 11.58, 11.70, 5.91, 10.30, 13.27];
const S1_SCORES  = [0.99, 0.98, 0.95, 0.90, 0.89, 0.87];
const S1_IDS     = ["SK-579868","SK-705705","SK-863612","SK-863613","SK-485133","SK-705471"];
const S1_CLASSES = ["SS DRESSES","SS DRESSES","SS DRESSES","SS DRESSES","LS DRESSES","SS DRESSES"];
const S1_SUBS    = ["SHIFT","SWING","SWING","SHIFT","SHIFT","SHIFT"];

function sketch1Response(hasRd: boolean): PredictFullResponse {
  const cost = hasRd ? Math.round(9.03 * 1.05 * 100) / 100 : 9.03;
  return {
    results: [[{
      cost,
      similarity_scores:      S1_SCORES,
      sketch_ids:             S1_IDS,
      style_numbers:          ["579868","705705","863612","863613","485133","705471"],
      similar_base_encodings: S1_IMAGES,
      match_costs:            S1_COSTS,
      match_departments:      Array(6).fill("W DRESSES & SKIRTS"),
      match_classes:          S1_CLASSES,
      match_subclasses:       S1_SUBS,
      llm_attributes: {
        silhouette: "Tunic", length: "Tunic length", sleeves_type: "Short sleeve",
        neck_line_type: "Collared neck", waist_type: "Relaxed waist",
        skirt_construction: "", back: "Pleated back",
        rise: "", leg_shape: "", pockets: "Unknown",
        panels_count: 10, seam_count: 14, pockets_count: 0,
      },
      cost_explanation: {
        predicted_cost: cost, category_baseline: 8.70,
        deviation: Math.abs(Math.round((cost - 8.70) * 100) / 100),
        direction: cost >= 8.70 ? "above" : "below", coverage_pct: 91.0,
        drivers: [
          { group: "Garment Shape & Fit", net_impact: -0.32, features: [
            { name: "waist_type", display_name: "Waist Type", impact: -0.18 },
            { name: "length",     display_name: "Length",     impact: -0.09 },
            { name: "back",       display_name: "Back Style", impact: -0.05 },
          ]},
          { group: "Sleeves & Neckline", net_impact: 0.23, features: [
            { name: "neck_line_type", display_name: "Neckline",    impact: 0.14 },
            { name: "sleeves_type",   display_name: "Sleeve Type", impact: 0.09 },
          ]},
          { group: "Bottoms Detailing", net_impact: -0.21, features: [
            { name: "skirt_construction", display_name: "Skirt Construction", impact: -0.12 },
            { name: "rise",               display_name: "Rise",               impact: -0.05 },
          ]},
          { group: "Construction Complexity", net_impact: 0.10, features: [
            { name: "panels_count",  display_name: "Panel Count",  impact: 0.06 },
            { name: "pockets_count", display_name: "Pocket Count", impact: 0.04 },
          ]},
        ],
      },
      normalized_image: "/new_set/sketch1_normalized.png",
    }]],
    metadata: [{
      predicted_department: "W DRESSES & SKIRTS", dept_score: 0.94,
      class_top3: ["SS DRESSES","LS DRESSES","SKIRTS"], class_scores: [0.78,0.14,0.08],
      subclass_top3: ["SHIFT","SWING","SHEATH"], subclass_scores: [0.65,0.22,0.13],
      query_summary: null,
      subclass_cost_context: { label: "SHIFT",      min: 5.90, max: 13.30 },
      class_cost_context:    { label: "SS DRESSES", min: 5.50, max: 14.00 },
      model_version: "demo@2026-06-04", notes: null,
      input_type: hasRd ? "sketch_and_rd" : "sketch",
      graphics_pipeline_mode: "non_graphics", graphics_note: null,
      errors: { pipeline: null, cost: null, similarity: null, normalization: null },
      cost_explanation: null,
      execution_time: { total_s: 11.8, gemini_s: 7.4, cost_pred_s: 2.3, similarity_s: 1.6 },
    }],
  };
}

// ── Dataset 2 — Cropped fleece pullover (WOMENS FLEECE) ───────────────────────

const S2_IMAGES  = buildSimilars("sketch2", ["jpg","jpg","jpg","png","jpg","jpg"]);
const S2_COSTS   = [6.80, 7.45, 7.10, 6.95, 7.30, 6.60];
const S2_SCORES  = [0.96, 0.93, 0.91, 0.88, 0.86, 0.83];
const S2_IDS     = ["SK-102","SK-103","SK-104","SK-105","SK-106","SK-107"];
const S2_CLASSES = Array(6).fill("JACKET");
const S2_SUBS    = ["BOMBER","BOMBER","TRACK JACKET","BOMBER","WINDBREAKER","BOMBER"];

function sketch2Response(hasRd: boolean): PredictFullResponse {
  const cost = hasRd ? Math.round(7.24 * 1.05 * 100) / 100 : 7.24;
  return {
    results: [[{
      cost,
      similarity_scores:      S2_SCORES,
      sketch_ids:             S2_IDS,
      style_numbers:          ["100102","100103","100104","100105","100106","100107"],
      similar_base_encodings: S2_IMAGES,
      match_costs:            S2_COSTS,
      match_departments:      Array(6).fill("WOMENS FLEECE"),
      match_classes:          S2_CLASSES,
      match_subclasses:       S2_SUBS,
      llm_attributes: {
        silhouette: "Boxy", length: "Waist-length", sleeves_type: "Long sleeve",
        neck_line_type: "Mock neck", waist_type: "Elastic waist",
        skirt_construction: "", back: "Closed back",
        rise: "", leg_shape: "", pockets: "Flap pockets",
        panels_count: 8, seam_count: 12, pockets_count: 2,
      },
      cost_explanation: {
        predicted_cost: cost, category_baseline: 6.90,
        deviation: Math.abs(Math.round((cost - 6.90) * 100) / 100),
        direction: cost >= 6.90 ? "above" : "below", coverage_pct: 88.5,
        drivers: [
          { group: "Construction", net_impact: 0.43, features: [
            { name: "panels_count", display_name: "Panel Count", impact: 0.25 },
            { name: "seam_count",   display_name: "Seam Count",  impact: 0.18 },
          ]},
          { group: "Shape & fit", net_impact: -0.18, features: [
            { name: "length",       display_name: "Length",  impact: -0.10 },
            { name: "sleeves_type", display_name: "Sleeves", impact: -0.08 },
          ]},
          { group: "Bottoms", net_impact: 0.09, features: [
            { name: "waist_type", display_name: "Waist Type", impact: 0.09 },
          ]},
        ],
      },
      normalized_image: "/new_set/sketch2_normalized.png",
    }]],
    metadata: [{
      predicted_department: "WOMENS FLEECE", dept_score: 0.94,
      class_top3: ["JACKET","VEST","HOODIE"], class_scores: [0.78,0.14,0.08],
      subclass_top3: ["BOMBER","TRACK JACKET","WINDBREAKER"], subclass_scores: [0.65,0.22,0.13],
      query_summary: null,
      subclass_cost_context: { label: "BOMBER",  min: 6.10, max: 8.80 },
      class_cost_context:    { label: "JACKET",  min: 5.70, max: 9.40 },
      model_version: "demo@2026-06-04", notes: null,
      input_type: hasRd ? "sketch_and_rd" : "sketch",
      graphics_pipeline_mode: "non_graphics", graphics_note: null,
      errors: { pipeline: null, cost: null, similarity: null, normalization: null },
      cost_explanation: null,
      execution_time: { total_s: 11.8, gemini_s: 7.4, cost_pred_s: 2.3, similarity_s: 1.6 },
    }],
  };
}

export const DEMO_DATASETS: DemoDataset[] = [
  { sketchFile: "new_set/sketch1.png", sketchId: "C117295602", response: sketch1Response },
  { sketchFile: "new_set/sketch2.png", sketchId: "C149538842", response: sketch2Response },
];
