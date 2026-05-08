import { Bell, ChevronDown } from 'lucide-react';

const subtitles: Record<string, string> = {
  'Exception Queue': 'Action required for exceptions that need human attention.',
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
    <header className="sticky top-0 z-20 border-b border-blue-300/10 bg-slate-950/75 px-4 py-4 backdrop-blur-xl lg:px-7">
      <div className="flex items-center justify-end gap-4">
        <div className="mr-auto lg:hidden">
          <h1 className="text-xl font-black text-white">{page}</h1>
          <p className="text-sm text-slate-400">{subtitles[page] ?? 'Operational controls and shipment visibility.'}</p>
        </div>
        <button className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-700/80 bg-slate-900/80 text-slate-200">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-xs font-black text-white">8</span>
        </button>
        <div className="hidden h-9 w-px bg-slate-700/70 sm:block" />
        <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-left transition hover:bg-slate-900/80">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-700 text-sm font-black text-white">OP</span>
          <span className="hidden sm:block">
            <span className="block text-sm font-black text-white">Ops Team</span>
            <span className="block text-xs text-slate-300">Operations</span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-slate-300 sm:block" />
        </button>
      </div>
    </header>
  );
}
