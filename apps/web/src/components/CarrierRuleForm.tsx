export function CarrierRuleForm() {
  return (
    <div className="card">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow">Safe automation</p>
          <h2 className="mt-1 text-xl font-black">Carrier rule designer</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Use <span className="font-bold text-slate-800">{'{number}'}</span> in URL patterns. CAPTCHA, login, and human verification must route to Manual Review.
          </p>
        </div>
        <button className="btn">Save rule</button>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input className="input" placeholder="Carrier" />
        <input className="input xl:col-span-2" placeholder="Tracking URL pattern" />
        <select className="input"><option>BROWSER</option><option>URLFETCH</option><option>MANUAL</option></select>
        <input className="input" placeholder="Input selector" />
        <input className="input" placeholder="Submit selector" />
        <input className="input" placeholder="Status regex" />
        <input className="input" placeholder="ETA regex" />
      </div>
    </div>
  );
}
