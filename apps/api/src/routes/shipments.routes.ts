import { getAuthContext } from '../auth.js';
import { Router } from 'express';
import { insertRow, listRows } from '../services/crud.js';
import {
  assertCanManageShipmentTracking,
  assertCanReadShipment,
  createShipment,
  getShipment,
  listShipments,
  modifyShipment,
  removeShipment,
} from '../services/shipmentAccess.js';

export const shipmentsRoutes = Router();

shipmentsRoutes.get('/', async (req, res) =>
  res.json(await listShipments(getAuthContext(res), req.query as Record<string, string>)),
);
shipmentsRoutes.post('/', async (req, res) => res.status(201).json(await createShipment(getAuthContext(res), req.body)));
shipmentsRoutes.get('/:id', async (req, res) => res.json(await getShipment(getAuthContext(res), req.params.id)));
shipmentsRoutes.put('/:id', async (req, res) =>
  res.json(await modifyShipment(getAuthContext(res), req.params.id, req.body)),
);
shipmentsRoutes.delete('/:id', async (req, res) => res.json(await removeShipment(getAuthContext(res), req.params.id)));
shipmentsRoutes.post('/:id/enqueue-tracking', async (req, res) => {
  await assertCanManageShipmentTracking(getAuthContext(res), req.params.id);
  return res.status(201).json(
    await insertRow('tracking_jobs', {
      shipment_id: req.params.id,
      carrier: req.body.carrier,
      tracking_number: req.body.tracking_number,
      tracking_number_type: req.body.tracking_number_type ?? 'BL',
    }),
  );
});
shipmentsRoutes.get('/:id/timeline', async (req, res) => {
  await assertCanReadShipment(getAuthContext(res), req.params.id);
  return res.json(await listRows('shipment_milestones', { shipment_id: req.params.id }));
});
shipmentsRoutes.get('/:id/events', async (req, res) => {
  await assertCanReadShipment(getAuthContext(res), req.params.id);
  return res.json(await listRows('tracking_events', { shipment_id: req.params.id }));
});
shipmentsRoutes.get('/:id/documents', async (req, res) => {
  await assertCanReadShipment(getAuthContext(res), req.params.id);
  return res.json(await listRows('documents', { shipment_id: req.params.id }));
});
