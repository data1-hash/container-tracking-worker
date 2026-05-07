export function Settings() {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="card">
        <p className="eyebrow">Workspace</p>
        <h2 className="mt-1 text-2xl font-black">App settings</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">Tune worker cadence, alert behavior, and safe tracking defaults for the operations team.</p>
      </div>
      <div className="card">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">Worker mode<input className="input" defaultValue="Queue automation" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Batch limit<input className="input" defaultValue="10" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Alert ETA changes<input className="input" defaultValue="Enabled" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Manual review threshold<input className="input" defaultValue="30% confidence" /></label>
        </div>
      </div>
    </div>
  );
}
