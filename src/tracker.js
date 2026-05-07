import { chromium } from 'playwright';
import { hasCaptchaOrBlocker } from './captcha.js';
import { parseShipmentText } from './parser.js';
import { TAB_NAMES } from './sheets.js';
import {
  buildTrackingUrl,
  markQueueCompleted,
  markQueueFailure,
  markQueueManualReview,
  readActiveCarrierRules,
  readPendingJobs,
} from './queue.js';
import { mockTrackingResponse } from './mockData.js';

class ManualReviewError extends Error {
  constructor(reason, carrierUrl) {
    super(reason);
    this.name = 'ManualReviewError';
    this.carrierUrl = carrierUrl;
  }
}

async function fetchText(url, mode, mockMode) {
  if (mockMode && url.startsWith('mock://')) {
    return mockTrackingResponse(url);
  }

  if (mode === 'URLFETCH') {
    const response = await fetch(url, { headers: { 'user-agent': 'container-tracking-worker/1.0' } });
    if (!response.ok) {
      throw new Error(`Fetch failed with HTTP ${response.status}`);
    }
    return response.text();
  }

  if (mode === 'BROWSER') {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      return await page.locator('body').innerText({ timeout: 10_000 });
    } finally {
      await browser.close();
    }
  }

  throw new ManualReviewError(`Unsupported or manual fetch mode: ${mode}`, url);
}

async function moveToManualReview(store, job, reason, carrierUrl, now = new Date()) {
  await store.appendRow(TAB_NAMES.manualReview, {
    'Review ID': `REV-${Date.now()}-${job.data['Job ID']}`,
    'Shipment ID': job.data['Shipment ID'],
    Carrier: job.data.Carrier,
    'Tracking Number': job.data['Tracking Number'],
    Reason: reason,
    'Carrier URL': carrierUrl,
    'Manual Text': '',
    'Review Status': 'OPEN',
    'Created At': now.toISOString(),
    'Updated At': now.toISOString(),
  });

  await markQueueManualReview(store, job, reason, now);
}

async function updateShipmentMaster(store, job, parsed, now = new Date()) {
  const shipments = await store.getRows(TAB_NAMES.shipments);
  const shipment = shipments.find(({ data }) => data['Shipment ID'] === job.data['Shipment ID']);
  if (!shipment) {
    throw new Error(`Shipment not found: ${job.data['Shipment ID']}`);
  }

  await store.updateRow(TAB_NAMES.shipments, shipment.rowNumber, {
    ...shipment.data,
    'Current Status': parsed.status,
    ETA: parsed.eta,
    'Previous ETA': shipment.data.ETA || '',
    'Last Event': parsed.status || parsed.rawEvent.slice(0, 250),
    'Last Location': parsed.location,
    Vessel: parsed.vessel,
    Voyage: parsed.voyage,
    Source: 'ROBOT',
    Confidence: parsed.confidence.toFixed(2),
    'Last Checked At': now.toISOString(),
    'Review Status': 'OK',
    Error: '',
  });
}

async function appendEvent(store, job, parsed, now = new Date()) {
  await store.appendRow(TAB_NAMES.events, {
    'Event ID': `EVT-${Date.now()}-${job.data['Job ID']}`,
    'Shipment ID': job.data['Shipment ID'],
    'Event Date': now.toISOString(),
    Carrier: job.data.Carrier,
    'Tracking Number': job.data['Tracking Number'],
    Status: parsed.status,
    ETA: parsed.eta,
    Vessel: parsed.vessel,
    Voyage: parsed.voyage,
    Location: parsed.location,
    'Raw Event': parsed.rawEvent,
    Source: 'ROBOT',
    Confidence: parsed.confidence.toFixed(2),
  });
}

async function processJob(store, job, rule, options) {
  const now = options.now ?? new Date();
  const trackingNumber = job.data['Tracking Number'];
  const carrierUrl = buildTrackingUrl(rule.trackingUrlPattern, trackingNumber);

  if (rule.fetchMode === 'MANUAL') {
    throw new ManualReviewError('Carrier rule requires manual tracking', carrierUrl);
  }

  const text = await fetchText(carrierUrl, rule.fetchMode, options.mockMode);
  const captcha = hasCaptchaOrBlocker(text, rule.captchaKeywords);
  if (captcha.detected) {
    throw new ManualReviewError(captcha.reason, carrierUrl);
  }

  const parsed = parseShipmentText(text, rule);
  if (parsed.needsManualReview) {
    throw new ManualReviewError('Parser confidence is low or no useful fields were found', carrierUrl);
  }

  await updateShipmentMaster(store, job, parsed, now);
  await appendEvent(store, job, parsed, now);
  await markQueueCompleted(store, job, now);

  return { status: 'COMPLETED', jobId: job.data['Job ID'] };
}

export async function runTrackingBatch(store, config, options = {}) {
  const now = options.now ?? new Date();
  const jobs = await readPendingJobs(store, config.batchLimit, now);
  const rules = await readActiveCarrierRules(store);
  const results = [];

  for (const job of jobs) {
    const rule = rules.get(job.data.Carrier);
    if (!rule) {
      await markQueueFailure(store, job, new Error(`No active carrier rule for ${job.data.Carrier}`), now);
      results.push({ status: 'FAILED', jobId: job.data['Job ID'] });
      continue;
    }

    try {
      results.push(await processJob(store, job, rule, { ...options, now, mockMode: config.mockMode }));
    } catch (error) {
      if (error instanceof ManualReviewError) {
        await moveToManualReview(store, job, error.message, error.carrierUrl, now);
        results.push({ status: 'MANUAL_REVIEW', jobId: job.data['Job ID'], reason: error.message });
      } else {
        await markQueueFailure(store, job, error, now);
        results.push({ status: 'FAILED', jobId: job.data['Job ID'], reason: error.message });
      }
    }
  }

  return results;
}
