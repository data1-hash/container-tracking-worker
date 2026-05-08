import {
  Bell,
  CalendarClock,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Filter,
  Link2Off,
  MoreVertical,
  RefreshCw,
  Search,
  ShieldCheck,
  Ship,
  Sparkles,
  Star,
  TimerReset,
} from 'lucide-react';

const metrics = [
  {
    label: 'CAPTCHA Required',
    value: '312',
    delta: '+18 from yesterday',
    action: 'View all',
    accent: 'amber',
    icon: ShieldCheck,
  },
  {
    label: 'Failed Tracking',
    value: '487',
    delta: '+25 from yesterday',
    action: 'View all',
    accent: 'red',
    icon: Link2Off,
  },
  {
    label: 'Manual ETA Missing',
    value: '256',
    delta: '+12 from yesterday',
    action: 'View all',
    accent: 'violet',
    icon: CalendarClock,
  },
  {
    label: 'Near Arrival (72h)',
    value: '184',
    delta: '+7 from yesterday',
    action: 'View all',
    accent: 'cyan',
    icon: Ship,
  },
] as const;

const rows = [
  {
    id: 'TCLU 8567421',
    tag: 'CAPTCHA',
    company: 'Evergreen Marine',
    route: 'Shanghai, CN -> Los Angeles, US',
    carrier: 'EVERGREEN',
    voyage: 'AE123W',
    eta: 'May 28, 2025',
    age: '(2 days ago)',
    status: 'CAPTCHA detected',
    detail: 'Interaction required',
    action: 'Capture',
    accent: 'amber',
  },
  {
    id: 'MSCU 7891234',
    tag: 'FAILED TRACKING',
    company: 'Walmart Global',
    route: 'Singapore, SG -> New York, US',
    carrier: 'MSC',
    voyage: 'SWX12R',
    eta: 'May 26, 2025',
    age: '(4 days ago)',
    status: 'Extraction failed',
    detail: 'Structure changed',
    action: 'Retry',
    accent: 'red',
  },
  {
    id: 'CMAU 1234567',
    tag: 'MANUAL ETA',
    company: 'Target Corporation',
    route: 'Ningbo, CN -> Savannah, US',
    carrier: 'CMA CGM',
    voyage: 'AA47W',
    eta: 'No ETA available',
    age: 'MISSING',
    status: 'Manual ETA missing',
    detail: 'Provide estimated arrival',
    action: 'Enter Manual ETA',
    accent: 'violet',
  },
  {
    id: 'HLCU 4567890',
    tag: 'NEAR ARRIVAL',
    company: 'Home Depot',
    route: 'Busan, KR -> Long Beach, US',
    carrier: 'Hapag-Lloyd',
    voyage: 'TN25W',
    eta: 'May 31, 2025',
    age: '(1 day)',
    status: 'Arriving in 36 hours',
    detail: 'Monitor for updates',
    action: 'Track Now',
    accent: 'cyan',
  },
  {
    id: 'ZCSU 9876543',
    tag: 'FAILED TRACKING',
    company: 'Costco Wholesale',
    route: 'Yantian, CN -> Seattle, US',
    carrier: 'ZIM',
    voyage: 'ZIM7W',
    eta: 'May 25, 2025',
    age: '(5 days ago)',
    status: 'Extraction failed',
    detail: 'Timeout waiting for data',
    action: 'Retry',
    accent: 'red',
  },
  {
    id: 'OOLU 7654321',
    tag: 'CAPTCHA',
    company: "Lowe's Companies",
    route: 'Kaohsiung, TW -> Oakland, US',
    carrier: 'OOCL',
    voyage: 'TPA3W',
    eta: 'May 27, 2025',
    age: '(3 days ago)',
    status: 'CAPTCHA detected',
    detail: 'Interaction required',
    action: 'Capture',
    accent: 'amber',
  },
] as const;

const accentClasses = {
  amber: {
    border: 'border-l-amber-400',
    text: 'text-amber-300',
    bg: 'bg-amber-400/12',
    chip: 'bg-amber-500/18 text-amber-200',
    button: 'bg-blue-600 hover:bg-blue-500',
  },
  red: {
    border: 'border-l-red-400',
    text: 'text-red-300',
    bg: 'bg-red-400/12',
    chip: 'bg-red-500/18 text-red-200',
    button: 'bg-blue-600 hover:bg-blue-500',
  },
  violet: {
    border: 'border-l-violet-400',
    text: 'text-violet-300',
    bg: 'bg-violet-400/12',
    chip: 'bg-violet-500/18 text-violet-200',
    button: 'bg-violet-600 hover:bg-violet-500',
  },
  cyan: {
    border: 'border-l-cyan-400',
    text: 'text-cyan-300',
    bg: 'bg-cyan-400/12',
    chip: 'bg-cyan-500/18 text-cyan-200',
    button: 'bg-blue-600 hover:bg-blue-500',
  },
} as const;

function MetricCard({ metric }: { metric: (typeof metrics)[number] }) {
  const Icon = metric.icon;
  const accent = accentClasses[metric.accent];

  return (
    <article className={`queue-card border-l-4 ${accent.border}`}>
      <div className={`grid h-16 w-16 place-items-center rounded-full ${accent.bg}`}>
        <Icon className={`h-8 w-8 ${accent.text}`} />
      </div>
      <div className="min-w-0">
        <strong className={`block text-4xl font-black ${accent.text}`}>{metric.value}</strong>
        <span className="mt-1 block text-base font-bold text-white">{metric.label}</span>
        <span className="mt-2 block text-sm text-slate-300">{metric.delta}</span>
        <button className={`mt-3 inline-flex items-center gap-2 text-sm font-bold ${accent.text}`}>
          {metric.action}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export function ExceptionQueue() {
  return (
    <div className="space-y-4 text-slate-100">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-lg border border-blue-400/40 bg-blue-500/12 text-blue-200 shadow-lg shadow-blue-950/40">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Exception Queue Control</h1>
            <p className="mt-2 text-base text-slate-300">Action required for exceptions that need human attention.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="control-button">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="control-button min-w-56 justify-between">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-400" /> Auto-refresh</span>
            <span className="inline-flex items-center gap-2">30s <ChevronDown className="h-4 w-4" /></span>
          </button>
        </div>
      </section>

      <section className="queue-panel p-4">
        <p className="mb-4 text-sm font-bold uppercase text-slate-300">Today's Work Queue</p>
        <div className="grid gap-4 xl:grid-cols-4">
          {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
        </div>
      </section>

      <section className="queue-panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-700/60 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-black uppercase text-slate-200">Shipments Requiring Action</h2>
            <span className="rounded-full bg-slate-700/50 px-3 py-1 text-sm text-slate-300">Showing 1-6 of 1,239</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="control-button min-w-52 justify-between"><span className="inline-flex items-center gap-2"><Filter className="h-4 w-4" />All Exception Types</span><ChevronDown className="h-4 w-4" /></button>
            <button className="control-button min-w-48 justify-between"><span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" />Sort by: Priority</span><ChevronDown className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1120px] w-full text-left">
            <thead className="bg-slate-800/55 text-xs uppercase text-slate-400">
              <tr>
                <th className="w-12 px-5 py-3"><input aria-label="Select all shipments" type="checkbox" className="h-4 w-4 rounded border-slate-500 bg-transparent" /></th>
                <th className="px-3 py-3">Container / Shipment</th>
                <th className="px-3 py-3">Company</th>
                <th className="px-3 py-3">Route</th>
                <th className="px-3 py-3">Carrier / Voyage</th>
                <th className="px-3 py-3">Last ETA</th>
                <th className="px-3 py-3">Status / Error</th>
                <th className="px-3 py-3">Action</th>
                <th className="w-12 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {rows.map((row) => {
                const accent = accentClasses[row.accent];
                return (
                  <tr key={row.id} className={`border-l-4 ${accent.border} bg-slate-900/28 transition hover:bg-slate-800/55`}>
                    <td className="px-5 py-4"><input aria-label={`Select ${row.id}`} type="checkbox" className="h-4 w-4 rounded border-slate-500 bg-transparent" /></td>
                    <td className="px-3 py-4">
                      <div className="flex items-start gap-3">
                        <Star className="mt-1 h-5 w-5 text-slate-400" />
                        <div>
                          <div className="flex items-center gap-2 text-lg font-semibold text-white">{row.id}<Copy className="h-4 w-4 text-slate-400" /></div>
                          <span className={`mt-1 inline-flex rounded px-2 py-0.5 text-xs font-black ${accent.chip}`}>{row.tag}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-300">{row.company}</td>
                    <td className="px-3 py-4 text-sm text-slate-200">{row.route}</td>
                    <td className="px-3 py-4 text-sm text-slate-300"><span className="block">{row.carrier}</span><span className="text-slate-400">{row.voyage}</span></td>
                    <td className="px-3 py-4 text-sm text-slate-200"><span className="block">{row.eta}</span><span className={row.age === 'MISSING' ? 'rounded bg-amber-500/20 px-1.5 py-0.5 text-xs font-black text-amber-200' : row.age === '(1 day)' ? 'text-emerald-300' : 'text-slate-400'}>{row.age}</span></td>
                    <td className="px-3 py-4 text-sm"><span className={`block font-bold ${accent.text}`}>{row.status}</span><span className="text-slate-400">{row.detail}</span></td>
                    <td className="px-3 py-4">
                      <div className="flex gap-2">
                        {row.action !== 'Enter Manual ETA' && (
                          <button className="row-button bg-slate-950/40 text-slate-100 hover:bg-slate-800">
                            Open Website
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        )}
                        <button className={`row-button text-white ${accent.button} ${row.action === 'Enter Manual ETA' ? 'min-w-52' : ''}`}>
                          {row.action === 'Capture' && <Camera className="h-4 w-4" />}
                          {row.action === 'Retry' && <RefreshCw className="h-4 w-4" />}
                          {row.action === 'Enter Manual ETA' && <CalendarClock className="h-4 w-4" />}
                          {row.action === 'Track Now' && <TimerReset className="h-4 w-4" />}
                          {row.action}
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-4"><button className="icon-button"><MoreVertical className="h-5 w-5" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-700/60 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <button className="icon-button"><ChevronLeft className="h-5 w-5" /></button>
            {[1, 2, 3, 4, 5].map((page) => <button key={page} className={`pagination-button ${page === 1 ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>{page}</button>)}
            <span className="px-2 text-slate-400">...</span>
            <button className="pagination-button text-slate-300 hover:bg-slate-800">207</button>
            <button className="icon-button"><ChevronRight className="h-5 w-5" /></button>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span>Show</span>
            <button className="control-button min-w-20 justify-between">6 <ChevronDown className="h-4 w-4" /></button>
            <span>per page</span>
          </div>
        </div>
      </section>
    </div>
  );
}
