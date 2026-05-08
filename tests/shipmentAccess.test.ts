import { describe, expect, it } from 'vitest';
import type { AuthContext } from '../apps/api/src/auth.js';
import {
  canCreateShipment,
  canDeleteShipment,
  canReadShipment,
  canUpdateShipment,
} from '../apps/api/src/services/shipmentAccess.js';

const user = { id: 'user-1' } as AuthContext['user'];
const assignedSales = { id: 'shipment-1', sales_person: 'Sam Sales', shipment_direction: 'EXPORT' };
const importShipment = { id: 'shipment-2', sales_person: 'Other Seller', shipment_direction: 'IMPORT' };

function auth(role: AuthContext['role'], fullName?: string): AuthContext {
  return { user, role, fullName };
}

describe('shipment access rules', () => {
  it('limits sales users to assigned shipments', () => {
    expect(canReadShipment(auth('SALES', 'Sam Sales'), assignedSales)).toBe(true);
    expect(canReadShipment(auth('SALES', 'Sam Sales'), importShipment)).toBe(false);
    expect(canReadShipment(auth('SALES'), assignedSales)).toBe(false);
  });

  it('limits purchase users to import shipments', () => {
    expect(canReadShipment(auth('PURCHASE'), importShipment)).toBe(true);
    expect(canReadShipment(auth('PURCHASE'), assignedSales)).toBe(false);
  });

  it('prevents viewers and scoped roles from creating or deleting shipments', () => {
    expect(canCreateShipment(auth('ADMIN'))).toBe(true);
    expect(canCreateShipment(auth('VIEWER'))).toBe(false);
    expect(canDeleteShipment(auth('MANAGER'))).toBe(true);
    expect(canDeleteShipment(auth('LOGISTICS'))).toBe(false);
  });

  it('allows only scoped shipment updates for sales and purchase users', () => {
    expect(canUpdateShipment(auth('SALES', 'Sam Sales'), assignedSales, { current_status: 'OPEN' })).toBe(true);
    expect(canUpdateShipment(auth('SALES', 'Sam Sales'), assignedSales, { sales_person: 'Other Seller' })).toBe(
      false,
    );
    expect(canUpdateShipment(auth('PURCHASE'), importShipment, { current_status: 'OPEN' })).toBe(true);
    expect(canUpdateShipment(auth('PURCHASE'), importShipment, { shipment_direction: 'EXPORT' })).toBe(false);
    expect(canUpdateShipment(auth('VIEWER'), importShipment, { current_status: 'OPEN' })).toBe(false);
  });
});
