import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ClassroomTopNav({
  courseTitle,
  lessonTitle,
  progress = 0,
  completedCount = 0,
  totalCount = 0,
  isCompleted = false,
  onToggleComplete,
  onNextLesson,
  onBack,
}) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:opacity-80 shrink-0"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
          }}
          aria-label="Back to courses"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="leading-tight">
          <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            {courseTitle}
          </p>
          <h2
            className="text-sm sm:text-base font-bold truncate max-w-md"
            style={{ color: 'var(--text-primary)' }}
          >
            {lessonTitle}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="hidden md:flex flex-col items-end text-xs mr-2">
          <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {progress}% Completed
          </span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {completedCount} of {totalCount} lessons
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleComplete}
          className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold border transition hover:opacity-80 active:scale-95"
          style={
            isCompleted
              ? {
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  color: '#059669',
                }
              : {
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }
          }
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
        </button>

        <button
          type="button"
          onClick={onNextLesson}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
          style={{ backgroundColor: 'var(--color-primary-600)' }}
        >
          <span>Next Lesson</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
