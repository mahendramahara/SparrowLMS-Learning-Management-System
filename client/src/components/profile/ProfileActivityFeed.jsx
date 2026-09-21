import { BookOpen, ClipboardList, Award, Play } from 'lucide-react';

const ACTION_ICON = {
  'Completed lesson': Play,
  'Submitted assignment': ClipboardList,
  'Achieved badge': Award,
  'Started course': BookOpen,
  'Quiz completed': Award,
};

export default function ProfileActivityFeed({ activity }) {
  return (
    <div
      className="rounded-2xl border p-5 space-y-4"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
        Recent Activity
      </h2>

      <div className="relative space-y-4 pl-4">
        <div
          className="absolute left-0 top-2 bottom-2 w-px"
          style={{ backgroundColor: 'var(--border-subtle)' }}
        />
        {activity.map(({ id, action, detail, course, time }) => {
          const Icon = ACTION_ICON[action] || BookOpen;
          return (
            <div key={id} className="relative flex items-start gap-3">
              <div
                className="absolute -left-4 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--color-primary-600)',
                }}
              />
              <div className="pl-2 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Icon
                    className="h-3 w-3 shrink-0"
                    style={{ color: 'var(--color-primary-600)' }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {action}
                  </span>
                </div>
                <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {detail}
                </p>
                {course && (
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {course}
                  </p>
                )}
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
