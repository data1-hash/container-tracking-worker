import { cx } from '../lib/utils';
export function StatusBadge({ value }: { value?: string }) { const v = value ?? 'UNKNOWN'; return <span className={cx('rounded-full px-2.5 py-1 text-xs font-semibold', v.includes('DELAY') || v === 'CRITICAL' ? 'bg-red-100 text-red-700' : v.includes('PENDING') || v === 'WARNING' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')}>{v}</span>; }
