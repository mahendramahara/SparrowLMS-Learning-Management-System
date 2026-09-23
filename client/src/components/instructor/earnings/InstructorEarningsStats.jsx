import { Wallet, DollarSign, TrendingUp, Users } from 'lucide-react';

export default function InstructorEarningsStats({ earnings }) {
  if (!earnings) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        className="rounded-2xl p-5 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Total Earnings</span>
          <Wallet className="h-4 w-4 text-blue-500" />
        </div>
        <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
          {earnings.totalEarnings}
        </p>
        <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1 mt-1">
          <TrendingUp className="h-3 w-3" /> +14.2% from last month
        </span>
      </div>

      <div
        className="rounded-2xl p-5 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>This Month</span>
          <DollarSign className="h-4 w-4 text-emerald-500" />
        </div>
        <p className="text-2xl font-black text-emerald-500">
          {earnings.thisMonth}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">Sep 1 - Sep 30</p>
      </div>

      <div
        className="rounded-2xl p-5 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Pending Payout</span>
          <Wallet className="h-4 w-4 text-amber-500" />
        </div>
        <p className="text-2xl font-black text-amber-500">
          {earnings.pendingPayout}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">Scheduled for next cycle</p>
      </div>

      <div
        className="rounded-2xl p-5 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Lifetime Enrollments</span>
          <Users className="h-4 w-4 text-purple-500" />
        </div>
        <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
          {earnings.lifetimeEnrollments}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">Paid &amp; verified students</p>
      </div>
    </div>
  );
}
