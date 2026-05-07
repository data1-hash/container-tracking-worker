import type { ManualReview as Review } from '@voraco/shared';
import { ManualReviewPanel } from '../components/ManualReviewPanel';

export function ManualReview({ reviews }: { reviews: Review[] }) {
  return (
    <div className="space-y-5">
      <div className="card bg-gradient-to-r from-purple-950 to-slate-950 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-200">Safety first</p>
        <h2 className="mt-2 text-3xl font-black">Blocked carrier pages stay human-reviewed.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-purple-100">CAPTCHA, login walls, and low-confidence parses are never bypassed. Paste visible carrier text, preview extraction, then approve or reject.</p>
      </div>
      <ManualReviewPanel reviews={reviews} />
    </div>
  );
}
