/**
 * White-label demo route — computes re-estimated cost from attribute SHAP values.
 * Cost = DEMO_BASE_COST + sum of SHAP values for each current attribute.
 */

import { NextRequest, NextResponse } from "next/server";
import type { FeedbackPredictRequest, FeedbackPredictResponse } from "@/types/api.types";
import { DEMO_SHAP, DEMO_BASE_COST, DEMO_CATEGORY_BASELINE } from "@/config/demoShap";

const DEMO_SIMILAR_IMAGES = ["/sketch2.jpg", "/sketch3.jpg", "/sketch4.jpg", "/sketch5.jpg"];
const DEMO_SIMILAR_COSTS  = [6.80, 7.45, 7.10, 6.95];

export async function POST(req: NextRequest) {
  const body = (await req.json()) as FeedbackPredictRequest;

  const dept = body.department ?? "WOMENS FLEECE";
  const attrs = body.attributes ?? {};
  const deptShap = DEMO_SHAP[dept] ?? {};

  // Sum SHAP impacts for all current attribute values
  let shapSum = 0;
  for (const [feature, featureShap] of Object.entries(deptShap)) {
    const rawVal = attrs[feature];
    if (rawVal == null) continue;
    const valKey = String(rawVal);
    const impact = featureShap.values[valKey] ?? 0;
    shapSum += impact;
  }

  const newCost = Math.round((DEMO_BASE_COST + shapSum) * 100) / 100;

  const demo: FeedbackPredictResponse = {
    cost:                   newCost,
    cost_explanation:       null,
    baseline:               DEMO_CATEGORY_BASELINE,
    pred_class_1:           "JACKET",
    pred_subclass_1:        "BOMBER",
    class_top3:             ["JACKET", "VEST", "HOODIE"],
    subclass_top3:          ["BOMBER", "TRACK JACKET", "WINDBREAKER"],
    similarity_scores:      [0.94, 0.91, 0.88, 0.85],
    sketch_ids:             ["SK-002", "SK-003", "SK-004", "SK-005"],
    similar_base_encodings: DEMO_SIMILAR_IMAGES,
    match_costs:            DEMO_SIMILAR_COSTS,
    classifier_error:       null,
    cost_error:             null,
    similarity_error:       null,
    model_version:          "demo@2026-06-04",
    pipeline_note:          null,
    execution_time:         { total_s: 0.8 },
  };

  return NextResponse.json(demo);
}
