import type { DashboardSummary } from '@voraco/shared';
import { StatCard } from '../components/StatCard';

export function Dashboard({ summary }: { summary: DashboardSummary }) {
  const cards = [
    ['Total active shipments', summary.totalActive, 'Open operating files', 'from-blue-600 to-cyan-500'],
    ['Import shipments', summary.imports, 'Inbound supply chain', 'from-indigo-600 to-blue-500'],
    ['Export shipments', summary.exports, 'Outbound customer orders', 'from-emerald-600 to-teal-500'],
    ['Delayed shipments', summary.delayed, 'Need action today', 'from-red-600 to-orange-500'],
    ['Arriving in 7 days', summary.arrivingThisWeek, 'Plan customs & delivery', 'from-violet-600 to-fuchsia-500'],
    ['Manual review count', summary.manualReviews, 'Human verification queue', 'from-purple-600 to-indigo-500'],
    ['Pending tracking jobs', summary.pendingJobs, 'Automation backlog', 'from-amber-500 to-orange-500'],
    ['Critical alerts', summary.criticalAlerts, 'Escalations', 'from-rose-600 to-red-500'],
  ] as const;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/70">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">Command overview</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight">Stay ahead of ETA changes, document gaps, and carrier tracking exceptions.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Voraco combines import/export workflows, document control, tracking automation, and manual review into a single operations cockpit.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-300"><span>Automation health</span><span>82%</span></div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[82%] rounded-full bg-gradient-to-r from-blue-400 to-emerald-300" /></div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-white/10 p-3"><b className="block text-xl text-white">{summary.pendingJobs}</b>Pending</div><div className="rounded-2xl bg-white/10 p-3"><b className="block text-xl text-white">{summary.manualReviews}</b>Reviews</div></div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, helper, accent]) => <StatCard key={label} label={label} value={value} helper={helper} accent={accent} />)}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="card">
          <p className="eyebrow">Direction mix</p>
          <h2 className="mt-1 text-xl font-black">Import vs Export</h2>
          <div className="mt-5 space-y-4">
            <div><div className="flex justify-between text-sm font-bold"><span>Imports</span><span>{summary.imports}</span></div><div className="mt-2 h-3 rounded-full bg-slate-100"><div className="h-full w-1/2 rounded-full bg-blue-600" /></div></div>
            <div><div className="flex justify-between text-sm font-bold"><span>Exports</span><span>{summary.exports}</span></div><div className="mt-2 h-3 rounded-full bg-slate-100"><div className="h-full w-1/2 rounded-full bg-emerald-500" /></div></div>
          </div>
        </div>
        <div className="card">
          <p className="eyebrow">Status distribution</p>
          <h2 className="mt-1 text-xl font-black">Operating risk</h2>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm font-bold"><div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">Normal<br />{summary.totalActive - summary.delayed}</div><div className="rounded-2xl bg-amber-50 p-4 text-amber-700">Watch<br />{summary.arrivingThisWeek}</div><div className="rounded-2xl bg-red-50 p-4 text-red-700">Delay<br />{summary.delayed}</div></div>
        </div>
        <div className="card">
          <p className="eyebrow">Monthly trend</p>
          <h2 className="mt-1 text-xl font-black">Shipment count</h2>
          <div className="mt-5 flex h-32 items-end gap-3">{[45, 68, 52, 88, 74, 96].map((height, index) => <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-blue-700 to-cyan-400" style={{ height }} />)}</div>
        </div>
      </section>
    </div>
  );
}
