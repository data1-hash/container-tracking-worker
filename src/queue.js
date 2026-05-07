import { TAB_NAMES } from './sheets.js';

export const MAX_ATTEMPTS = 3;

export function isDue(value, now = new Date()) {
  if (!value) {
    return true;
  }

  const nextRunAt = new Date(value);
  return Number.isNaN(nextRunAt.getTime()) || nextRunAt <= now;
}

export async function readPendingJobs(store, batchLimit, now = new Date()) {
  const rows = await store.getRows(TAB_NAMES.queue);

  return rows
    .filter(({ data }) => data['Job Status'] === 'PENDING' && isDue(data['Next Run At'], now))
    .slice(0, batchLimit);
}

export async function readActiveCarrierRules(store) {
  const rows = await store.getRows(TAB_NAMES.rules);

  return new Map(
    rows
      .map(({ data }) => normalizeRule(data))
      .filter((rule) => rule.active)
      .map((rule) => [rule.carrier, rule]),
  );
}

export function normalizeRule(data) {
  return {
    carrier: data.Carrier,
    active: String(data.Active).toUpperCase() === 'TRUE',
    trackingUrlPattern: data['Tracking URL Pattern'],
    numberType: data['Number Type'],
    fetchMode: String(data['Fetch Mode'] || 'URLFETCH').toUpperCase(),
    statusRegex: data['Status Regex'],
    etaRegex: data['ETA Regex'],
    vesselRegex: data['Vessel Regex'],
    voyageRegex: data['Voyage Regex'],
    locationRegex: data['Location Regex'],
    captchaKeywords: data['CAPTCHA Keywords'],
    parserMode: data['Parser Mode'],
  };
}

export function buildTrackingUrl(pattern, trackingNumber) {
  if (!pattern) {
    throw new Error('Carrier rule is missing Tracking URL Pattern');
  }

  return pattern.replaceAll('{number}', encodeURIComponent(trackingNumber));
}

export function nextRetryAt(attempts, now = new Date()) {
  const minutes = Math.min(60, 2 ** Math.max(0, attempts) * 5);
  return new Date(now.getTime() + minutes * 60 * 1000).toISOString();
}

export async function markQueueCompleted(store, jobRow, now = new Date()) {
  await store.updateRow(TAB_NAMES.queue, jobRow.rowNumber, {
    ...jobRow.data,
    'Job Status': 'COMPLETED',
    'Last Error': '',
    'Updated At': now.toISOString(),
  });
}

export async function markQueueManualReview(store, jobRow, reason, now = new Date()) {
  await store.updateRow(TAB_NAMES.queue, jobRow.rowNumber, {
    ...jobRow.data,
    'Job Status': 'MANUAL_REVIEW',
    'Last Error': reason,
    'Updated At': now.toISOString(),
  });
}

export async function markQueueFailure(store, jobRow, error, now = new Date()) {
  const attempts = Number.parseInt(jobRow.data.Attempts || '0', 10) + 1;
  const failedPermanently = attempts >= MAX_ATTEMPTS;

  await store.updateRow(TAB_NAMES.queue, jobRow.rowNumber, {
    ...jobRow.data,
    'Job Status': failedPermanently ? 'FAILED' : 'PENDING',
    Attempts: String(attempts),
    'Next Run At': failedPermanently ? '' : nextRetryAt(attempts, now),
    'Last Error': error.message,
    'Updated At': now.toISOString(),
  });
}
