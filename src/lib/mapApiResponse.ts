/**
 * Maps a raw PredictFullResponse from POST /v2/predict/analyze into the
 * application-level StyleRecord + MetadataBundle used by the store.
 */

import type {
  Driver,
  DriverGroup,
  StyleRecord,
  MetadataBundle,
  PredictFullResponse,
  PeerStyle,
} from "@/types/api.types";
import { ATTR_LABELS, ATTR_GROUPS, VALID_ATTR_KEYS, normalizeAttrKey, formatAttrValue } from "./attrLabels";
import { DEMO_SHAP } from "@/config/demoShap";

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Builds a flat Driver array from llm_attributes.
 * shap is kept 0 so recomputeCost never updates finalCost on attribute changes.
 * Δ COST deltas are computed in the UI by comparing shapLookup values directly.
 */
function buildDrivers(llmAttrs: Record<string, unknown>, _dept: string): Driver[] {
  return Object.entries(llmAttrs)
    .map(([rawKey, value]) => ({ key: normalizeAttrKey(rawKey), value }))
    .filter(({ key }) => VALID_ATTR_KEYS.has(key))
    .map(({ key, value }) => ({
      feature: key,
      label: ATTR_LABELS[key] ?? key,
      value_raw: typeof value === "string" || typeof value === "number" ? value : String(value ?? ""),
      value_display: formatAttrValue(key, value),
      shap: 0,
    }));
}

/**
 * Builds DriverGroup[] from the flat drivers using ATTR_GROUPS definitions.
 */
function buildGroups(drivers: Driver[]): DriverGroup[] {
  const driverMap = new Map(drivers.map((d) => [d.feature, d]));

  return Object.entries(ATTR_GROUPS).map(([groupName, keys]) => {
    const details = keys
      .map((k) => driverMap.get(k))
      .filter((d): d is Driver => d !== undefined);

    const top_value_summary = details
      .slice(0, 2)
      .map((d) => `${d.label}: ${d.value_display}`)
      .join(", ");

    return {
      group: groupName,
      shap: 0,
      top_value_summary,
      details,
    };
  });
}

/**
 * Zips parallel arrays from the result item into PeerStyle objects.
 * Entries with no image are skipped.
 */
function buildPeerPool(
  dept: string,
  sketchIds: (string | null)[] | null,
  styleNumbers: (string | null)[] | null,
  encodings: (string | null)[] | null,
  costs: (number | null)[] | null,
  scores: number[] | null,
  departments: (string | null)[] | null,
  classes: (string | null)[] | null,
  subclasses: (string | null)[] | null,
): PeerStyle[] {
  if (!sketchIds?.length) return [];

  return sketchIds.reduce<PeerStyle[]>((acc, sketchId, i) => {
    if (!sketchId) return acc;
    const imageUrl = encodings?.[i] ?? "";
    if (!imageUrl) return acc;

    acc.push({
      sketch_id: sketchId,
      style_number: Number(styleNumbers?.[i] ?? 0),
      department: departments?.[i] ?? dept,
      class: classes?.[i] ?? "",
      subclass: subclasses?.[i] ?? "",
      cost: costs?.[i] ?? 0,
      attrs: {},
      image_url: imageUrl,
      similarity_score: scores?.[i] ?? 0,
      similarity: scores?.[i] ?? 0,
    });
    return acc;
  }, []);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Converts the raw /v2/predict/analyze response into the application's
 * StyleRecord, MetadataBundle, and the normalized image data URI.
 *
 * @param response - Raw API response from predictStyle()
 * @returns { record, metadata, normalizedImageDataUrl }
 */
export function mapApiResponse(response: PredictFullResponse): {
  record: StyleRecord;
  metadata: MetadataBundle;
  normalizedImageDataUrl: string | null;
  normalizationError: string | null;
} {
  const item = response.results[0][0];
  const meta = response.metadata[0];

  const llmAttrs = item.llm_attributes ?? {};
  const dept = meta.predicted_department ?? "";

  const drivers = buildDrivers(llmAttrs, dept);
  const groups = buildGroups(drivers);

  // errors object replaced the flat cost_error / similarity_error / error fields
  const errors = meta.errors ?? { pipeline: null, cost: null, similarity: null };

  const record: StyleRecord = {
    style_number: 0,
    department: dept,
    class: meta.class_top3[0] ?? "",
    subclass: meta.subclass_top3[0] ?? "",
    season: 0,
    y_pred: item.cost ?? 0,
    baseline: item.cost ?? 0,
    drivers,
    groups,
    llmAttributes: llmAttrs,
    modelVersion: meta.model_version,
    pipelineNote: meta.notes ?? null,
    deptScore: meta.dept_score,
    classTaxo: meta.class_top3,
    subclassTaxo: meta.subclass_top3,
    inputType: meta.input_type,
    graphicsPipelineMode: meta.graphics_pipeline_mode ?? null,
    graphicsNote: meta.graphics_note ?? null,
    costExplanationData: meta.cost_explanation ?? item.cost_explanation ?? null,
    costExplanation: null,
    subclassCostContext: meta.subclass_cost_context ?? null,
    classCostContext: meta.class_cost_context ?? null,
    costError: errors.cost ?? null,
    similarityError: errors.similarity ?? null,
    apiError: errors.pipeline ?? null,
  };

  const peerPool = buildPeerPool(
    dept,
    item.sketch_ids,
    item.style_numbers,
    item.similar_base_encodings,
    item.match_costs,
    item.similarity_scores,
    item.match_departments,
    item.match_classes,
    item.match_subclasses,
  );

  const nonSummaryKeys = Object.keys(llmAttrs).filter((k) => k !== "summary");

  const metadata: MetadataBundle = {
    deptBaseline: { [dept]: record.y_pred },
    deptFeatures: { [dept]: nonSummaryKeys },
    shapLookup: DEMO_SHAP[dept] ? { [dept]: DEMO_SHAP[dept] } : (DEMO_SHAP["WOMENS FLEECE"] ? { "WOMENS FLEECE": DEMO_SHAP["WOMENS FLEECE"] } : {}),
    peerPool,
  };

  return {
    record,
    metadata,
    normalizedImageDataUrl: item.normalized_image ?? null,
    normalizationError: errors.normalization ?? null,
  };
}
