# container-tracking-worker

A Node.js 20 worker for BL/container tracking that uses Google Sheets as a lightweight database and Playwright only when a carrier rule requires browser rendering.

## Safety rules

- The worker never bypasses CAPTCHA, human verification, login walls, or blocked pages.
- It does not use stealth plugins, CAPTCHA solvers, proxy rotation, or anti-bot evasion.
- When CAPTCHA, human verification, login, or blocking text is detected, the job is moved to `Manual_Review`.
- Do not commit service account JSON, tokens, `.env`, or real customer data.

## Google Sheet tabs

Create a Google Sheet with these tabs and exact header rows:

### Shipment_Master

`Shipment ID, BL No, Container No, Carrier, Customer Name, Sales Person, Origin, Destination, Current Status, ETA, Previous ETA, Last Event, Last Location, Vessel, Voyage, Source, Confidence, Last Checked At, Review Status, Error`

### Carrier_Rules

`Carrier, Active, Tracking URL Pattern, Number Type, Fetch Mode, Status Regex, ETA Regex, Vessel Regex, Location Regex, CAPTCHA Keywords, Parser Mode`

Notes:

- `Active` must be `TRUE` to use a rule.
- `Tracking URL Pattern` must include `{number}` where the BL/container number should be inserted.
- `Fetch Mode` can be `URLFETCH`, `BROWSER`, or `MANUAL`.
- `CAPTCHA Keywords` can be comma, pipe, semicolon, or newline separated.
- Regex fields should include a capture group for the value to write back to the sheet.

### Robot_Queue

`Job ID, Shipment ID, Carrier, Tracking Number, Job Status, Attempts, Next Run At, Last Error, Created At, Updated At`

Jobs are processed when `Job Status` is `PENDING` and `Next Run At` is blank or in the past.

### Manual_Review

`Review ID, Shipment ID, Carrier, Tracking Number, Reason, Carrier URL, Manual Text, Review Status, Created At, Updated At`

### Events_Log

`Event ID, Shipment ID, Event Date, Carrier, Tracking Number, Status, ETA, Vessel, Voyage, Location, Raw Event, Source, Confidence`

### Alert_Log

`Alert ID, Shipment ID, Alert Type, Message, Sent To, Status, Created At`

## Google service account setup

1. Create or select a Google Cloud project.
2. Enable the Google Sheets API for the project.
3. Create a service account.
4. Create a JSON key for that service account and download it securely.
5. Open the Google Sheet and share it with the service account email address, usually ending in `iam.gserviceaccount.com`.
6. Copy the Sheet ID from the Google Sheet URL. For `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`, use `SHEET_ID`.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment example:

   ```bash
   cp .env.example .env
   ```

3. Fill in `.env` locally. Never commit `.env`.

   ```bash
   SPREADSHEET_ID=your_google_sheet_id
   GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project"}
   BATCH_LIMIT=10
   MOCK_MODE=false
   ```

4. Run tests and lint:

   ```bash
   npm test
   npm run lint
   ```

5. Run the worker with real Google Sheets credentials:

   ```bash
   npm run track
   ```

6. Run the worker in mock mode without Google credentials:

   ```bash
   npm run track:mock
   ```

## GitHub Actions setup

Add these GitHub repository secrets:

- `SPREADSHEET_ID`: the Google Sheet ID.
- `GOOGLE_SERVICE_ACCOUNT_JSON`: the full service account JSON, minified or pasted as a single secret value.

Optional repository variables:

- `BATCH_LIMIT`: number of queue rows to process per run. Defaults to `10` if not set.

The included workflow runs every 30 minutes and can also be started manually from the Actions tab.

## Worker behavior

1. Reads due `PENDING` jobs from `Robot_Queue`, limited by `BATCH_LIMIT`.
2. Finds the matching active carrier rule in `Carrier_Rules`.
3. Builds the carrier URL by replacing `{number}` with the encoded tracking number.
4. Fetches the page using `URLFETCH`, `BROWSER`, or sends the job to `Manual_Review` for `MANUAL`.
5. Detects CAPTCHA, login, blocked, or human verification text and moves those jobs to `Manual_Review`.
6. Parses status, ETA, vessel, voyage, and location using configured regex fields.
7. Moves low-confidence or unparseable pages to `Manual_Review`.
8. Updates `Shipment_Master` columns I:T and appends a successful row to `Events_Log`.
9. Marks queue rows as `COMPLETED`, `MANUAL_REVIEW`, or `FAILED`.
10. Retries temporary failures up to 3 attempts with exponential backoff.

## Package scripts

- `npm test` - run Vitest tests.
- `npm run lint` - run ESLint.
- `npm run track` - run the worker against Google Sheets.
- `npm run track:mock` - run the worker with mock data and no credentials.
