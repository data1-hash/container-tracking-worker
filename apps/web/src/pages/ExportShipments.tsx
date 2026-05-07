import { EXPORT_MILESTONES, type Shipment } from '@voraco/shared';
import { ShipmentTable } from '../components/ShipmentTable';

export function ExportShipments({ shipments, onOpen }: { shipments: Shipment[]; onOpen: (id: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="card">
        <p className="eyebrow">Outbound workflow</p>
        <h2 className="mt-1 text-2xl font-black">Export execution board</h2>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {EXPORT_MILESTONES.map((milestone) => <span key={milestone} className="shrink-0 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">{milestone}</span>)}
        </div>
      </div>
      <ShipmentTable shipments={shipments.filter((shipment) => shipment.shipment_direction === 'EXPORT')} onOpen={onOpen} />
    </div>
  );
}
