import type { TrackingJob } from '@voraco/shared';
import { StatusBadge } from './StatusBadge';

export function QueuePanel({ jobs }: { jobs: TrackingJob[] }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Automation</p>
          <h2 className="mt-1 text-xl font-black">Tracking queue</h2>
        </div>
        <button className="btn">Enqueue job</button>
      </div>
      <div className="mt-5 grid gap-3">
        {jobs.map((job) => (
          <div key={job.id} className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto_auto] md:items-center">
            <div>
              <p className="font-black text-slate-950">{job.carrier}</p>
              <p className="mt-1 text-sm text-slate-500">{job.tracking_number_type ?? 'Tracking'} · {job.tracking_number}</p>
            </div>
            <div className="text-sm font-bold text-slate-500">Attempts {job.attempts}</div>
            <StatusBadge value={job.job_status} />
          </div>
        ))}
      </div>
    </div>
  );
}
