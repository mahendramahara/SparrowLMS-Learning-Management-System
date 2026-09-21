import { CheckCircle } from 'lucide-react';

const CATEGORY_COLORS = {
  Frontend: '#2563eb',
  Backend: '#059669',
  'Full Stack': '#7c3aed',
  'Computer Science': '#d97706',
  Design: '#ec4899',
  'AI/ML': '#0891b2',
};

function ProgressBar({ value, color }) {
  return (
    <div
      className="h-1.5 w-full rounded-full overflow-hidden"
      style={{ backgroundColor: 'var(--border-subtle)' }}
    >
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${value}%`, backgroundColor: color || 'var(--color-primary-600)' }}
      />
    </div>
  );
}

export default function ProfileCourseList({ courses }) {
  const inProgress = courses.filter(c => c.status === 'in-progress');
  const completed = courses.filter(c => c.status === 'completed');

  const renderGroup = (title, list) => (
    <div className="space-y-2">
      <p
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: 'var(--text-muted)' }}
      >
        {title} ({list.length})
      </p>
      {list.map(course => {
        const color = CATEGORY_COLORS[course.category] || 'var(--color-primary-600)';
        return (
          <div
            key={course.id}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ backgroundColor: 'var(--bg-subtle)' }}
          >
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {course.title}
                </p>
                <span className="text-xs font-bold shrink-0" style={{ color }}>
                  {course.progress}%
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {course.instructor}
                </span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {course.category}
                </span>
              </div>
              <ProgressBar value={course.progress} color={color} />
            </div>
            {course.status === 'completed' && (
              <CheckCircle className="h-4 w-4 shrink-0" style={{ color: '#059669' }} />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className="rounded-2xl border p-5 space-y-5"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
        Courses
      </h2>
      {inProgress.length > 0 && renderGroup('In Progress', inProgress)}
      {completed.length > 0 && renderGroup('Completed', completed)}
    </div>
  );
}
