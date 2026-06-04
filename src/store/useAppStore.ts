"use client";

import { create } from "zustand";
import type { StyleRecord, MetadataBundle, FeedbackPredictResponse, PeerStyle } from "@/types/api.types";
import type {
  Screen,
  FeedbackTab,
  Positioning,
  AnalyzeStep,
  FeedbackItem,
  EstimationRun,
} from "@/types/app.types";
import { THEMES, ORIGINS, COTTON_ORIGINS, POSITIONING } from "@/config/themes.config";

interface AppState {
  // Navigation
  activeScreen: Screen;
  activeFeedbackTab: FeedbackTab;
  sidebarCollapsed: boolean;

  // Sketch / prediction
  analyzeStep: AnalyzeStep;
  sketchDataUrl: string | null;
  normalizedImageDataUrl: string | null;
  normalizationError: string | null;
  rdNumber: string;
  isGraphics: boolean;
  useFabric: boolean;
  predictedDept: string | null;
  predictedConf: number | null;
  predictionError: string | null;

  // Style data
  styleRecord: StyleRecord | null;
  metadata: MetadataBundle | null;

  // Designer overrides (attribute key → new value)
  attributeOverrides: Record<string, string>;
  department: string;
  origin: string;
  cottonOrigin: string;

  // Themes & positioning
  selectedThemes: Set<string>;
  positioning: Positioning;
  freeText: string;

  // Cost
  finalCost: number | null;
  locked: boolean;

  // Re-prediction (feedback loop)
  previousCost: number | null;
  previousBaseline: number | null;
  repredictError: string | null;

  // Estimation history — one entry per successful re-prediction run
  estimationHistory: EstimationRun[];

  // Feedback log
  feedbackItems: FeedbackItem[];

  // Actions
  setActiveScreen: (screen: Screen) => void;
  setActiveFeedbackTab: (tab: FeedbackTab) => void;
  toggleSidebar: () => void;

  setAnalyzeStep: (step: AnalyzeStep) => void;
  setSketchDataUrl: (url: string | null) => void;
  setNormalizedImageDataUrl: (url: string | null) => void;
  /** Called when API returns — shows the before/after preview card (normalization may have failed). */
  readyNormalizationPreview: (record: StyleRecord, predictedDept: string, predictedConf: number, metadata: MetadataBundle, normalizedImageUrl: string | null, normalizationError: string | null) => void;
  /** Called when user clicks "Proceed to estimate" on the normalization preview card. */
  confirmNormalizationPreview: () => void;
  setRdNumber: (rd: string) => void;
  setIsGraphics: (v: boolean) => void;
  setUseFabric: (use: boolean) => void;
  setPredictionError: (err: string | null) => void;

  loadStyleRecord: (record: StyleRecord, predictedDept: string, predictedConf: number, metadata?: MetadataBundle) => void;
  setMetadata: (metadata: MetadataBundle) => void;

  setAttributeOverride: (feature: string, value: string) => void;
  clearAttributeOverrides: () => void;
  setDepartment: (dept: string) => void;
  setOrigin: (origin: string) => void;
  setCottonOrigin: (origin: string) => void;

  toggleTheme: (id: string) => void;
  setPositioning: (pos: Positioning) => void;
  setFreeText: (text: string) => void;

  setFinalCost: (cost: number) => void;
  lockCost: () => void;
  unlockCost: () => void;

  addFeedbackItem: (item: Omit<FeedbackItem, "id" | "timestamp">) => void;

  applyFeedbackResult: (result: FeedbackPredictResponse) => void;
  setRepredictError: (err: string | null) => void;

  reset: () => void;
}

const initialState = {
  activeScreen: "cost" as Screen,
  activeFeedbackTab: "attributes" as FeedbackTab,
  sidebarCollapsed: true,
  analyzeStep: "idle" as AnalyzeStep,
  sketchDataUrl: null,
  normalizedImageDataUrl: null,
  normalizationError: null,
  rdNumber: "",
  isGraphics: false,
  useFabric: false,
  predictedDept: null,
  predictedConf: null,
  predictionError: null,
  styleRecord: null,
  metadata: null,
  attributeOverrides: {},
  department: "",
  origin: "unknown",
  cottonOrigin: "unknown",
  selectedThemes: new Set<string>(),
  positioning: "standard" as Positioning,
  freeText: "",
  finalCost: null,
  locked: false,
  feedbackItems: [],
  previousCost: null,
  previousBaseline: null,
  repredictError: null,
  estimationHistory: [],
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setActiveScreen: (screen) => set({ activeScreen: screen }),
  setActiveFeedbackTab: (tab) => set({ activeFeedbackTab: tab }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  setAnalyzeStep: (step) => set({ analyzeStep: step }),
  setSketchDataUrl: (url) => set({ sketchDataUrl: url }),
  setNormalizedImageDataUrl: (url) => set({ normalizedImageDataUrl: url }),

  readyNormalizationPreview: (record, predictedDept, predictedConf, metadata, normalizedImageUrl, normalizationError) => {
    const cost = computeModelCost(record);
    set({
      styleRecord: record,
      department: record.department,
      attributeOverrides: {},
      origin: "unknown",
      cottonOrigin: "unknown",
      selectedThemes: new Set(),
      positioning: "standard",
      freeText: "",
      locked: false,
      finalCost: cost,
      predictedDept,
      predictedConf,
      normalizedImageDataUrl: normalizedImageUrl,
      normalizationError,
      analyzeStep: "normalization_preview",
      ...(metadata ? { metadata } : {}),
    });
  },

  confirmNormalizationPreview: () => set({ analyzeStep: "done" }),

  setRdNumber: (rd) => set({ rdNumber: rd }),
  setIsGraphics: (v) => set({ isGraphics: v }),
  setUseFabric: (use) => set({ useFabric: use }),
  setPredictionError: (err) => set({ predictionError: err }),

  loadStyleRecord: (record, predictedDept, predictedConf, metadata) => {
    const cost = computeModelCost(record);
    set({
      styleRecord: record,
      department: record.department,
      attributeOverrides: {},
      origin: "unknown",
      cottonOrigin: "unknown",
      selectedThemes: new Set(),
      positioning: "standard",
      freeText: "",
      locked: false,
      finalCost: cost,
      predictedDept,
      predictedConf,
      analyzeStep: "done",
      ...(metadata ? { metadata } : {}),
    });
  },

  setMetadata: (incoming) =>
    set((s) => ({
      metadata: {
        ...incoming,
        // peerPool comes from the prediction API, not the metadata service.
        // Preserve it when the incoming payload has none (metadata.service.ts
        // always returns peerPool: [] which would otherwise wipe similarity results).
        peerPool: incoming.peerPool.length > 0 ? incoming.peerPool : (s.metadata?.peerPool ?? []),
      },
    })),

  setAttributeOverride: (feature, value) => {
    const overrides = { ...get().attributeOverrides, [feature]: value };
    set({ attributeOverrides: overrides });
    recomputeCost(set, get, overrides);
  },

  clearAttributeOverrides: () => {
    set({ attributeOverrides: {} });
    recomputeCost(set, get, {});
  },

  setDepartment: (dept) => {
    set({ department: dept, attributeOverrides: {} });
    recomputeCost(set, get, {});
  },

  setOrigin: (origin) => {
    set({ origin });
    recomputeCost(set, get, get().attributeOverrides);
  },

  setCottonOrigin: (cottonOrigin) => {
    set({ cottonOrigin });
    recomputeCost(set, get, get().attributeOverrides);
  },

  toggleTheme: (id) => {
    const next = new Set(get().selectedThemes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    set({ selectedThemes: next });
    recomputeCost(set, get, get().attributeOverrides);
  },

  setPositioning: (pos) => {
    set({ positioning: pos });
    recomputeCost(set, get, get().attributeOverrides);
  },

  setFreeText: (text) => set({ freeText: text }),

  setFinalCost: (cost) => set({ finalCost: cost }),
  lockCost: () => set({ locked: true }),
  unlockCost: () => set({ locked: false }),

  addFeedbackItem: (item) =>
    set((s) => ({
      feedbackItems: [
        ...s.feedbackItems,
        { ...item, id: crypto.randomUUID(), timestamp: Date.now() },
      ],
    })),

  applyFeedbackResult: (result: FeedbackPredictResponse) => {
    const { styleRecord, metadata, department, attributeOverrides } = get();
    if (!styleRecord) return;

    // Save current cost for comparison display before overwriting
    const previousCost = styleRecord.y_pred;
    const previousBaseline = styleRecord.baseline;
    const deptChanged = department !== styleRecord.department;
    const changedAttrKeys = Object.keys(attributeOverrides);

    const run: EstimationRun = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      previousCost,
      newCost: result.cost ?? null,
      department,
      deptChanged,
      changedAttrKeys,
      modelVersion: result.model_version ?? null,
      costError: result.cost_error ?? null,
    };

    // Rebuild peer pool from new similarity matches
    let peerPool = metadata?.peerPool ?? [];
    if (result.sketch_ids?.length) {
      peerPool = result.sketch_ids.reduce<PeerStyle[]>((acc, sketchId, i) => {
        if (!sketchId) return acc;
        const imageUrl = result.similar_base_encodings?.[i] ?? "";
        if (!imageUrl) return acc;
        acc.push({
          sketch_id: sketchId,
          style_number: 0,
          department,
          class: "",
          subclass: "",
          cost: result.match_costs?.[i] ?? 0,
          attrs: {},
          image_url: imageUrl,
          similarity_score: result.similarity_scores?.[i] ?? 0,
          similarity: result.similarity_scores?.[i] ?? 0,
        });
        return acc;
      }, []);
    }

    const updatedRecord: StyleRecord = {
      ...styleRecord,
      y_pred: result.cost ?? styleRecord.y_pred,
      baseline: result.cost ?? styleRecord.baseline,
      costExplanation: result.cost_explanation ?? styleRecord.costExplanation,
      class: result.pred_class_1 ?? styleRecord.class,
      subclass: result.pred_subclass_1 ?? styleRecord.subclass,
      classTaxo: result.class_top3.length > 0 ? result.class_top3 : styleRecord.classTaxo,
      subclassTaxo: result.subclass_top3.length > 0 ? result.subclass_top3 : styleRecord.subclassTaxo,
      costError: result.cost_error ?? null,
      similarityError: result.similarity_error ?? null,
    };

    set((s) => ({
      styleRecord: updatedRecord,
      finalCost: result.cost ?? styleRecord.y_pred,
      previousCost,
      previousBaseline,
      repredictError: null,
      metadata: metadata ? { ...metadata, peerPool } : metadata,
      estimationHistory: [run, ...s.estimationHistory],
    }));
  },

  setRepredictError: (err) => set({ repredictError: err }),

  reset: () => set({ ...initialState, selectedThemes: new Set<string>(), normalizedImageDataUrl: null, normalizationError: null }),
}));

// Pure cost computation helpers (extracted for reuse in hooks)

export function computeModelCost(record: StyleRecord): number {
  return record.baseline + record.drivers.reduce((sum, d) => sum + d.shap, 0);
}

function recomputeCost(
  set: (partial: Partial<AppState>) => void,
  get: () => AppState,
  overrides: Record<string, string>
) {
  const { styleRecord, metadata, department, origin, cottonOrigin, selectedThemes, positioning } = get();
  if (!styleRecord) return;

  let cost = styleRecord.baseline;

  // Apply current drivers — use driver.shap only (not shapLookup overrides).
  // Live SHAP-based cost changes are disabled; cost updates only via Re-estimate.
  for (const driver of styleRecord.drivers) {
    cost += driver.shap;
  }

  // Apply origin multiplier
  const originMult = ORIGINS.find((o) => o.v === origin)?.mult ?? 0;
  cost += cost * originMult;

  // Apply cotton origin multiplier (only if fabric mode)
  const cottonMult = COTTON_ORIGINS.find((o) => o.v === cottonOrigin)?.mult ?? 0;
  cost += cost * cottonMult * 0.3; // partial weight

  // Apply themes
  for (const themeId of selectedThemes) {
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) cost += cost * theme.pct;
  }

  // Apply positioning
  const posMult = POSITIONING[positioning] ?? 0;
  cost += cost * posMult;

  set({ finalCost: Math.max(0, cost) });
}
