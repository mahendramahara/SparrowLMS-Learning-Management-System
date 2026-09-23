import { Link } from 'react-router-dom';
import { FileText, UserPlus, PlayCircle, Star, MessageSquare, ArrowRight } from 'lucide-react';

const ACTIVITY_ICONS = {
  assignment: FileText,
  enrollment: UserPlus,
  lecture: PlayCircle,
  review: Star,
  message: MessageSquare,
};

export default function InstructorActivityFeed({ activities = [] }) {
  return (
    <div
      className="rounded-2xl p-6 border space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Latest Activity
        </h3>
        <Link
          to="/instructor/courses"
          className="flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: 'var(--color-primary-600, #2563eb)' }}
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {activities.map(act => {
          const Icon = ACTIVITY_ICONS[act.type] || FileText;
          return (
            <div key={act.id} className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-xs"
                style={{
                  backgroundColor: `${act.color}18`,
                  color: act.color,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {act.title}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {act.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
