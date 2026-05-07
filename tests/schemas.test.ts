import { describe, expect, it } from 'vitest';
import { shipmentSchema, workerTrackingResultSchema } from '@voraco/shared';
describe('schemas', () => { it('validates tracking result schema', () => expect(workerTrackingResultSchema.parse({ success: true, manualReview: false, data: { status: 'Arrived', confidence: 80 } }).success).toBe(true)); it('validates shipment schema', () => expect(shipmentSchema.parse({ id: 's1', shipment_no: 'IMP-1', shipment_direction: 'IMPORT' }).shipment_no).toBe('IMP-1')); });
