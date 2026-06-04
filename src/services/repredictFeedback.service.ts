/**
 * Service for calling POST /v2/predict/feedback.
 *
 * Distinct from feedback.service.ts (which handles feedback log submission).
 * This service re-predicts cost + similarity from user-corrected attributes
 * without re-running Gemini extraction.
 */

import type { FeedbackPredictRequest, FeedbackPredictResponse } from "@/types/api.types";

export async function repredictFeedback(
  req: FeedbackPredictRequest,
  signal?: AbortSignal
): Promise<FeedbackPredictResponse> {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Feedback re-prediction failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<FeedbackPredictResponse>;
}
