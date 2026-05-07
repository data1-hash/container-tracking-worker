export function StatCard({ label, value, helper, accent = 'from-blue-600 to-cyan-500' }: { label: string; value: number | string; helper?: string; accent?: string }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white p-5 shadow-xl shadow-slate-200/70 transition hover:-translate-y-1">
      <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-[3rem] bg-gradient-to-br ${accent} opacity-10 transition group-hover:opacity-20`} />
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      {helper && <p className="mt-2 text-xs font-semibold text-slate-400">{helper}</p>}
    </div>
  );
}
