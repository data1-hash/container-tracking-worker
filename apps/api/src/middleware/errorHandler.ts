import type { NextFunction, Request, Response } from 'express';

interface HttpError extends Error {
  status?: number;
}

export function errorHandler(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);
  const status = error.status ?? 500;
  const message = process.env.NODE_ENV === 'production' && status >= 500 ? 'Internal server error' : error.message;
  res.status(status).json({ error: message });
}
