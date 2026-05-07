# AGENTS.md

## Project
This repository is a container / BL tracking worker.

It uses:
- Node.js
- Playwright
- Google Sheets API
- GitHub Actions
- Google Sheets as the database

## Safety Rules
- Never bypass CAPTCHA.
- Never use stealth, CAPTCHA solving, proxy rotation, or anti-bot evasion.
- If CAPTCHA, login wall, or human verification is detected, move the job to Manual_Review.
- Never commit secrets, service account JSON, tokens, or real customer data.
- Never log full credentials.
- Use mock data for tests.

## Commands
Run these before final answer:

```bash
npm install
npm test
npm run lint
```
