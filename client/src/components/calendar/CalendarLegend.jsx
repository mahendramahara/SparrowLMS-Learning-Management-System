import { BookOpen, FileText, GraduationCap } from 'lucide-react';

const LEGEND = [
  { type: 'class', label: 'Class', icon: BookOpen, color: '#2563eb', bg: 'rgba(37, 99, 235, 0.1)' },
  {
    type: 'assignment',
    label: 'Assignment',
    icon: FileText,
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.1)',
  },
  {
    type: 'exam',
    label: 'Exam',
    icon: GraduationCap,
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.1)',
  },
];

export default function CalendarLegend({ upcomingCount }) {
  return (
    <div
      className="rounded-2xl border p-5 space-y-4"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div>
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          Event Types
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {upcomingCount} upcoming this month
        </p>
      </div>

      <div className="space-y-2">
        {LEGEND.map(({ type, label, icon: Icon, color, bg }) => (
          <div key={type} className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: bg, color }}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
