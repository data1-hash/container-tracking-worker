import { Router } from 'express';
import { parseTrackingText } from '@voraco/shared';
import { supabase } from '../db.js';
import { getRow, listRows, updateRow } from '../services/crud.js';

export const manualReviewsRoutes = Router();

manualReviewsRoutes.get('/', async (req, res) =>
  res.json(await listRows('manual_reviews', req.query as Record<string, string>)),
);
manualReviewsRoutes.get('/:id', async (req, res) => res.json(await getRow('manual_reviews', req.params.id)));
manualReviewsRoutes.post('/:id/parse', (req, res) =>
  res.json(parseTrackingText(req.body.manual_text ?? '', req.body.rule ?? {})),
);
manualReviewsRoutes.post('/:id/approve', async (req, res) => {
  const review = await updateRow('manual_reviews', req.params.id, {
    review_status: 'APPROVED',
    parsed_json: req.body.parsed_json,
    manual_text: req.body.manual_text,
  });

  if (supabase && req.body.parsed_json && typeof req.body.parsed_json === 'object') {
    const data = req.body.parsed_json as Record<string, unknown>;
    const shipmentPatch = Object.fromEntries(
      Object.entries({
        current_status: data.status,
        eta: data.eta,
        etd: data.etd,
        vessel: data.vessel,
        voyage: data.voyage,
        last_location: data.location,
        last_event: data.rawEvent,
        source: data.source ?? 'manual_review',
        confidence: data.confidence,
        review_status: 'OK',
        last_checked_at: new Date().toISOString(),
      }).filter(([, value]) => value !== undefined && value !== null && value !== ''),
    );
    await supabase.from('shipments').update(shipmentPatch).eq('id', review.shipment_id);
    await supabase.from('tracking_events').insert({
      shipment_id: review.shipment_id,
      carrier: review.carrier,
      tracking_number: review.tracking_number,
      event_date: new Date().toISOString(),
      status: data.status,
      eta: data.eta,
      etd: data.etd,
      vessel: data.vessel,
      voyage: data.voyage,
      location: data.location,
      raw_event: data.rawEvent,
      source: 'manual_review',
      confidence: data.confidence,
    });
    if (review.tracking_job_id) {
      await supabase.from('tracking_jobs').update({ job_status: 'COMPLETED' }).eq('id', review.tracking_job_id);
    }
  }

  res.json(review);
});
manualReviewsRoutes.post('/:id/reject', async (req, res) =>
  res.json(await updateRow('manual_reviews', req.params.id, { review_status: 'REJECTED' })),
);
