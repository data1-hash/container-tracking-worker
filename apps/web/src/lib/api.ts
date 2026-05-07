import * as mock from '../data/mockData';
import { supabase } from './supabase';

const mockMode = (import.meta.env.VITE_API_MODE ?? 'mock') === 'mock';
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

async function authHeaders() {
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = { 'Content-Type': 'application/json', ...(await authHeaders()), ...init.headers };
  const res = await fetch(`${baseUrl}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export const api = {
  summary: () => (mockMode ? Promise.resolve(mock.summary) : request('/api/dashboard/summary')),
  shipments: () => (mockMode ? Promise.resolve(mock.shipments) : request('/api/shipments')),
  shipment: (id: string) => (mockMode ? Promise.resolve(mock.shipments.find((s) => s.id === id) ?? mock.shipments[0]) : request(`/api/shipments/${id}`)),
  containers: (shipmentId?: string) => Promise.resolve(mock.containers.filter((c) => !shipmentId || c.shipment_id === shipmentId)),
  milestones: (shipmentId?: string) => (mockMode || !shipmentId ? Promise.resolve(mock.milestones.filter((m) => !shipmentId || m.shipment_id === shipmentId)) : request(`/api/shipments/${shipmentId}/timeline`)),
  documents: (shipmentId?: string) => (mockMode || !shipmentId ? Promise.resolve(mock.documents.filter((d) => !shipmentId || d.shipment_id === shipmentId)) : request(`/api/shipments/${shipmentId}/documents`)),
  events: (shipmentId?: string) => (mockMode || !shipmentId ? Promise.resolve(mock.events.filter((e) => !shipmentId || e.shipment_id === shipmentId)) : request(`/api/shipments/${shipmentId}/events`)),
  reviews: () => (mockMode ? Promise.resolve(mock.manualReviews) : request('/api/manual-reviews')),
  jobs: () => (mockMode ? Promise.resolve(mock.trackingJobs) : request('/api/tracking-jobs')),
  alerts: () => (mockMode ? Promise.resolve(mock.alerts) : request('/api/alerts')),
  carrierRules: () => (mockMode ? Promise.resolve(mock.carrierRules) : request('/api/carrier-rules')),
};
