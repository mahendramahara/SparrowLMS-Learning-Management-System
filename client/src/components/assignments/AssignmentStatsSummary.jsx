import { ClipboardList, Clock, Send, Award } from 'lucide-react';

export default function AssignmentStatsSummary({ summary }) {
  if (!summary) return null;

  const items = [
    {
      label: 'Total Assignments',
      value: summary.total,
      icon: ClipboardList,
      bg: 'rgba(37, 99, 235, 0.12)',
      color: '#2563eb',
    },
    {
      label: 'Pending Action',
      value: summary.pending,
      icon: Clock,
      bg: 'rgba(245, 158, 11, 0.12)',
      color: '#d97706',
    },
    {
      label: 'Submitted',
      value: summary.submitted,
      icon: Send,
      bg: 'rgba(59, 130, 246, 0.12)',
      color: '#2563eb',
    },
    {
      label: 'Graded & Evaluated',
      value: summary.graded,
      icon: Award,
      bg: 'rgba(16, 185, 129, 0.12)',
      color: '#059669',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {items.map(({ label, value, icon: Icon, bg, color }) => (
        <div
          key={label}
          className="flex items-center gap-3.5 rounded-2xl p-4 border transition hover:shadow-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: bg, color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
              {label}
            </p>
            <p
              className="text-lg font-bold tracking-tight mt-0.5"
              style={{ color: 'var(--text-primary)' }}
            >
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
