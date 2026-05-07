import type { ManualReview } from '@voraco/shared';
import { StatusBadge } from './StatusBadge';

export function ManualReviewPanel({ reviews }: { reviews: ManualReview[] }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Human review</p>
          <h2 className="mt-1 text-xl font-black">Manual review queue</h2>
        </div>
        <StatusBadge value={`${reviews.length} pending`} />
      </div>
      <div className="mt-5 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-3xl border border-purple-100 bg-purple-50/60 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-black text-slate-950">{review.carrier} · {review.tracking_number}</p>
                <p className="mt-1 text-sm text-slate-600">{review.reason}</p>
                <p className="mt-2 break-all text-xs font-semibold text-purple-700">{review.carrier_url}</p>
              </div>
              <StatusBadge value={review.review_status} />
            </div>
            <textarea className="input mt-4 min-h-28 w-full" placeholder="Paste visible carrier tracking text for parser preview. CAPTCHA and login pages remain manual." />
            <div className="mt-3 flex gap-2">
              <button className="btn">Run parser preview</button>
              <button className="btn-secondary">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
