import { ClipboardList, Clock, CheckCircle2, Users } from 'lucide-react';

export default function InstructorAssignmentsStats({ assignments = [] }) {
  const total = assignments.length;
  const reviewing = assignments.filter(a => a.status === 'Reviewing').length;
  const open = assignments.filter(a => a.status === 'Open').length;
  const totalSubmissions = assignments.reduce((acc, a) => acc + (a.submitted || 0), 0);

  const stats = [
    { label: 'Total Assignments', value: total, icon: ClipboardList, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'Open for Submission', value: open, icon: Clock, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Needs Review', value: reviewing, icon: CheckCircle2, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Total Submissions', value: totalSubmissions, icon: Users, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-2xl p-4 border transition"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: stat.bg, color: stat.color }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </p>
              <h4 className="text-xl font-extrabold tracking-tight mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {stat.value}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}
