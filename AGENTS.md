# AGENTS.md

## Project

This is a full-stack Import/Export Shipment Tracking App.

Core stack:
- React + Vite + TypeScript + Tailwind frontend
- Node.js + Express + TypeScript backend
- Supabase PostgreSQL database
- Supabase Auth
- Supabase Storage
- Node.js + Playwright tracking worker
- pnpm monorepo

## Important Architecture

Do not use Google Sheets.
Do not use Google Apps Script.

Supabase PostgreSQL is the main database.

The worker uses Playwright to open carrier websites and extract visible tracking text.

## Safety Rules

- Never bypass CAPTCHA.
- Never use CAPTCHA solving services.
- Never use stealth plugins.
- Never use proxy rotation for anti-bot evasion.
- If CAPTCHA/login/human verification appears, create a Manual Review item.
- Do not commit secrets.
- Do not commit real shipment/customer data.
- Use mock data in tests.

## Commands

Use pnpm.

Install:
pnpm install

Run frontend:
pnpm dev:web

Run backend:
pnpm dev:api

Run worker:
pnpm dev:worker

Lint:
pnpm lint

Test:
pnpm test

Build:
pnpm build

## Before Final Response

Always run:
pnpm lint
pnpm test
pnpm build

If any command fails, explain the issue and make the smallest safe fix.
