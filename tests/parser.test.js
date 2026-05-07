import { describe, expect, it } from 'vitest';
import { parseShipmentText } from '../src/parser.js';

const rule = {
  statusRegex: 'Status:\\s*([^\\n]+)',
  etaRegex: 'ETA:\\s*([^\\n]+)',
  vesselRegex: 'Vessel:\\s*([^\\n]+)',
  voyageRegex: 'Voyage:\\s*([^\\n]+)',
  locationRegex: 'Location:\\s*([^\\n]+)',
};

describe('parseShipmentText', () => {
  it('extracts shipment fields with useful confidence', () => {
    const parsed = parseShipmentText(
      ['Status: In transit', 'ETA: 2026-06-01', 'Vessel: OCEAN STAR', 'Voyage: OS123E', 'Location: Long Beach'].join('\n'),
      rule,
    );

    expect(parsed.status).toBe('In transit');
    expect(parsed.eta).toBe('2026-06-01');
    expect(parsed.vessel).toBe('OCEAN STAR');
    expect(parsed.voyage).toBe('OS123E');
    expect(parsed.location).toBe('Long Beach');
    expect(parsed.confidence).toBe(1);
    expect(parsed.needsManualReview).toBe(false);
  });

  it('marks text for manual review when no fields match', () => {
    const parsed = parseShipmentText('No recognizable shipment information.', rule);

    expect(parsed.usefulFields).toEqual([]);
    expect(parsed.needsManualReview).toBe(true);
  });
});
