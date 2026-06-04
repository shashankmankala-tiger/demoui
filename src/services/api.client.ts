// Base API client — all services build on this

import { APP_CONFIG } from "@/config/app.config";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  method: "GET" | "POST",
  path: string,
  body?: Record<string, unknown> | FormData
): Promise<T> {
  const url = `${APP_CONFIG.api.baseUrl}${path}`;

  const isFormData = body instanceof FormData;

  const response = await fetch(url, {
    method,
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    signal: AbortSignal.timeout(APP_CONFIG.api.timeout),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new ApiError(response.status, text);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: Record<string, unknown> | FormData) =>
    request<T>("POST", path, body),
};
