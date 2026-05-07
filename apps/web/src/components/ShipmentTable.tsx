import type { Shipment } from '@voraco/shared';
import { formatDate } from '../lib/utils';
import { StatusBadge } from './StatusBadge';

export function ShipmentTable({ shipments, onOpen }: { shipments: Shipment[]; onOpen?: (id: string) => void }) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-black text-slate-950">Shipment portfolio</h2>
          <p className="text-sm text-slate-500">BL, booking, carrier, risk, and ETA in one operating table.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{shipments.length} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">Shipment</th>
              <th>Route</th>
              <th>Parties</th>
              <th>Carrier</th>
              <th>ETA</th>
              <th>Status</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shipments.map((shipment) => (
              <tr key={shipment.id} onClick={() => onOpen?.(shipment.id)} className="cursor-pointer bg-white transition hover:bg-blue-50/50">
                <td className="px-6 py-5">
                  <div className="font-black text-slate-950">{shipment.shipment_no}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-400">{shipment.bl_no ?? shipment.booking_no ?? 'No BL/booking'}</div>
                </td>
                <td>
                  <div className="font-semibold text-slate-700">{shipment.pol} → {shipment.pod}</div>
                  <div className="mt-1 text-xs text-slate-400">{shipment.shipment_direction}</div>
                </td>
                <td>
                  <div className="font-semibold text-slate-700">{shipment.customer_name}</div>
                  <div className="mt-1 text-xs text-slate-400">{shipment.supplier_name}</div>
                </td>
                <td>
                  <div className="font-semibold text-slate-700">{shipment.carrier}</div>
                  <div className="mt-1 text-xs text-slate-400">{shipment.vessel} · {shipment.voyage}</div>
                </td>
                <td className="font-semibold text-slate-700">{formatDate(shipment.eta)}</td>
                <td><StatusBadge value={shipment.current_status} /></td>
                <td><StatusBadge value={shipment.risk_status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
