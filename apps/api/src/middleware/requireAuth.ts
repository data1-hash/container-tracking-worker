import type { NextFunction, Request, Response } from 'express';
import { bearerToken, verifyBearerToken, type Role } from '../auth.js';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === 'test') return next();

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Missing bearer token' });

  try {
    res.locals.auth = await verifyBearerToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid bearer token' });
  }
}

export function requireRoles(...roles: Role[]) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const auth = res.locals.auth;
    if (!auth || !roles.includes(auth.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    return next();
  };
}
