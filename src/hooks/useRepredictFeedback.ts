"use client";

/**
 * TanStack mutation hook for the /v2/predict/feedback re-prediction flow.
 *
 * Named useRepredictFeedback to avoid collision with useFeedback.ts
 * (which handles feedback log submission).
 */

import { useMutation } from "@tanstack/react-query";
import { repredictFeedback } from "@/services/repredictFeedback.service";
import { useAppStore } from "@/store/useAppStore";
import type { FeedbackPredictRequest } from "@/types/api.types";

function humanizeError(err: unknown): string {
  if (err instanceof DOMException && err.name === "AbortError") {
    return "Request timed out — please try again.";
  }
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
    return "Network error — check your connection and try again.";
  }
  if (msg.includes("502")) {
    return "Server error — the backend is unreachable. Please try again.";
  }
  return "Re-estimation failed — please try again.";
}

export function useRepredictFeedback() {
  const { applyFeedbackResult, setRepredictError } = useAppStore();

  return useMutation({
    mutationFn: (req: FeedbackPredictRequest) => repredictFeedback(req),
    onSuccess: (data) => {
      applyFeedbackResult(data);
    },
    onError: (err: unknown) => {
      setRepredictError(humanizeError(err));
    },
  });
}
