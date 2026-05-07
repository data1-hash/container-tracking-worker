import type { NextFunction, Request, Response } from 'express';

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message;
  res.status(500).json({ error: message });
}
