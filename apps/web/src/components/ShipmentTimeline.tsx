import type { ShipmentMilestone } from '@voraco/shared';
import { StatusBadge } from './StatusBadge';

export function ShipmentTimeline({ items }: { items: ShipmentMilestone[] }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Milestones</p>
          <h2 className="mt-1 text-xl font-black">Timeline</h2>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{items.length} steps</span>
      </div>
      <div className="mt-6 space-y-4">
        {items.map((milestone, index) => (
          <div key={milestone.id} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-blue-700 text-xs font-black text-white">{index + 1}</div>
              {index < items.length - 1 && <div className="mt-2 h-full min-h-8 w-px bg-slate-200" />}
            </div>
            <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{milestone.milestone_name}</p>
                  <p className="mt-1 text-xs text-slate-500">Owner {milestone.owner_name ?? 'Logistics'} · Delay {milestone.delay_days ?? 0} days</p>
                </div>
                <StatusBadge value={milestone.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
