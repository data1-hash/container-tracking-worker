import { Header } from './Header'; import { Sidebar } from './Sidebar';
export function Layout({ page, setPage, children }: { page: string; setPage: (p:string)=>void; children: React.ReactNode }) { return <div className="flex min-h-screen"><Sidebar page={page} setPage={setPage}/><main className="flex-1"><Header page={page}/><div className="p-6">{children}</div></main></div>; }
