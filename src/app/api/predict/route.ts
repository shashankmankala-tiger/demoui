/**
 * White-label demo route — no backend call.
 * Serves new_set sketch data: W DRESSES & SKIRTS / SHIFT @ $9.03
 */

import { NextRequest, NextResponse } from "next/server";
import type { PredictFullResponse } from "@/types/api.types";

const SIMILAR_IMAGES = [
  "/new_set/sketch1_similar1_normalized.jpg",
  "/new_set/sketch1_similar2_normalized.jpg",
  "/new_set/sketch1_similar3_normalized.jpg",
  "/new_set/sketch1_similar4_normalized.png",
  "/new_set/sketch1_similar5_normalized.jpg",
  "/new_set/sketch1_similar6_normalized.jpg",
];

const SIMILAR_COSTS        = [9.50, 11.58, 11.70, 5.91, 10.30, 13.27];
const SIMILAR_SCORES       = [0.99, 0.98, 0.95, 0.90, 0.89, 0.87];
const SIMILAR_SKETCH_IDS   = ["SK-579868", "SK-705705", "SK-863612", "SK-863613", "SK-485133", "SK-705471"];
const SIMILAR_STYLE_NOS    = ["579868", "705705", "863612", "863613", "485133", "705471"];
const SIMILAR_DEPARTMENTS  = ["W DRESSES & SKIRTS", "W DRESSES & SKIRTS", "W DRESSES & SKIRTS", "W DRESSES & SKIRTS", "W DRESSES & SKIRTS", "W DRESSES & SKIRTS"];
const SIMILAR_CLASSES      = ["SS DRESSES", "SS DRESSES", "SS DRESSES", "SS DRESSES", "LS DRESSES", "SS DRESSES"];
const SIMILAR_SUBCLASSES   = ["SHIFT", "SWING", "SWING", "SHIFT", "SHIFT", "SHIFT"];

const BASE_COST = 9.03;

function buildResponse(cost: number, inputType: "sketch" | "sketch_and_rd"): PredictFullResponse {
  return {
    results: [[{
      cost,
      similarity_scores:      SIMILAR_SCORES,
      sketch_ids:             SIMILAR_SKETCH_IDS,
      style_numbers:          SIMILAR_STYLE_NOS,
      similar_base_encodings: SIMILAR_IMAGES,
      match_costs:            SIMILAR_COSTS,
      match_departments:      SIMILAR_DEPARTMENTS,
      match_classes:          SIMILAR_CLASSES,
      match_subclasses:       SIMILAR_SUBCLASSES,
      llm_attributes: {
        silhouette:         "Tunic",
        length:             "Tunic length",
        sleeves_type:       "Short sleeve",
        neck_line_type:     "Collared neck",
        waist_type:         "Relaxed waist",
        skirt_construction: "",
        back:               "Pleated back",
        rise:               "",
        leg_shape:          "",
        pockets:            "Unknown",
        panels_count:       10,
        seam_count:         14,
        pockets_count:      0,
      },
      cost_explanation: {
        predicted_cost:    cost,
        category_baseline: BASE_COST,
        deviation:         Math.abs(Math.round((cost - BASE_COST) * 100) / 100),
        direction:         cost >= BASE_COST ? "above" : "below",
        coverage_pct:      91.0,
        drivers: [
          {
            group: "Garment Shape & Fit",
            net_impact: -0.32,
            features: [
              { name: "waist_type", display_name: "Waist Type",       impact: -0.18 },
              { name: "length",     display_name: "Length",           impact: -0.09 },
              { name: "back",       display_name: "Back Style",       impact: -0.05 },
            ],
          },
          {
            group: "Sleeves & Neckline",
            net_impact: 0.23,
            features: [
              { name: "neck_line_type", display_name: "Neckline",    impact:  0.14 },
              { name: "sleeves_type",   display_name: "Sleeve Type", impact:  0.09 },
            ],
          },
          {
            group: "Bottoms Detailing",
            net_impact: -0.21,
            features: [
              { name: "skirt_construction", display_name: "Skirt Construction", impact: -0.12 },
              { name: "leg_shape",          display_name: "Leg Shape",          impact: -0.05 },
              { name: "rise",               display_name: "Rise",               impact: -0.04 },
            ],
          },
          {
            group: "Construction Complexity",
            net_impact: 0.10,
            features: [
              { name: "panels_count",  display_name: "Panel Count",   impact:  0.06 },
              { name: "pockets",       display_name: "Pocket Style",  impact:  0.02 },
              { name: "pockets_count", display_name: "Pocket Count",  impact:  0.02 },
            ],
          },
        ],
      },
      normalized_image: "/new_set/sketch1_normalized.png",
    }]],
    metadata: [{
      predicted_department:  "W DRESSES & SKIRTS",
      dept_score:            0.94,
      class_top3:            ["SS DRESSES", "LS DRESSES", "SKIRTS"],
      class_scores:          [0.78, 0.14, 0.08],
      subclass_top3:         ["SHIFT", "SWING", "SHEATH"],
      subclass_scores:       [0.65, 0.22, 0.13],
      query_summary:         null,
      subclass_cost_context: { label: "SHIFT",      min: 5.90,  max: 13.30 },
      class_cost_context:    { label: "SS DRESSES", min: 5.50,  max: 14.00 },
      model_version:         "demo@2026-06-04",
      notes:                 null,
      input_type:            inputType,
      graphics_pipeline_mode: "non_graphics",
      graphics_note:         null,
      errors: { pipeline: null, cost: null, similarity: null, normalization: null },
      cost_explanation: null,
      execution_time: { total_s: 11.8, gemini_s: 7.4, cost_pred_s: 2.3, similarity_s: 1.6 },
    }],
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const hasRd = !!body?.rd_numbers?.[0]?.[0];
  const cost  = hasRd ? Math.round(BASE_COST * 1.05 * 100) / 100 : BASE_COST;
  return NextResponse.json(buildResponse(cost, hasRd ? "sketch_and_rd" : "sketch"));
}
