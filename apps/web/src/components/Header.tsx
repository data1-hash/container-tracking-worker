const subtitles: Record<string, string> = {
  Dashboard: 'Live operating view for imports, exports, milestones, alerts, and tracking work.',
  Shipments: 'Search, filter, and open shipment files across all directions.',
  Imports: 'Inbound workflow visibility from PO through delivery and empty return.',
  Exports: 'Outbound milestone control from sales order through document follow-up.',
  'Manual Review': 'Human-in-the-loop queue for CAPTCHA, login walls, and low-confidence parses.',
  'Carrier Rules': 'Configure safe carrier parser rules with manual review fallback.',
  'Tracking Queue': 'Monitor scheduled jobs, retries, failures, and manual review outcomes.',
};

export function Header({ page }: { page: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 px-5 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow">Import / Export Shipment Tracker</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{page}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{subtitles[page] ?? 'Operational controls and shipment visibility.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm sm:block">
            07 May 2026 · UTC
          </div>
          <button className="btn-secondary">Export view</button>
          <button className="btn">New shipment</button>
        </div>
      </div>
    </header>
  );
}
