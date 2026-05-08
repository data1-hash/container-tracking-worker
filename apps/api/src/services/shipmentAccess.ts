import type { AuthContext, Role } from '../auth.js';
import { table } from '../db.js';
import { deleteRow, insertRow, sanitizeFilters, updateRow } from './crud.js';

const EMPTY_UUID = '00000000-0000-0000-0000-000000000000';
const ALL_SHIPMENTS_ROLES: Role[] = ['ADMIN', 'MANAGER', 'LOGISTICS', 'VIEWER'];
const WRITE_ALL_SHIPMENTS_ROLES: Role[] = ['ADMIN', 'MANAGER', 'LOGISTICS'];
const ADMIN_MANAGER_ROLES: Role[] = ['ADMIN', 'MANAGER'];

interface ShipmentAccessRow {
  id: string;
  sales_person: string | null;
  shipment_direction: string | null;
}

function isRole(auth: AuthContext, roles: Role[]) {
  return roles.includes(auth.role);
}

export function canReadShipment(auth: AuthContext, shipment: ShipmentAccessRow) {
  if (isRole(auth, ALL_SHIPMENTS_ROLES)) return true;
  if (auth.role === 'SALES') return Boolean(auth.fullName && shipment.sales_person === auth.fullName);
  if (auth.role === 'PURCHASE') return shipment.shipment_direction === 'IMPORT';
  return false;
}

export function canCreateShipment(auth: AuthContext) {
  return isRole(auth, ADMIN_MANAGER_ROLES);
}

export function canUpdateShipment(auth: AuthContext, shipment: ShipmentAccessRow, body: unknown) {
  if (isRole(auth, WRITE_ALL_SHIPMENTS_ROLES)) return true;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return false;

  const patch = body as Record<string, unknown>;
  if (auth.role === 'SALES') {
    return Boolean(
      auth.fullName &&
        shipment.sales_person === auth.fullName &&
        (patch.sales_person === undefined || patch.sales_person === auth.fullName),
    );
  }

  if (auth.role === 'PURCHASE') {
    return (
      shipment.shipment_direction === 'IMPORT' &&
      (patch.shipment_direction === undefined || patch.shipment_direction === 'IMPORT')
    );
  }

  return false;
}

export function canDeleteShipment(auth: AuthContext) {
  return isRole(auth, ADMIN_MANAGER_ROLES);
}

function assertAllowed(allowed: boolean) {
  if (!allowed) {
    const error = new Error('Insufficient shipment permissions');
    Object.assign(error, { status: 403 });
    throw error;
  }
}

function applyShipmentScope<QueryBuilder extends { eq: (column: string, value: string) => QueryBuilder }>(
  request: QueryBuilder,
  auth: AuthContext,
) {
  if (isRole(auth, ALL_SHIPMENTS_ROLES)) return request;
  if (auth.role === 'SALES') return request.eq('sales_person', auth.fullName ?? EMPTY_UUID);
  if (auth.role === 'PURCHASE') return request.eq('shipment_direction', 'IMPORT');
  return request.eq('id', EMPTY_UUID);
}

export async function listShipments(auth: AuthContext, query?: Record<string, string>) {
  let request = applyShipmentScope((await table('shipments')).select('*'), auth);
  sanitizeFilters('shipments', query).forEach(([key, value]) => {
    request = request.eq(key, value);
  });

  const { data, error } = await request.limit(200);
  if (error) throw error;
  return data;
}

async function getShipmentAccessRow(id: string) {
  const { data, error } = await (await table('shipments'))
    .select('id, sales_person, shipment_direction')
    .eq('id', id)
    .single<ShipmentAccessRow>();
  if (error) throw error;
  return data;
}

export async function getShipment(auth: AuthContext, id: string) {
  const shipment = await getShipmentAccessRow(id);
  assertAllowed(canReadShipment(auth, shipment));

  const { data, error } = await (await table('shipments')).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createShipment(auth: AuthContext, body: unknown) {
  assertAllowed(canCreateShipment(auth));
  return insertRow('shipments', { ...(body as Record<string, unknown>), created_by: auth.user.id });
}

export async function modifyShipment(auth: AuthContext, id: string, body: unknown) {
  const shipment = await getShipmentAccessRow(id);
  assertAllowed(canUpdateShipment(auth, shipment, body));
  return updateRow('shipments', id, body);
}

export async function removeShipment(auth: AuthContext, id: string) {
  assertAllowed(canDeleteShipment(auth));
  return deleteRow('shipments', id);
}

export async function assertCanReadShipment(auth: AuthContext, id: string) {
  const shipment = await getShipmentAccessRow(id);
  assertAllowed(canReadShipment(auth, shipment));
}

export async function assertCanManageShipmentTracking(auth: AuthContext, id: string) {
  assertAllowed(isRole(auth, WRITE_ALL_SHIPMENTS_ROLES));
  await getShipmentAccessRow(id);
}
