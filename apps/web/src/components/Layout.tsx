import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout({ page, setPage, children }: { page: string; setPage: (p: string) => void; children: React.ReactNode }) {
  return (
    <div className="app-shell flex min-h-screen">
      <Sidebar page={page} setPage={setPage} />
      <main className="min-w-0 flex-1 lg:pr-5">
        <div className="min-h-screen overflow-hidden bg-slate-50/95 shadow-2xl shadow-slate-950/20 lg:my-5 lg:rounded-[2rem]">
          <Header page={page} />
          <div className="p-5 lg:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
