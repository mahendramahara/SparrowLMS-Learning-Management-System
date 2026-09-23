import { useState } from 'react';
import toast from 'react-hot-toast';
import { DollarSign, CheckCircle2, Clock, Download, ArrowUpRight } from 'lucide-react';

export default function AdminPayoutsLedger({ initialPayouts = [] }) {
  const [payouts, setPayouts] = useState(initialPayouts);

  const handleProcessPayout = id => {
    setPayouts(prev =>
      prev.map(p => {
        if (p.id === id) {
          toast.success(`Disbursement processed for ${p.instructor}.`);
          return { ...p, status: 'Paid' };
        }
        return p;
      })
    );
  };

  return (
    <div
      className="rounded-3xl border overflow-hidden transition"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Instructor Payout Disbursement Ledger
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Bi-weekly settlement payouts: 80% instructor royalty rate, 20% SparrowLMS infrastructure commission.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            toast.success('Generated settlement ledger CSV.');
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition hover:opacity-80 self-start sm:self-auto"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <Download className="h-3.5 w-3.5 text-blue-500" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr
              className="border-b text-[11px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <th className="py-3 px-4">Instructor</th>
              <th className="py-3 px-4">Curriculum</th>
              <th className="py-3 px-4">Gross Sales</th>
              <th className="py-3 px-4">Platform Fee (20%)</th>
              <th className="py-3 px-4">Net Payout (80%)</th>
              <th className="py-3 px-4">Payout Method</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Settlement</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {payouts.map(p => {
              const isPaid = p.status === 'Paid';

              return (
                <tr key={p.id} className="transition hover:bg-slate-50/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: 'var(--color-primary-600)' }}
                      >
                        {p.instructor.charAt(0)}
                      </div>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        {p.instructor}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {p.courses}
                  </td>

                  <td className="py-3 px-4 font-bold" style={{ color: 'var(--text-primary)' }}>
                    {p.grossSales}
                  </td>

                  <td className="py-3 px-4 text-slate-400 font-medium">
                    {p.platformFee}
                  </td>

                  <td className="py-3 px-4 font-extrabold text-blue-500">
                    {p.netPayout}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className="rounded-lg px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {p.method}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {p.date}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isPaid
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}
                    >
                      {isPaid ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      <span>{p.status}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {!isPaid ? (
                      <button
                        type="button"
                        onClick={() => handleProcessPayout(p.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
                      >
                        <span>Disburse</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">
                        Settled
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
