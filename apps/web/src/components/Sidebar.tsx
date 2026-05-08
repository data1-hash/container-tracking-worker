import type { ComponentType } from 'react';
import {
  AlertCircle,
  BellRing,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  FileText,
  Home,
  Search,
  Settings,
  Ship,
  TimerReset,
  UploadCloud,
  XCircle,
} from 'lucide-react';

const primaryLinks = [
  { label: 'Exception Queue', icon: BellRing },
  { label: 'Dashboard', icon: Home },
] as const;

const shipmentLinks = [
  { label: 'Shipments', display: 'All Shipments', count: '12,842', icon: ClipboardList },
  { label: 'Tracking Queue', display: 'Auto Tracked', count: '9,215', icon: CheckCircle2 },
  { label: 'Manual Review', display: 'CAPTCHA Required', count: '312', icon: AlertCircle, tone: 'amber' },
  { label: 'Alerts', display: 'Failed Tracking', count: '487', icon: XCircle, tone: 'red' },
  { label: 'Carrier Rules', display: 'Manual ETA Pending', count: '256', icon: CircleAlert, tone: 'violet' },
  { label: 'Exports', display: 'Critical Delay', count: '128', icon: TimerReset, tone: 'red' },
  { label: 'Imports', display: 'Near Arrival', count: '184', icon: Ship, tone: 'cyan' },
] as const;

const toolLinks = [
  { label: 'Shipments', display: 'Search Shipments', icon: Search },
  { label: 'Manual Review', display: 'Bulk Capture', icon: UploadCloud },
  { label: 'Dashboard', display: 'Reports', icon: FileText },
  { label: 'Settings', display: 'Settings', icon: Settings },
] as const;

const toneClasses = {
  amber: 'text-amber-300 bg-amber-500/20',
  red: 'text-red-300 bg-red-500/20',
  violet: 'text-violet-300 bg-violet-500/20',
  cyan: 'text-cyan-300 bg-cyan-500/20',
  default: 'text-slate-300 bg-slate-700/50',
} as const;

const toneIconClasses = {
  amber: 'text-amber-300',
  red: 'text-red-300',
  violet: 'text-violet-300',
  cyan: 'text-cyan-300',
  default: 'text-slate-300',
} as const;

function NavButton({
  label,
  display = label,
  icon: Icon,
  count,
  tone = 'default',
  page,
  setPage,
}: {
  label: string;
  display?: string;
  icon: ComponentType<{ className?: string }>;
  count?: string;
  tone?: keyof typeof toneClasses;
  page: string;
  setPage: (page: string) => void;
}) {
  const active = page === label;

  return (
    <button
      onClick={() => setPage(label)}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition ${
        active ? 'border border-blue-400/60 bg-blue-500/20 text-blue-200 shadow-lg shadow-blue-950/30' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? 'text-blue-300' : toneIconClasses[tone]}`} />
      <span className="min-w-0 flex-1 truncate">{display}</span>
      {count && <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${toneClasses[tone]}`}>{count}</span>}
    </button>
  );
}

export function Sidebar({ page, setPage }: { page: string; setPage: (page: string) => void }) {
  return (
    <aside className="hidden w-80 shrink-0 border-r border-blue-300/15 bg-slate-950/75 p-4 text-white lg:block">
      <div className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col">
        <div className="mb-7 flex items-center gap-3 px-2">
          <div className="grid h-12 w-12 grid-cols-3 grid-rows-3 gap-0.5 text-blue-400">
            {Array.from({ length: 9 }).map((_, index) => <span key={index} className="rounded-sm border border-blue-500/80 bg-blue-500/10" />)}
          </div>
          <div>
            <div className="text-2xl font-black leading-none text-white">Container<span className="text-blue-400">Ops</span></div>
            <p className="mt-1 text-xs font-bold uppercase text-slate-400">Control Tower</p>
          </div>
        </div>

        <nav className="space-y-1">
          {primaryLinks.map((link) => <NavButton key={link.label} {...link} page={page} setPage={setPage} />)}
        </nav>

        <p className="mb-2 mt-7 px-3 text-xs font-bold uppercase text-slate-400">Shipments</p>
        <nav className="space-y-1">
          {shipmentLinks.map((link) => <NavButton key={link.display} {...link} page={page} setPage={setPage} />)}
        </nav>

        <p className="mb-2 mt-7 px-3 text-xs font-bold uppercase text-slate-400">Tools</p>
        <nav className="space-y-1">
          {toolLinks.map((link) => <NavButton key={link.display} {...link} page={page} setPage={setPage} />)}
        </nav>

        <div className="mt-auto rounded-lg border border-slate-700/80 bg-slate-900/75 p-4 shadow-xl shadow-black/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-500/20"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></span>
              <div>
                <p className="font-black text-white">System Status</p>
                <p className="mt-2 text-sm text-slate-300">All systems operational</p>
              </div>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white"><CheckCircle2 className="h-5 w-5" /></span>
          </div>
          <button className="mt-4 text-sm font-bold text-blue-300">View system health -&gt;</button>
        </div>
      </div>
    </aside>
  );
}
