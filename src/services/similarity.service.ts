// Similarity search is handled by /v2/predict/full (include_similarity: true).
// This stub is kept so imports don't break.
import type { PeerStyle, SimilaritySearchRequest } from "@/types/api.types";

export async function searchSimilarStyles(
  _request: SimilaritySearchRequest
): Promise<PeerStyle[]> {
  return [];
}
