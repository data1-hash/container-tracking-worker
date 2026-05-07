import { buildTrackingUrl } from './carrierStrategies.js';
import { requireDb } from './db.js';
import { track } from './tracker.js';

const workerId = process.env.WORKER_ID ?? 'local-worker-1';

export async function markFailed(id: string, attempts: number, error: string) {
  const db = requireDb();
  const nextAttempts = attempts + 1;
  const backoffMinutes = Math.min(60, nextAttempts * 10);
  return db
    .from('tracking_jobs')
    .update({
      attempts: nextAttempts,
      job_status: nextAttempts >= 3 ? 'FAILED' : 'PENDING',
      last_error: error,
      locked_at: null,
      locked_by: null,
      next_run_at: new Date(Date.now() + backoffMinutes * 60000).toISOString(),
    })
    .eq('id', id);
}

function compactPatch(fields: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined && value !== null && value !== ''));
}

export async function runOnce() {
  const db = requireDb();
  const limit = Number(process.env.WORKER_BATCH_LIMIT ?? 10);
  const { data: jobs, error } = await db
    .from('tracking_jobs')
    .select('*')
    .eq('job_status', 'PENDING')
    .lte('next_run_at', new Date().toISOString())
    .order('next_run_at')
    .limit(limit);
  if (error) throw error;

  let processed = 0;
  for (const job of jobs ?? []) {
    const { data: lockedJob, error: lockError } = await db
      .from('tracking_jobs')
      .update({ job_status: 'RUNNING', locked_at: new Date().toISOString(), locked_by: workerId })
      .eq('id', job.id)
      .eq('job_status', 'PENDING')
      .select('*')
      .maybeSingle();

    if (lockError || !lockedJob) continue;

    try {
      const { data: rule } = await db
        .from('carrier_rules')
        .select('*')
        .eq('carrier', lockedJob.carrier)
        .eq('active', true)
        .maybeSingle();

      if (!rule) {
        await markFailed(lockedJob.id, lockedJob.attempts ?? 0, 'No active carrier rule');
        continue;
      }

      const url = buildTrackingUrl(rule, lockedJob.tracking_number);
      const result = await track({
        shipmentId: lockedJob.shipment_id,
        trackingJobId: lockedJob.id,
        carrier: lockedJob.carrier,
        trackingNumber: lockedJob.tracking_number,
        url,
        rule,
      });

      if (result.manualReview) {
        await db.from('manual_reviews').insert({
          shipment_id: lockedJob.shipment_id,
          tracking_job_id: lockedJob.id,
          carrier: lockedJob.carrier,
          tracking_number: lockedJob.tracking_number,
          reason: result.reason,
          carrier_url: url,
        });
        await db
          .from('tracking_jobs')
          .update({ job_status: 'MANUAL_REVIEW', locked_at: null, locked_by: null, last_error: result.reason })
          .eq('id', lockedJob.id);
        processed += 1;
        continue;
      }

      const current = await db.from('shipments').select('eta').eq('id', lockedJob.shipment_id).single();
      const etaChanged = Boolean(result.data.eta && current.data?.eta && current.data.eta !== result.data.eta);

      await db.from('tracking_events').insert({
        shipment_id: lockedJob.shipment_id,
        carrier: lockedJob.carrier,
        tracking_number: lockedJob.tracking_number,
        event_date: new Date().toISOString(),
        status: result.data.status,
        eta: result.data.eta,
        etd: result.data.etd,
        vessel: result.data.vessel,
        voyage: result.data.voyage,
        location: result.data.location,
        raw_event: result.data.rawEvent,
        source: result.data.source,
        confidence: result.data.confidence,
      });

      await db
        .from('shipments')
        .update(
          compactPatch({
            current_status: result.data.status,
            eta: result.data.eta,
            previous_eta: etaChanged ? current.data?.eta : undefined,
            vessel: result.data.vessel,
            voyage: result.data.voyage,
            last_location: result.data.location,
            last_event: result.data.rawEvent,
            source: result.data.source,
            confidence: result.data.confidence,
            last_checked_at: new Date().toISOString(),
          }),
        )
        .eq('id', lockedJob.shipment_id);

      if (etaChanged) {
        await db.from('alerts').insert({
          shipment_id: lockedJob.shipment_id,
          alert_type: 'ETA_CHANGED',
          severity: 'WARNING',
          message: `ETA changed from ${current.data?.eta} to ${result.data.eta}`,
        });
      }

      await db.from('tracking_jobs').update({ job_status: 'COMPLETED', locked_at: null, locked_by: null }).eq('id', lockedJob.id);
      processed += 1;
    } catch (error) {
      await markFailed(lockedJob.id, lockedJob.attempts ?? 0, error instanceof Error ? error.message : 'Unknown worker error');
    }
  }

  return { processed };
}
