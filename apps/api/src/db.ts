import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';
export const supabase = config.supabaseUrl && config.serviceRoleKey ? createClient(config.supabaseUrl, config.serviceRoleKey, { auth: { persistSession: false } }) : null;
export async function table(name: string) { if (!supabase) throw new Error('Supabase service role is not configured'); return supabase.from(name); }
