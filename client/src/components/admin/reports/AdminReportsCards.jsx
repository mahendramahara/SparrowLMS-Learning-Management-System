import { DollarSign, TrendingUp, Wallet, CheckCircle, Users, Download } from 'lucide-react';

export default function AdminReportsCards({ reports }) {
  const items = [
    { label: 'Gross Revenue', value: reports.grossRevenue, icon: DollarSign, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'Platform Net Margin', value: reports.netProfit, icon: TrendingUp, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Instructor Payouts', value: reports.totalPayouts, icon: Wallet, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    { label: 'Course Completions', value: reports.courseCompletions, icon: CheckCircle, color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Financial &amp; Platform Reports
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Detailed breakdown of gross earnings, instructor disbursements, and learner progression.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.alert('Exporting annual fiscal report PDF...')}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
        >
          <Download className="h-4 w-4" />
          <span>Download Fiscal Statement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3.5 rounded-2xl p-5 border transition hover:shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  {item.label}
                </p>
                <h3 className="text-2xl font-extrabold tracking-tight mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {item.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
