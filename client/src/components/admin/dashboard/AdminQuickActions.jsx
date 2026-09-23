import { Link } from 'react-router-dom';
import { BookOpen, UserPlus, Users, BarChart3 } from 'lucide-react';

const ACTION_ICONS = {
  qa_add_course: BookOpen,
  qa_add_instructor: UserPlus,
  qa_add_student: Users,
  qa_view_reports: BarChart3,
};

export default function AdminQuickActions({ actions = [] }) {
  return (
    <div
      className="rounded-2xl p-5 border space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map(action => {
          const Icon = ACTION_ICONS[action.id] || BookOpen;

          return (
            <Link
              key={action.id}
              to={action.to}
              className="flex flex-col items-center justify-center rounded-2xl p-4 border text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl mb-2"
                style={{ backgroundColor: action.bg, color: action.color }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                {action.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
