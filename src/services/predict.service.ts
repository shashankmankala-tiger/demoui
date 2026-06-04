/**
 * Service for calling POST /v2/predict/full.
 * Converts a data URI image into a base64 payload and returns the full
 * prediction response (cost + similar styles + LLM attributes).
 */

import type { PredictFullRequest, PredictFullResponse } from "@/types/api.types";

/**
 * Sends a sketch image to the backend for cost prediction and similarity search.
 *
 * @param imageDataUrl - Data URI (e.g. "data:image/png;base64,..."). The prefix
 *                       is stripped before sending — only the raw base64 goes to
 *                       the API.
 * @param rdNumber     - Optional RD number to include in the request.
 * @param topn         - Number of similar styles to return (default 6).
 * @returns Raw PredictFullResponse from the backend.
 */
export async function predictStyle(
  imageDataUrl: string,
  rdNumber?: string | null,
  isGraphics = false,
  topn = 6,
  signal?: AbortSignal
): Promise<PredictFullResponse> {
  // Strip the data URI prefix — API expects raw base64 only
  const base64 = imageDataUrl.replace(/^data:[^;]+;base64,/, "");

  const rdEntry = rdNumber ? [rdNumber] : [null];

  const requestBody: PredictFullRequest = {
    base_encodings: [base64],
    rd_numbers: [rdEntry],
    topn,
    include_cost: true,
    include_similarity: true,
    is_graphics: [isGraphics],
    should_normalise_image: true,
  };

  // Route through the local Next.js proxy (/api/predict) so the server-side
  // fetch handles the internal TLS certificate instead of the browser.
  const res = await fetch("/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Predict failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<PredictFullResponse>;
}
