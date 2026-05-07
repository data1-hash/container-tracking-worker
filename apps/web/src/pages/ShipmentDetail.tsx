import type { Alert, Container, DocumentRecord, ManualReview, Shipment, ShipmentMilestone, TrackingEvent } from '@voraco/shared';
import { ContainerTable } from '../components/ContainerTable';
import { DocumentList } from '../components/DocumentList';
import { ManualReviewPanel } from '../components/ManualReviewPanel';
import { ShipmentTimeline } from '../components/ShipmentTimeline';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../lib/utils';

export function ShipmentDetail({ shipment, containers, milestones, documents, events, alerts, reviews }: { shipment: Shipment; containers: Container[]; milestones: ShipmentMilestone[]; documents: DocumentRecord[]; events: TrackingEvent[]; alerts: Alert[]; reviews: ManualReview[] }) {
  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/60">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2"><StatusBadge value={shipment.shipment_direction} /><StatusBadge value={shipment.risk_status} /></div>
            <h2 className="mt-4 text-4xl font-black tracking-tight">{shipment.shipment_no}</h2>
            <p className="mt-2 text-lg text-slate-300">{shipment.pol} → {shipment.pod}</p>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-300 sm:grid-cols-3">
              <span>ETA <b className="text-white">{formatDate(shipment.eta)}</b></span>
              <span>BL/Booking <b className="text-white">{shipment.bl_no ?? shipment.booking_no}</b></span>
              <span>Confidence <b className="text-white">{shipment.confidence}%</b></span>
            </div>
          </div>
          <div className="flex gap-2"><button className="btn">Enqueue Tracking</button><button className="btn-secondary bg-white/10 text-white hover:text-blue-200">Mark Closed</button></div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <div className="panel"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Carrier</p><p className="mt-2 text-lg font-black">{shipment.carrier}</p></div>
        <div className="panel"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Vessel</p><p className="mt-2 text-lg font-black">{shipment.vessel}</p></div>
        <div className="panel"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer</p><p className="mt-2 text-lg font-black">{shipment.customer_name}</p></div>
        <div className="panel"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Milestone</p><p className="mt-2 text-lg font-black">{shipment.current_milestone}</p></div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5"><ContainerTable containers={containers} /><DocumentList documents={documents} /></div>
        <ShipmentTimeline items={milestones} />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="card"><p className="eyebrow">Tracking events</p><h2 className="mt-1 text-xl font-black">Latest carrier updates</h2><div className="mt-5 space-y-3">{events.map((event) => <div key={event.id} className="rounded-2xl bg-slate-50 p-4 text-sm"><b>{event.status}</b><p className="mt-1 text-slate-500">{event.location} · {formatDate(event.event_date)}</p></div>)}</div></div>
        <div className="card"><p className="eyebrow">Alerts</p><h2 className="mt-1 text-xl font-black">Open exceptions</h2><div className="mt-5 space-y-3">{alerts.map((alert) => <div key={alert.id} className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800"><b>{alert.alert_type}</b><p className="mt-1">{alert.message}</p></div>)}</div></div>
      </section>

      <ManualReviewPanel reviews={reviews} />
    </div>
  );
}
