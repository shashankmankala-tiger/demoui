/**
 * White-label demo route — computes re-estimated cost from attribute SHAP values.
 * Cost = DEMO_BASE_COST + sum of SHAP values for each current attribute.
 */

import { NextRequest, NextResponse } from "next/server";
import type { FeedbackPredictRequest, FeedbackPredictResponse } from "@/types/api.types";
import { DEMO_SHAP, DEMO_BASE_COSTS, DEMO_CATEGORY_BASELINES, DEMO_BASE_COST, DEMO_CATEGORY_BASELINE } from "@/config/demoShap";

const DEMO_SIMILAR_IMAGES = [
  "/new_set/sketch1_similar1_normalized.jpg",
  "/new_set/sketch1_similar2_normalized.jpg",
  "/new_set/sketch1_similar3_normalized.jpg",
  "/new_set/sketch1_similar4_normalized.png",
  "/new_set/sketch1_similar5_normalized.jpg",
  "/new_set/sketch1_similar6_normalized.jpg",
];
const DEMO_SIMILAR_COSTS   = [9.50, 11.58, 11.70, 5.91, 10.30, 13.27];
const DEMO_SIMILAR_SCORES  = [0.99, 0.98, 0.95, 0.90, 0.89, 0.87];
const DEMO_SIMILAR_IDS     = ["SK-579868", "SK-705705", "SK-863612", "SK-863613", "SK-485133", "SK-705471"];

export async function POST(req: NextRequest) {
  const body = (await req.json()) as FeedbackPredictRequest;

  const dept = body.department ?? "W DRESSES & SKIRTS";
  const attrs = body.attributes ?? {};
  const deptShap = DEMO_SHAP[dept] ?? {};
  const baseCost = DEMO_BASE_COSTS[dept] ?? DEMO_BASE_COST;
  const categoryBaseline = DEMO_CATEGORY_BASELINES[dept] ?? DEMO_CATEGORY_BASELINE;

  // Sum SHAP impacts for all current attribute values
  let shapSum = 0;
  for (const [feature, featureShap] of Object.entries(deptShap)) {
    const rawVal = attrs[feature];
    if (rawVal == null) continue;
    const valKey = String(rawVal);
    const impact = featureShap.values[valKey] ?? 0;
    shapSum += impact;
  }

  const newCost = Math.round((baseCost + shapSum) * 100) / 100;

  const demo: FeedbackPredictResponse = {
    cost:                   newCost,
    cost_explanation:       null,
    baseline:               categoryBaseline,
    pred_class_1:           "SS DRESSES",
    pred_subclass_1:        "SHIFT",
    class_top3:             ["SS DRESSES", "LS DRESSES", "SKIRTS"],
    subclass_top3:          ["SHIFT", "SWING", "SHEATH"],
    similarity_scores:      DEMO_SIMILAR_SCORES,
    sketch_ids:             DEMO_SIMILAR_IDS,
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
