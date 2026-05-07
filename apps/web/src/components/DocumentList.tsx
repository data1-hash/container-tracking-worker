import type { DocumentRecord } from '@voraco/shared';
import { StatusBadge } from './StatusBadge';

export function DocumentList({ documents }: { documents: DocumentRecord[] }) {
  return (
    <div className="card">
      <p className="eyebrow">Document control</p>
      <h2 className="mt-1 text-xl font-black">Documents</h2>
      <div className="mt-5 space-y-3">
        {documents.map((document) => (
          <div key={document.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div>
              <p className="font-bold text-slate-900">{document.document_type}</p>
              <p className="mt-1 text-xs text-slate-500">{document.document_no ?? 'Document number pending'}</p>
            </div>
            <StatusBadge value={document.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
