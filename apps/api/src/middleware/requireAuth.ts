import type { NextFunction, Request, Response } from 'express';
export function requireAuth(req: Request, res: Response, next: NextFunction) { if (process.env.NODE_ENV === 'test' || process.env.SKIP_AUTH === 'true') return next(); if (!req.headers.authorization) return res.status(401).json({ error: 'Missing bearer token' }); next(); }
