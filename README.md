# Voraco Shipment Tracker

A full-stack Import/Export Shipment Tracking App for managing ocean shipments, BL/container tracking, milestones, documents, ETA changes, delay alerts, carrier automation, manual review, and queue-based tracking jobs.

## Architecture

```text
React/Vite/Tailwind web app
        │ frontend anon key only
        ▼
Express TypeScript API ── service role ── Supabase PostgreSQL
        │                                  ├─ Auth
        │                                  ├─ Storage: shipment-documents
        │                                  └─ Queue: tracking_jobs
        ▼
Node.js Playwright worker ── service role ── Carrier public tracking pages
```

## Why Supabase, not Google Sheets

Supabase PostgreSQL provides relational constraints, indexes, RLS, Auth, Storage, migrations, and safe backend/worker service-role access. This project intentionally does **not** use Google Sheets or Google Apps Script because shipment tracking requires transactional queue state, role-based access control, document storage, and auditable structured data.

## Monorepo

- `apps/web`: React + Vite + TypeScript + Tailwind frontend.
- `apps/api`: Express + TypeScript backend API.
- `apps/worker`: Node.js + Playwright tracking worker.
- `packages/shared`: shared types, schemas, constants, parser helpers.
- `supabase/migrations`: SQL schema, RLS, storage, carrier-rule seed migrations.
- `tests`: Vitest unit tests with mock data only.

## Setup

```bash
pnpm install
cp .env.example .env
```

Create a Supabase project, copy the project URL, anon key, and service role key into `.env`. Keep the service role key only on the backend and worker; never expose it through Vite.

## Supabase migrations

Use the Supabase CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
supabase db reset # optional local reset with seed.sql
```

Migrations create all core tables, indexes, `updated_at` triggers, simple functional RLS policies, and the private `shipment-documents` storage bucket.

## Environment variables

See `.env.example` for:

- Backend: `API_PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CORS_ORIGIN`.
- Frontend: `VITE_API_MODE`, `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Worker: `WORKER_ID`, `WORKER_BATCH_LIMIT`, `WORKER_LOOP_INTERVAL_SECONDS`, `PLAYWRIGHT_HEADLESS`.

## Running locally

Frontend mock mode (runs without Supabase/backend):

```bash
VITE_API_MODE=mock pnpm dev:web
```

Backend:

```bash
pnpm dev:api
curl http://localhost:4000/health
```

Worker:

```bash
pnpm --filter worker start
pnpm --filter worker run-once
pnpm --filter worker run-loop
```

## Testing and build

```bash
pnpm lint
pnpm test
pnpm build
```

Tests never call real carrier websites.

## Carrier rules

Add carrier rules in the Carrier Rules UI or insert into `carrier_rules`. Use `{number}` inside `tracking_url_pattern`, choose `BROWSER`, `URLFETCH`, or `MANUAL`, and provide selectors/regexes. Regex fields extract visible tracking text into status, ETA, ETD, vessel, voyage, location, and event fields.

## Manual review

When a carrier page shows CAPTCHA, login, access denial, human verification, manual mode, or low parser confidence, the worker creates a `manual_reviews` item. Users paste visible carrier text, preview parser output, then approve or reject it.

## CAPTCHA policy

Never bypass CAPTCHA. Never use CAPTCHA solving services, stealth plugins, proxy rotation for anti-bot evasion, or unauthorized automation of login-protected portals. CAPTCHA/login/human verification must be routed to Manual Review.

## Deployment

- Frontend: Vercel or Netlify with Vite env vars.
- Backend: Render, Railway, Fly.io, or similar Node hosting with service role key stored as a secret.
- Worker: Render worker, Railway worker, Fly.io machine, Cloud Run job, or VPS with Playwright browsers installed.
- Database/Auth/Storage: Supabase hosted project.

## Security notes

- Service role key is only for backend and worker.
- Frontend uses only the Supabase anon key.
- Do not commit secrets, real customer data, service account JSON, or production shipment data.
- Development and tests use mock data.
