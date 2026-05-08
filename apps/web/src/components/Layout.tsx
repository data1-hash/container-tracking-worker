import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout({ page, setPage, children }: { page: string; setPage: (p: string) => void; children: ReactNode }) {
  return (
    <div className="app-shell flex min-h-screen text-slate-100">
      <Sidebar page={page} setPage={setPage} />
      <main className="min-w-0 flex-1">
        <div className="min-h-screen border-l border-blue-300/15 bg-slate-950/50">
          <Header page={page} />
          <div className="px-4 pb-6 pt-4 lg:px-7">{children}</div>
        </div>
      </main>
    </div>
  );
}
