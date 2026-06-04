// API response and request shapes matching the backend contract

export interface Driver {
  feature: string;
  label: string;
  value_raw: string | number;
  value_display: string;
  shap: number;
}

export type GroupDetail = Driver;

export interface DriverGroup {
  group: string;
  shap: number;
  top_value_summary: string;
  details: GroupDetail[];
}

// ── Cost explanation JSON (returned by backend SHAP pipeline) ─────────────────

export interface CostExplanationFeature {
  name: string;
  display_name: string;
  impact: number;
}

export interface CostExplanationDriver {
  group: string;
  net_impact: number;
  features: CostExplanationFeature[];
}

export interface CostExplanationData {
  predicted_cost: number;
  category_baseline: number;
  deviation: number;
  direction: "above" | "below";
  drivers: CostExplanationDriver[];
  coverage_pct: number;
}

/** Cost range context for a garment class or subclass */
export interface CostContextRange {
  label: string;
  min: number;
  max: number;
}

export interface StyleRecord {
  style_number: number;
  department: string;
  class: string;
  subclass: string;
  season: number;
  y_pred: number;
  baseline: number;
  drivers: Driver[];
  groups: DriverGroup[];
  /** Raw LLM-extracted attributes from the backend */
  llmAttributes: Record<string, unknown>;
  /** Model version string from metadata */
  modelVersion: string;
  /** Pipeline notes string (may be null) */
  pipelineNote: string | null;
  /** Department classification confidence score (0-1) */
  deptScore: number;
  /** Top 3 class predictions */
  classTaxo: string[];
  /** Top 3 subclass predictions */
  subclassTaxo: string[];
  /** Input type used for prediction */
  inputType: string;
  /** Graphics pipeline mode from metadata (e.g. "graphics", "non_graphics") */
  graphicsPipelineMode: string | null;
  /** Human-readable note from the graphics pipeline */
  graphicsNote: string | null;
  /** Structured cost explanation from the SHAP pipeline (preferred) */
  costExplanationData: CostExplanationData | null;
  /** Legacy string cost explanation — kept for backwards-compat fallback only */
  costExplanation: string | null;
  /** Typical cost range for the predicted subclass (p25–p75 of corpus) */
  subclassCostContext: CostContextRange | null;
  /** Typical cost range for the predicted class (p25–p75 of corpus) */
  classCostContext: CostContextRange | null;
  /** Error from the cost prediction sub-step, if any */
  costError: string | null;
  /** Error from the similarity search sub-step, if any */
  similarityError: string | null;
  /** Top-level pipeline error, if any */
  apiError: string | null;
  // eval-only fields (not required in production)
  y_true?: number;
  error?: number;
  abs_pct_error?: number;
}

/** @deprecated Use PredictFullResponse instead */
export interface PredictResponse {
  record: StyleRecord;
  predicted_department: string;
  predicted_confidence: number;
}

export interface PeerStyle {
  style_number: number;
  department: string;
  class: string;
  subclass: string;
  cost: number;
  attrs: Record<string, string>;
  similarity?: number;
  /** Sketch ID from similarity results */
  sketch_id: string;
  /** Data URI for the similar style's image */
  image_url: string;
  /** Similarity score (0-1) */
  similarity_score: number;
}

// ── /v2/predict/full request/response shapes ───────────────────────────────

/** Request body for POST /v2/predict/full */
export interface PredictFullRequest {
  base_encodings: string[];
  rd_numbers: (string | null)[][];
  topn: number;
  include_cost: boolean;
  include_similarity: boolean;
  is_graphics: boolean[];
  should_normalise_image?: boolean;
}

/** Single result item returned per query */
export interface PredictFullResultItem {
  cost: number | null;
  similarity_scores: number[] | null;
  sketch_ids: string[] | null;
  style_numbers: (string | null)[] | null;
  similar_base_encodings: (string | null)[] | null;
  match_costs: (number | null)[] | null;
  match_departments: (string | null)[] | null;
  match_classes: (string | null)[] | null;
  match_subclasses: (string | null)[] | null;
  llm_attributes: Record<string, unknown>;
  cost_explanation: CostExplanationData | null;
  normalized_image: string | null;
}

/** Per-query metadata entry */
export interface PredictFullMetadata {
  predicted_department: string | null;
  dept_score: number;
  class_top3: string[];
  class_scores: number[];
  subclass_top3: string[];
  subclass_scores: number[];
  query_summary: string | null;
  subclass_cost_context: CostContextRange | null;
  class_cost_context: CostContextRange | null;
  model_version: string;
  notes: string | null;
  input_type: "sketch" | "sketch_and_rd";
  graphics_pipeline_mode: string | null;
  graphics_note: string | null;
  errors: {
    pipeline: string | null;
    cost: string | null;
    similarity: string | null;
    normalization?: string | null;
  };
  cost_explanation: CostExplanationData | null;
  execution_time: {
    total_s: number;
    gemini_s: number | null;
    cost_pred_s: number | null;
    similarity_s: number | null;
    normalization_s?: number | null;
  };
}

/** Full response shape from POST /v2/predict/full */
export interface PredictFullResponse {
  results: PredictFullResultItem[][];
  metadata: PredictFullMetadata[];
}

export interface ShapFeatureValues {
  label: string;
  values: Record<string, number>;
}

export type ShapLookup = Record<string, Record<string, ShapFeatureValues>>;

export interface MetadataBundle {
  deptBaseline: Record<string, number>;
  deptFeatures: Record<string, string[]>;
  shapLookup: ShapLookup;
  peerPool: PeerStyle[];
}

export interface FeedbackPayload {
  style_number: number;
  session_id: string;
  predicted_department: string;
  final_department: string;
  rd_number: string | null;
  attribute_overrides: Record<string, string>;
  origin: string;
  cotton_origin: string;
  themes: string[];
  positioning: string;
  free_text: string;
  model_cost: number;
  final_cost: number;
  locked: boolean;
  model_version: string;
}

export interface SimilaritySearchRequest {
  style_number: number;
  department: string;
  attrs: Record<string, string>;
  limit?: number;
}

// ── /v2/predict/feedback request/response shapes ──────────────────────────────

/** Request body for POST /v2/predict/feedback */
export interface FeedbackPredictRequest {
  /** User's current department (original or overridden) — always used for routing */
  department: string;
  /** Merged attributes: llmAttributes + attributeOverrides */
  attributes: Record<string, unknown>;
  rd_number: string | null;
  is_graphics: boolean;
  /** True when the user has overridden the predicted department */
  dept_changed: boolean;
  topn?: number;
  /** Current class/subclass from the original prediction — used as-is when dept_changed=false */
  current_class?: string | null;
  current_subclass?: string | null;
}

/** Response from POST /v2/predict/feedback */
export interface FeedbackPredictResponse {
  cost: number | null;
  cost_explanation: string | null;
  baseline: number | null;

  pred_class_1: string | null;
  pred_subclass_1: string | null;
  class_top3: string[];
  subclass_top3: string[];

  similarity_scores: number[] | null;
  sketch_ids: string[] | null;
  similar_base_encodings: string[] | null;
  match_costs: number[] | null;

  classifier_error: string | null;
  cost_error: string | null;
  similarity_error: string | null;

  model_version: string | null;
  pipeline_note: string | null;
  execution_time: Record<string, number>;
}
