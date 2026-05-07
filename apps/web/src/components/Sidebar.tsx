const links = [
  ['Dashboard', '⌁'],
  ['Shipments', '▦'],
  ['Imports', '↓'],
  ['Exports', '↑'],
  ['Manual Review', '!'],
  ['Carrier Rules', '⚙'],
  ['Tracking Queue', '↻'],
  ['Alerts', '◆'],
  ['Settings', '☷'],
] as const;

export function Sidebar({ page, setPage }: { page: string; setPage: (page: string) => void }) {
  return (
    <aside className="hidden w-80 shrink-0 p-5 lg:block">
      <div className="sticky top-5 rounded-[2rem] border border-white/10 bg-slate-950/85 p-5 text-white shadow-2xl shadow-slate-950/30 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-xl font-black">V</div>
          <div>
            <div className="text-lg font-black tracking-tight">Voraco</div>
            <p className="text-xs font-medium text-slate-400">Shipment Command Center</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-blue-400/20 bg-blue-500/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Mode</p>
          <p className="mt-2 text-sm text-slate-200">Mock-safe demo workspace. No real carrier calls from UI.</p>
        </div>

        <nav className="mt-6 space-y-1.5">
          {links.map(([link, icon]) => (
            <button
              key={link}
              onClick={() => setPage(link)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                page === link ? 'bg-white text-slate-950 shadow-lg shadow-black/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-xs">{icon}</span>
              {link}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
