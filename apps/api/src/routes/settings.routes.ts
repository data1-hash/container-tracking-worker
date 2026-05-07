import { Router } from 'express'; import { listRows, updateRow } from '../services/crud.js';
export const settingsRoutes = Router(); settingsRoutes.get('/', async (_req,res)=>res.json(await listRows('settings'))); settingsRoutes.put('/:key', async (req,res)=>res.json(await updateRow('settings', req.params.key, req.body)));
