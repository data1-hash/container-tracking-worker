import { Router } from 'express';
import { deleteRow, insertRow, signedUploadUrl, updateRow } from '../services/crud.js';

export const documentsRoutes = Router();

documentsRoutes.post('/shipments/:id/documents', async (req, res) =>
  res.status(201).json(await insertRow('documents', { ...req.body, shipment_id: req.params.id })),
);

documentsRoutes.post('/documents/:id/upload-url', async (req, res) =>
  res.json(await signedUploadUrl(req.params.id, req.body.filename)),
);

documentsRoutes.put('/documents/:id', async (req, res) =>
  res.json(await updateRow('documents', req.params.id, req.body)),
);

documentsRoutes.delete('/documents/:id', async (req, res) =>
  res.json(await deleteRow('documents', req.params.id)),
);
