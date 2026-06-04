/**
 * White-label demo route — no backend call.
 * Returns fully mocked prediction data:
 *   - normalized_sketch5.png as the normalised sketch
 *   - sketch2–5 as similar styles with demo costs
 *   - Realistic cost + explanation data
 */

import { NextRequest, NextResponse } from "next/server";
import type { PredictFullResponse } from "@/types/api.types";

const DEMO_SIMILAR_IMAGES = ["/sketch2.jpg", "/sketch3.jpg", "/sketch4.jpg", "/sketch5.jpg"];
const DEMO_SIMILAR_COSTS  = [6.80, 7.45, 7.10, 6.95];

const DEMO_RESPONSE: PredictFullResponse = {
  results: [[{
    cost: 7.24,
    similarity_scores: [0.94, 0.91, 0.88, 0.85],
    sketch_ids:        ["SK-002", "SK-003", "SK-004", "SK-005"],
    style_numbers:     ["100002", "100003", "100004", "100005"],
    similar_base_encodings: DEMO_SIMILAR_IMAGES,
    match_costs:       DEMO_SIMILAR_COSTS,
    match_departments: ["WOMENS FLEECE", "WOMENS FLEECE", "WOMENS FLEECE", "WOMENS FLEECE"],
    match_classes:     ["JACKET", "JACKET", "JACKET", "JACKET"],
    match_subclasses:  ["BOMBER", "BOMBER", "TRACK JACKET", "BOMBER"],
    llm_attributes: {
      silhouette:         "Boxy",
      length:             "Waist-length",
      sleeves_type:       "Long sleeve",
      neck_line_type:     "Mock neck",
      waist_type:         "Elastic waist",
      skirt_construction: "",
      back:               "Closed back",
      rise:               "",
      leg_shape:          "",
      pockets:            "Flap pockets",
      panels_count:       8,
      seam_count:         12,
      pockets_count:      2,
    },
    cost_explanation: {
      predicted_cost:    7.24,
      category_baseline: 6.90,
      deviation:         0.34,
      direction:         "above",
      coverage_pct:      88.5,
      drivers: [
        {
          group: "Construction",
          net_impact: 0.43,
          features: [
            { name: "panels_count",  display_name: "Panel Count",  impact: 0.25 },
            { name: "seam_count",    display_name: "Seam Count",   impact: 0.18 },
          ],
        },
        {
          group: "Shape & fit",
          net_impact: -0.18,
          features: [
            { name: "length",        display_name: "Length",       impact: -0.10 },
            { name: "sleeves_type",  display_name: "Sleeves",      impact: -0.08 },
          ],
        },
        {
          group: "Bottoms",
          net_impact: 0.09,
          features: [
            { name: "waist_type",    display_name: "Waist Type",   impact: 0.09 },
          ],
        },
      ],
    },
    normalized_image: "/normalized_sketch5.png",
  }]],
  metadata: [{
    predicted_department:  "WOMENS FLEECE",
    dept_score:            0.94,
    class_top3:            ["JACKET", "VEST", "HOODIE"],
    class_scores:          [0.78, 0.14, 0.08],
    subclass_top3:         ["BOMBER", "TRACK JACKET", "WINDBREAKER"],
    subclass_scores:       [0.65, 0.22, 0.13],
    query_summary:         null,
    subclass_cost_context: { label: "BOMBER",  min: 6.10, max: 8.80 },
    class_cost_context:    { label: "JACKET",  min: 5.70, max: 9.40 },
    model_version:         "demo@2026-06-04",
    notes:                 null,
    input_type:            "sketch",
    graphics_pipeline_mode: "non_graphics",
    graphics_note:         null,
    errors: { pipeline: null, cost: null, similarity: null, normalization: null },
    cost_explanation: null,
    execution_time: { total_s: 11.8, gemini_s: 7.4, cost_pred_s: 2.3, similarity_s: 1.6 },
  }],
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const hasRd = !!body?.rd_numbers?.[0]?.[0];

  if (!hasRd) {
    return NextResponse.json(DEMO_RESPONSE);
  }

  // With RD: apply +5% to cost and cost_explanation
  const baseCost = 7.24;
  const rdCost   = Math.round(baseCost * 1.05 * 100) / 100;
  const rdDeviation = Math.round((rdCost - 6.90) * 100) / 100;

  const rdResponse: PredictFullResponse = {
    ...DEMO_RESPONSE,
    results: [[{
      ...DEMO_RESPONSE.results[0][0],
      cost: rdCost,
      cost_explanation: {
        ...DEMO_RESPONSE.results[0][0].cost_explanation!,
        predicted_cost: rdCost,
        deviation:      rdDeviation,
        direction:      "above",
      },
    }]],
    metadata: [{
      ...DEMO_RESPONSE.metadata[0],
      input_type: "sketch_and_rd",
    }],
  };

  return NextResponse.json(rdResponse);
}
