import { randomUUID } from 'node:crypto';
import { table, supabase } from '../db.js';

const allowedFields: Record<string, string[]> = {
  shipments: ['shipment_no','shipment_direction','shipment_type','reference_no','customer_id','supplier_id','customer_name','supplier_name','sales_person','purchase_person','carrier','forwarder','cha','bl_no','booking_no','pol','pod','origin_country','destination_country','incoterms','payment_terms','current_status','current_milestone','eta','previous_eta','etd','vessel','voyage','last_event','last_location','source','confidence','review_status','risk_status','created_by','last_checked_at','closed_at','error'],
  containers: ['shipment_id','container_no','container_type','seal_no','gross_weight','net_weight','packages','current_status','current_location','eta','last_event','last_checked_at'],
  shipment_milestones: ['shipment_id','milestone_name','milestone_type','planned_date','actual_date','status','delay_days','owner_name','remarks'],
  documents: ['shipment_id','document_type','document_no','document_date','received_date','sent_date','status','file_path','file_url','remarks'],
  carrier_rules: ['carrier','active','tracking_url_pattern','number_type','fetch_mode','input_selector','submit_selector','result_selector','status_regex','eta_regex','etd_regex','vessel_regex','voyage_regex','location_regex','event_regex','captcha_keywords','parser_mode','wait_strategy','wait_seconds','notes'],
  tracking_jobs: ['shipment_id','carrier','tracking_number','tracking_number_type','job_status','attempts','priority','next_run_at','locked_at','locked_by','last_error'],
  manual_reviews: ['shipment_id','tracking_job_id','carrier','tracking_number','reason','carrier_url','manual_text','parsed_json','review_status','reviewed_by'],
  alerts: ['shipment_id','alert_type','severity','message','status','sent_to'],
  settings: ['key','value','description'],
};

const allowedFilters: Record<string, string[]> = Object.fromEntries(
  Object.entries(allowedFields).map(([name, fields]) => [name, [...fields, 'id', 'created_at', 'updated_at']]),
);
const idColumns: Record<string, string> = { settings: 'key' };

function assertKnownTable(name: string) {
  if (!allowedFields[name]) throw new Error(`Unsupported table: ${name}`);
}

function sanitizeBody(name: string, body: unknown) {
  assertKnownTable(name);
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Request body must be an object');
  return Object.fromEntries(
    Object.entries(body as Record<string, unknown>).filter(([key, value]) => allowedFields[name].includes(key) && value !== undefined),
  );
}

function sanitizeFilters(name: string, query?: Record<string, string>) {
  assertKnownTable(name);
  return Object.entries(query ?? {}).filter(([key, value]) => allowedFilters[name].includes(key) && value !== undefined && value !== '');
}

export async function listRows(name: string, query?: Record<string, string>) {
  const builder = await table(name);
  let request = builder.select('*');
  sanitizeFilters(name, query).forEach(([key, value]) => {
    request = request.eq(key, value);
  });
  const { data, error } = await request.limit(200);
  if (error) throw error;
  return data;
}

export async function getRow(name: string, id: string) {
  assertKnownTable(name);
  const { data, error } = await (await table(name)).select('*').eq(idColumns[name] ?? 'id', id).single();
  if (error) throw error;
  return data;
}

export async function insertRow(name: string, body: unknown) {
  const payload = sanitizeBody(name, body);
  const { data, error } = await (await table(name)).insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateRow(name: string, id: string, body: unknown) {
  const payload = sanitizeBody(name, body);
  const { data, error } = await (await table(name)).update(payload).eq(idColumns[name] ?? 'id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteRow(name: string, id: string) {
  assertKnownTable(name);
  const { error } = await (await table(name)).delete().eq(idColumns[name] ?? 'id', id);
  if (error) throw error;
  return { ok: true };
}

export async function signedUploadUrl(documentId: string, filename: string) {
  if (!supabase) throw new Error('Supabase not configured');
  if (!/^[\w .()-]{1,180}$/.test(filename)) throw new Error('Invalid filename');

  const { data: doc, error: docError } = await supabase
    .from('documents')
    .select('id, shipment_id')
    .eq('id', documentId)
    .single();
  if (docError) throw docError;

  const safeName = filename.replace(/\s+/g, '-');
  const path = `shipments/${doc.shipment_id}/documents/${documentId}/${randomUUID()}-${safeName}`;
  const { data, error } = await supabase.storage.from('shipment-documents').createSignedUploadUrl(path);
  if (error) throw error;
  await supabase.from('documents').update({ file_path: path }).eq('id', documentId);
  return data;
}
