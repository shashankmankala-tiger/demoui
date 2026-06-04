# Flash Costing — Client

Next.js 16 frontend for the Flash Costing style-cost estimation tool. Designers upload a sketch (optionally with a Reference Document number), fill in structural attributes, and receive an AI-predicted cost with a SHAP-based cost-driver breakdown.

## Prerequisites

- Node.js 20+
- npm 10+
- A running Flash Costing backend **or** access to the Cloud Run deployment

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file
cp .env.local.example .env.local
```

Edit `.env.local`:

| Variable | Required | Description |
|---|---|---|
| `FLASHCOSTING_API_URL` | For Cloud Run | Full Cloud Run URL (e.g. `https://flash-costing-inference-....run.app`). When set, the proxy attaches a GCP Identity Token automatically. |
| `FLASHCOSTING_SERVER` | For Cloud Run | Populates the `X-Request-Origin` header on upstream calls (e.g. `GCP`). |
| `NEXT_PUBLIC_API_BASE_URL` | For local backend | Backend URL, default `http://localhost:8000`. Used when `FLASHCOSTING_API_URL` is unset. |
| `NEXT_PUBLIC_SKETCH_BASE_URL` | Optional | Base path for prototype sketch images, default `/assets/prototype_sketches`. |
| `NEXT_PUBLIC_MODEL_VERSION` | Optional | Populates the `X-Client-Version` header (e.g. `sketchrd_subclass_prob@2026-04-24`). |

## Running locally

### Against a local backend

Leave `FLASHCOSTING_API_URL` unset in `.env.local`. Start the backend (see the `flashcosting-gml` repo), then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Against the Cloud Run backend

Set `FLASHCOSTING_API_URL` in `.env.local` to the Cloud Run URL. Then authenticate with GCP Application Default Credentials:

```bash
gcloud auth application-default login
npm run dev
```

The Next.js server-side proxy (`src/app/api/predict/route.ts`) fetches a GCP Identity Token from ADC and attaches it to every upstream request — no token ever reaches the browser.

## Build

```bash
npm run build   # production build
npm run start   # serve the production build on :3000
```

## Lint / type-check

```bash
npm run lint
npx tsc --noEmit
```

## Project structure

```
src/
├── app/               # Next.js App Router pages + API proxy routes
│   └── api/
│       └── predict/   # Server-side proxy to /v2/predict/full
├── components/        # UI components (layout, screens, shared)
├── config/            # Static configuration (env validation, constants)
├── hooks/             # TanStack Query mutation/query hooks
├── lib/               # Utilities (gcpAuth, parsers, cn)
├── providers/         # React context providers (QueryClientProvider, etc.)
├── services/          # API call functions (predict.service.ts, etc.)
├── store/             # Zustand global store (useAppStore)
└── types/             # Shared TypeScript interfaces
```

## Architecture notes

- **API proxy** — all backend calls go through `/api/predict` (and future `/api/feedback`). The browser only sees same-origin requests; CORS and GCP auth are handled server-side.
- **GCP auth** — `src/lib/gcpAuth.ts` caches Identity Tokens for 1 hour with a 5-minute refresh buffer, mirroring the Python backend's token logic.
- **State** — Zustand (`useAppStore`) holds the current style record, prediction result, and attribute overrides. TanStack Query handles mutation lifecycle (loading/error/success).
- **Cost breakdown** — `parseCostExplanation()` parses the natural-language explanation string from the API into `GroupBreakdown[]` for `CostDriverBars`.
