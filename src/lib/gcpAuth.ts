/**
 * GCP Identity Token helper for server-side Cloud Run authentication.
 *
 * Token resolution order (mirrors flashcosting-gml/tools/_flashcosting/backend.py):
 *   1. Cached token — reused until 5 min before expiry
 *   2. GCP metadata server via google-auth-library (Cloud Run / GKE)
 *   3. Application Default Credentials (local dev via `gcloud auth application-default login`)
 *
 * Returns an empty string when targeting localhost (no auth needed).
 */

import { GoogleAuth } from "google-auth-library";

const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

let tokenCache: { token: string; expiresAt: number } | null = null;

function isLocalhost(url: string): boolean {
  return url.startsWith("http://localhost") || url.startsWith("http://127.");
}

export async function getGcpBearerToken(audience: string): Promise<string> {
  if (isLocalhost(audience)) return "";

  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt - now > TOKEN_REFRESH_BUFFER_MS) {
    return tokenCache.token;
  }

  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(audience);
  const headers = await client.getRequestHeaders(audience);
  const token = headers.get("Authorization") ?? "";

  // GCP identity tokens expire after 1 hour
  tokenCache = { token, expiresAt: now + 60 * 60 * 1000 };

  return token;
}
