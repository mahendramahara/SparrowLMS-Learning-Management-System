import { Calendar, Users, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

export default function InstructorAssignmentCard({ assignment, onReview }) {
  const percentage = assignment.total > 0 ? Math.round((assignment.submitted / assignment.total) * 100) : 0;
  const isReviewing = assignment.status === 'Reviewing';

  return (
    <div
      className="flex flex-col justify-between rounded-2xl p-5 border transition hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              <BookOpen className="h-3 w-3" />
              {assignment.course}
            </span>
            <h3 className="text-base font-bold leading-snug pt-1" style={{ color: 'var(--text-primary)' }}>
              {assignment.title}
            </h3>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-xs font-bold shrink-0"
            style={{
              backgroundColor: isReviewing ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              color: isReviewing ? '#d97706' : '#059669',
            }}
          >
            {assignment.status}
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>Submissions</span>
            </span>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {assignment.submitted} / {assignment.total} students ({percentage}%)
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: 'var(--bg-subtle)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${percentage}%`,
                backgroundColor: 'var(--color-primary-600)',
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="mt-5 flex items-center justify-between border-t pt-4"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Calendar className="h-3.5 w-3.5" />
          <span>Due {assignment.dueDate}</span>
        </div>

        <button
          onClick={() => onReview?.(assignment)}
          className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition hover:opacity-80 active:scale-95"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--color-primary-600)',
          }}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Evaluate Submissions</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
