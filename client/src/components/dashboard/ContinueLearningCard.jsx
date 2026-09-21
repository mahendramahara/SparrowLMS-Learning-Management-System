import { Play, Check, MoreVertical, Code } from 'lucide-react';

export default function ContinueLearningCard({
  courseTitle,
  moduleTitle,
  progress = 0,
  onResume,
  onComplete,
}) {
  return (
    <div
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 rounded-2xl p-4 sm:p-5 border transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative flex h-16 w-24 sm:h-20 sm:w-28 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-blue-400 overflow-hidden shadow-sm">
          <Code className="h-8 w-8" />
          <div className="absolute inset-0 bg-blue-500/10" />
        </div>

        <div className="space-y-1">
          <h4 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            {courseTitle}
          </h4>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            {moduleTitle}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <div
              className="h-1.5 w-32 sm:w-48 overflow-hidden rounded-full"
              style={{ backgroundColor: 'var(--bg-subtle)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  backgroundColor: 'var(--color-primary-600)',
                }}
              />
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {progress}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <button
          type="button"
          onClick={onResume}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95"
          style={{ backgroundColor: 'var(--color-primary-600)' }}
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Resume</span>
        </button>

        <button
          type="button"
          onClick={onComplete}
          className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium border transition hover:opacity-80"
          style={{
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-subtle)',
          }}
        >
          <Check className="h-3.5 w-3.5" />
          <span>Mark as Complete</span>
        </button>

        <button
          type="button"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition"
          aria-label="Options"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
