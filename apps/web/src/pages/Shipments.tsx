import type { Shipment } from '@voraco/shared';
import { ShipmentTable } from '../components/ShipmentTable';

export function Shipments({ shipments, onOpen }: { shipments: Shipment[]; onOpen: (id: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="card">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="eyebrow">Search & filter</p>
            <h2 className="mt-1 text-xl font-black">Find shipment files fast</h2>
          </div>
          <button className="btn">Add shipment</button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <input className="input md:col-span-2" placeholder="Search shipment, BL, container, booking, customer" />
          <select className="input"><option>All directions</option><option>IMPORT</option><option>EXPORT</option></select>
          <select className="input"><option>All statuses</option><option>IN TRANSIT</option><option>DELAYED</option></select>
          <select className="input"><option>All carriers</option></select>
          <select className="input"><option>All risk levels</option></select>
        </div>
      </div>
      <ShipmentTable shipments={shipments} onOpen={onOpen} />
    </div>
  );
}
