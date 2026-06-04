// Application-level types for state management and UI

export type Screen = "cost" | "feedback" | "scenario";
export type FeedbackTab = "attributes" | "styles" | "themes" | "context";
export type CostView = "drivers" | "waterfall";
export type Positioning = "budget" | "standard" | "premium";
export type AnalyzeStep = "idle" | "uploading" | "classifying" | "fabric" | "extracting" | "costing" | "normalizing" | "normalization_preview" | "done";
export type ConfidenceLevel = "high" | "medium" | "low";
export type ApplicabilityWeight = "high" | "medium" | "none";

export interface ThemeConfig {
  id: string;
  label: string;
  hint: string;
  pct: number;
}

export interface OriginConfig {
  v: string;
  label: string;
  mult: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: number;
}

export interface FeedbackItem {
  id: string;
  type: "correction" | "context" | "simulation" | "input";
  title: string;
  description: string;
  timestamp: number;
}

export interface RepresentativeStyle {
  styleNumber: number;
  department: string;
  class: string;
  subclass: string;
  cost: number;
  attrs: Record<string, string>;
  similarity?: number;
  applicability?: ApplicabilityWeight;
}

export interface EstimationRun {
  id: string;
  timestamp: number;
  previousCost: number | null;
  newCost: number | null;
  department: string;
  deptChanged: boolean;
  changedAttrKeys: string[];
  modelVersion: string | null;
  costError: string | null;
}

export interface ScenarioSuggestion {
  feature: string;
  label: string;
  currentValue: string;
  suggestedValue: string;
  saving: number;
  newCost: number;
}
