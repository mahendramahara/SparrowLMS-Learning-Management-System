import { Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Eye, ShieldCheck } from 'lucide-react';

export default function InstructorPreviewTopNav({ course, onBack }) {
  if (!course) return null;

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-4 border sm:flex-row sm:items-center sm:justify-between"
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
          title="Back to Courses"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: 'rgba(147, 51, 234, 0.12)',
                color: '#9333ea',
              }}
            >
              <Eye className="h-3 w-3" />
              <span>Instructor Live Preview</span>
            </span>

            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold"
              style={{ color: 'var(--text-muted)' }}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Author View</span>
            </span>
          </div>

          <h2
            className="text-sm sm:text-base font-extrabold tracking-tight truncate max-w-lg mt-0.5"
            style={{ color: 'var(--text-primary)' }}
          >
            {course.title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Link
          to={`/instructor/courses/edit/${course._id || course.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
          style={{ backgroundColor: 'var(--color-primary-600)' }}
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit This Course</span>
        </Link>
      </div>
    </div>
  );
}
