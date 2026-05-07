import type { Request } from 'express';
export function bearerToken(req: Request) { return req.headers.authorization?.replace(/^Bearer\s+/i, ''); }
