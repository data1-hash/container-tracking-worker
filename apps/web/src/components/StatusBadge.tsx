import { cx } from '../lib/utils';

const toneMap: Record<string, string> = {
  DELAYED: 'bg-red-50 text-red-700 ring-red-200',
  HIGH: 'bg-red-50 text-red-700 ring-red-200',
  CRITICAL: 'bg-red-50 text-red-700 ring-red-200',
  WARNING: 'bg-amber-50 text-amber-700 ring-amber-200',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
  MANUAL_REVIEW: 'bg-purple-50 text-purple-700 ring-purple-200',
  RUNNING: 'bg-blue-50 text-blue-700 ring-blue-200',
  NORMAL: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  DONE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  OPEN: 'bg-sky-50 text-sky-700 ring-sky-200',
};

export function StatusBadge({ value }: { value?: string }) {
  const normalized = (value ?? 'UNKNOWN').replace(/\s+/g, '_').toUpperCase();
  const tone = toneMap[normalized] ?? 'bg-slate-100 text-slate-700 ring-slate-200';

  return (
    <span className={cx('inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1', tone)}>
      {normalized.replace(/_/g, ' ')}
    </span>
  );
}
