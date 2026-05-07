import { table, supabase } from '../db.js';
export async function listRows(name: string, query?: Record<string, string>) { const builder = await table(name); let request = builder.select('*'); Object.entries(query ?? {}).forEach(([key, value]) => { if (value) request = request.eq(key, value); }); const { data, error } = await request.limit(200); if (error) throw error; return data; }
export async function getRow(name: string, id: string) { const { data, error } = await (await table(name)).select('*').eq('id', id).single(); if (error) throw error; return data; }
export async function insertRow(name: string, body: unknown) { const { data, error } = await (await table(name)).insert(body).select('*').single(); if (error) throw error; return data; }
export async function updateRow(name: string, id: string, body: unknown) { const { data, error } = await (await table(name)).update(body).eq('id', id).select('*').single(); if (error) throw error; return data; }
export async function deleteRow(name: string, id: string) { const { error } = await (await table(name)).delete().eq('id', id); if (error) throw error; return { ok: true }; }
export async function signedUploadUrl(path: string) { if (!supabase) throw new Error('Supabase not configured'); const { data, error } = await supabase.storage.from('shipment-documents').createSignedUploadUrl(path); if (error) throw error; return data; }
