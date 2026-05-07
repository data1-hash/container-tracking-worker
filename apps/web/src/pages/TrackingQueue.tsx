import type { TrackingJob } from '@voraco/shared';
import { QueuePanel } from '../components/QueuePanel';

export function TrackingQueue({ jobs }: { jobs: TrackingJob[] }) {
  const pending = jobs.filter((job) => job.job_status === 'PENDING').length;
  const manual = jobs.filter((job) => job.job_status === 'MANUAL_REVIEW').length;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel"><p className="text-sm text-slate-500">Pending jobs</p><p className="mt-2 text-3xl font-black">{pending}</p></div>
        <div className="panel"><p className="text-sm text-slate-500">Manual review</p><p className="mt-2 text-3xl font-black">{manual}</p></div>
        <div className="panel"><p className="text-sm text-slate-500">Total jobs</p><p className="mt-2 text-3xl font-black">{jobs.length}</p></div>
      </div>
      <QueuePanel jobs={jobs} />
    </div>
  );
}
