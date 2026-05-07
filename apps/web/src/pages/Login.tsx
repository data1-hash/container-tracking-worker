export function Login() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-8 shadow-2xl">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-700 text-xl font-black text-white">V</div>
        <h1 className="mt-6 text-3xl font-black tracking-tight">Import/Export Shipment Tracker</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Sign in with Supabase Auth to manage shipments, documents, tracking jobs, and manual reviews.</p>
        <div className="mt-6 grid gap-3"><input className="input w-full" placeholder="Email" /><input className="input w-full" placeholder="Password" type="password" /><button className="btn w-full">Sign in</button></div>
      </div>
    </div>
  );
}
