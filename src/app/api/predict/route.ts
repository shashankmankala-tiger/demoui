/**
 * White-label demo route — no backend call.
 * Identifies the sketch by style ID (OCR-extracted client-side) and returns
 * the matching dataset.
 */

import { NextRequest, NextResponse } from "next/server";
import { DEMO_DATASETS } from "@/config/demoDatasets";

function detectDataset(sketchId: string | undefined): number {
  if (!sketchId) return 0;
  const idx = DEMO_DATASETS.findIndex(
    (ds) => ds.sketchId.toLowerCase() === sketchId.toLowerCase()
  );
  return idx >= 0 ? idx : 0;
}

export async function POST(req: NextRequest) {
  const body       = await req.json();
  const hasRd      = !!body?.rd_numbers?.[0]?.[0];
  const sketchId   = body?._sketchId as string | undefined;
  const topN       = typeof body?.topn === "number" ? body.topn : 6;
  const datasetIdx = detectDataset(sketchId);
  const full       = DEMO_DATASETS[datasetIdx].response(hasRd);

  // Trim similar styles to the requested topN
  const trimmed = {
    ...full,
    results: full.results.map((queryResults) =>
      queryResults.map((item) => ({
        ...item,
        similarity_scores:      item.similarity_scores?.slice(0, topN) ?? null,
        sketch_ids:             item.sketch_ids?.slice(0, topN) ?? null,
        style_numbers:          item.style_numbers?.slice(0, topN) ?? null,
        similar_base_encodings: item.similar_base_encodings?.slice(0, topN) ?? null,
        match_costs:            item.match_costs?.slice(0, topN) ?? null,
        match_departments:      item.match_departments?.slice(0, topN) ?? null,
        match_classes:          item.match_classes?.slice(0, topN) ?? null,
        match_subclasses:       item.match_subclasses?.slice(0, topN) ?? null,
      }))
    ),
  };

  return NextResponse.json(trimmed);
}
