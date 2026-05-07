import type { CarrierRule } from '@voraco/shared';
import { CarrierRuleForm } from '../components/CarrierRuleForm';
import { StatusBadge } from '../components/StatusBadge';

export function CarrierRules({ rules }: { rules: CarrierRule[] }) {
  return (
    <div className="space-y-5">
      <CarrierRuleForm />
      <div className="card">
        <p className="eyebrow">Configured carriers</p>
        <h2 className="mt-1 text-xl font-black">Rule library</h2>
        <div className="mt-5 grid gap-3">
          {rules.map((rule) => (
            <div key={rule.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-black text-slate-950">{rule.carrier}</p>
                  <p className="mt-1 break-all text-sm text-slate-500">{rule.tracking_url_pattern}</p>
                </div>
                <StatusBadge value={rule.fetch_mode} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
