import { BookOpen, Clock, CheckCircle2, Award } from 'lucide-react';

export default function CourseStatsSummary({ summary }) {
  if (!summary) return null;

  const items = [
    {
      label: 'Enrolled Courses',
      value: summary.totalEnrolled,
      icon: BookOpen,
      bg: 'rgba(37, 99, 235, 0.12)',
      color: '#2563eb',
    },
    {
      label: 'In Progress',
      value: summary.inProgress,
      icon: Clock,
      bg: 'rgba(245, 158, 11, 0.12)',
      color: '#d97706',
    },
    {
      label: 'Completed',
      value: summary.completed,
      icon: CheckCircle2,
      bg: 'rgba(16, 185, 129, 0.12)',
      color: '#059669',
    },
    {
      label: 'Certificates Earned',
      value: summary.certificatesEarned,
      icon: Award,
      bg: 'rgba(147, 51, 234, 0.12)',
      color: '#9333ea',
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
