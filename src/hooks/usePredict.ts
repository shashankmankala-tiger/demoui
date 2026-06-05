"use client";

/**
 * Orchestrates the sketch-to-cost prediction flow.
 *
 * - API call and animation run in parallel via Promise.all.
 * - Animation timing is distributed across steps to match approximate backend
 *   latency (25–40 s total): Gemini extraction (~10 s) is the longest stage.
 * - The animation holds at "costing" until the API resolves or aborts.
 * - After the API returns, a brief "normalizing" step is shown before handing
 *   off to either the normalization preview or the cost result screen.
 * - An AbortController cancels the fetch if the user resets or the component
 *   unmounts; a hard 95 s safety timeout also fires the abort.
 */

import { useMutation } from "@tanstack/react-query";
import { predictStyle } from "@/services/predict.service";
import { mapApiResponse } from "@/lib/mapApiResponse";
import { useAppStore } from "@/store/useAppStore";
import { APP_CONFIG } from "@/config/app.config";
import type { AnalyzeStep } from "@/types/app.types";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── Step timing (milliseconds) ────────────────────────────────────────────────
// Spread across ~15 s so "costing" is held for the remaining API time (~10–25 s).
// "normalizing" fires AFTER the API resolves — set to 0 here; the hook adds a
// fixed 700 ms pause explicitly after Promise.all settles.

// DEMO: instant for development — restore TIMING_NO_RD1 values before client demo
const TIMING_NO_RD1: Array<{ step: AnalyzeStep; ms: number }> = [
  { step: "uploading",   ms: 1 },
  { step: "classifying", ms: 1 },
  { step: "extracting",  ms: 1 },
  { step: "costing",     ms: 0 },
];

const TIMING_NO_RD: Array<{ step: AnalyzeStep; ms: number }> = [
  { step: "uploading",   ms: 1_500 },
  { step: "classifying", ms: 10_000 }, // Gemini LLM extraction
  { step: "extracting",  ms: 4_000 },  // hierarchical classifier
  { step: "costing",     ms: 0 },      // held until API resolves
];
// DEMO: instant for development — restore TIMING_WITH_RD1 values before client demo
const TIMING_WITH_RD: Array<{ step: AnalyzeStep; ms: number }> = [
  { step: "uploading",   ms: 1 },
  { step: "classifying", ms: 1 },
  { step: "fabric",      ms: 1 },
  { step: "extracting",  ms: 1 },
  { step: "costing",     ms: 0 },
];
const TIMING_WITH_RD1: Array<{ step: AnalyzeStep; ms: number }> = [
  { step: "uploading",   ms: 1_500 },
  { step: "classifying", ms: 10_000 }, // Gemini LLM extraction
  { step: "fabric",      ms: 3_500 },  // Databricks fabric lookup
  { step: "extracting",  ms: 4_000 },  // hierarchical classifier
  { step: "costing",     ms: 0 },      // held until API resolves
];

// ── Human-readable error messages ────────────────────────────────────────────

function classifyError(err: unknown): string {
  if (err instanceof DOMException && err.name === "AbortError") {
    return "Request timed out — the model is taking longer than expected. Please try again.";
  }
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
    return "Network error — check your connection and try again.";
  }
  if (msg.includes("Predict failed (5")) {
    return "Server error — the backend returned an unexpected response. Please try again in a moment.";
  }
  if (msg.includes("Predict failed (4")) {
    return "Invalid request — the image or parameters were not accepted by the model.";
  }
  return "Something went wrong — please try again.";
}

// ── Animation runner ──────────────────────────────────────────────────────────

async function runAnimation(
  steps: Array<{ step: AnalyzeStep; ms: number }>,
  setStep: (s: AnalyzeStep) => void,
  holdUntil: Promise<unknown>
): Promise<void> {
  for (const { step, ms } of steps) {
    setStep(step);
    if (ms > 0) await sleep(ms);
  }
  // The last step (costing) holds here until the API call settles
  await holdUntil;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function usePredict() {
  const {
    readyNormalizationPreview,
    setAnalyzeStep,
    setSketchDataUrl,
    setPredictionError,
    isGraphics,
  } = useAppStore();

  return useMutation({
    mutationFn: async ({
      imageDataUrl,
      rdNumber,
      topN = 6,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      file: _file,
    }: {
      imageDataUrl: string;
      rdNumber: string | null;
      topN?: number;
      file?: File;
    }) => {
      setPredictionError(null);
      setSketchDataUrl(imageDataUrl);

      // AbortController — cancelled on timeout or external reset
      const controller = new AbortController();
      // Hard safety timeout: slightly above the API's own 90 s ceiling
      const timeoutId = setTimeout(
        () => controller.abort(new DOMException("Request timed out", "AbortError")),
        APP_CONFIG.api.timeout + 5_000
      );

      const hasRd = !!rdNumber;
      const timing = hasRd ? TIMING_WITH_RD : TIMING_NO_RD;

      try {
        const apiPromise = predictStyle(imageDataUrl, rdNumber, isGraphics, topN, controller.signal);

        // Settle promise used to release the animation hold at "costing"
        const settle = apiPromise.then(
          () => undefined,
          () => undefined
        );

        await Promise.all([
          runAnimation(timing, setAnalyzeStep as (s: AnalyzeStep) => void, settle),
          settle,
        ]);

        // Resolve the API result now — we need to know if it errored before
        // deciding whether to show the "normalizing" step.
        // Let errors propagate — onError will handle them immediately.
        const apiResult = await apiPromise;

        // Only show the normalizing step on success — don't delay error display.
        setAnalyzeStep("normalizing");
        await sleep(700);

        return apiResult;
      } finally {
        clearTimeout(timeoutId);
      }
    },

    onSuccess: (data) => {
      const { record, metadata, normalizedImageDataUrl, normalizationError } = mapApiResponse(data);
      // Always show the preview page — normalizationError will be displayed there if normalisation failed
      readyNormalizationPreview(record, record.department, record.deptScore, metadata, normalizedImageDataUrl, normalizationError);
    },

    onError: (err: unknown) => {
      setAnalyzeStep("idle");
      setPredictionError(classifyError(err));
    },
  });
}
