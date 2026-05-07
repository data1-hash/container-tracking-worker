import type { Container } from '@voraco/shared';
import { StatusBadge } from './StatusBadge';

export function ContainerTable({ containers }: { containers: Container[] }) {
  return (
    <div className="card">
      <p className="eyebrow">Equipment</p>
      <h2 className="mt-1 text-xl font-black">Containers</h2>
      <div className="mt-5 grid gap-3">
        {containers.map((container) => (
          <div key={container.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black tracking-wide text-slate-950">{container.container_no}</p>
                <p className="mt-1 text-sm text-slate-500">{container.container_type} · Seal {container.seal_no ?? '—'}</p>
              </div>
              <StatusBadge value={container.current_status} />
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-600">📍 {container.current_location ?? 'Location pending'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
