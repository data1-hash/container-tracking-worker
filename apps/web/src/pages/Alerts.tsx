import type { Alert } from '@voraco/shared';
import { StatusBadge } from '../components/StatusBadge';

export function Alerts({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="card">
      <p className="eyebrow">Exception management</p>
      <h2 className="mt-1 text-xl font-black">Open alerts</h2>
      <div className="mt-5 grid gap-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div><p className="font-black text-slate-950">{alert.alert_type}</p><p className="mt-1 text-sm text-slate-500">{alert.message}</p></div>
              <StatusBadge value={alert.severity} />
            </div>
            <div className="mt-4 flex gap-2"><button className="btn-secondary">Acknowledge</button><button className="btn-secondary">Close</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
