import { Link } from 'react-router-dom';
import { Plus, UploadCloud, FileText, Users, ChevronRight } from 'lucide-react';

const ACTION_ICONS = {
  'create-course': Plus,
  'upload-lecture': UploadCloud,
  'create-assignment': FileText,
  'view-students': Users,
};

export default function InstructorQuickActions({ actions = [] }) {
  return (
    <div
      className="rounded-2xl p-6 border space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
        Quick Actions
      </h3>

      <div className="space-y-2.5">
        {actions.map(action => {
          const Icon = ACTION_ICONS[action.id] || Plus;
          return (
            <Link
              key={action.id}
              to={action.to}
              className="flex items-center justify-between p-3 rounded-xl border transition hover:translate-x-1"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: action.bg, color: action.color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {action.title}
                </span>
              </div>

              <ChevronRight className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
