import type { User } from '@supabase/supabase-js';
import type { Request, Response } from 'express';
import { supabase } from './db.js';

export type Role = 'ADMIN' | 'MANAGER' | 'SALES' | 'PURCHASE' | 'LOGISTICS' | 'VIEWER';

export interface AuthContext {
  user: User;
  role: Role;
  fullName?: string;
}

export function bearerToken(req: Request) {
  return req.headers.authorization?.replace(/^Bearer\s+/i, '');
}

export function getAuthContext(res: Response): AuthContext {
  const auth = res.locals.auth as AuthContext | undefined;
  if (!auth) throw new Error('Authenticated user context is missing');
  return auth;
}

export async function verifyBearerToken(token: string): Promise<AuthContext> {
  if (!supabase) throw new Error('Supabase service role is not configured');
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) throw new Error('Invalid bearer token');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (profileError) throw profileError;

  return {
    user: userData.user,
    role: (profile?.role ?? 'VIEWER') as Role,
    fullName: profile?.full_name ?? undefined,
  };
}

export function hasAnyRole(auth: AuthContext, roles: Role[]) {
  return roles.includes(auth.role);
}
