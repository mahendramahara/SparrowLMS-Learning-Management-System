import {
  Calendar,
  Clock,
  BookOpen,
  Paperclip,
  UploadCloud,
  FileCheck,
  Award,
  User,
} from 'lucide-react';

export default function AssignmentCard({ assignment, onAction }) {
  if (!assignment) return null;

  const isPending = assignment.status === 'Pending';
  const isSubmitted = assignment.status === 'Submitted';
  const isGraded = assignment.status === 'Graded';

  const getStatusBadge = () => {
    if (isGraded) {
      return { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669', border: 'rgba(16, 185, 129, 0.3)' };
    }
    if (isSubmitted) {
      return { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.3)' };
    }
    return { bg: 'rgba(245, 158, 11, 0.12)', text: '#d97706', border: 'rgba(245, 158, 11, 0.3)' };
  };

  const badge = getStatusBadge();

  return (
    <div
      className="flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-1.5 text-xs font-semibold"
            style={{ color: 'var(--color-primary-600)' }}
          >
            <BookOpen className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate max-w-xs">{assignment.courseTitle}</span>
          </div>

          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold border"
            style={{
              backgroundColor: badge.bg,
              color: badge.text,
              borderColor: badge.border,
            }}
          >
            {assignment.status}
          </span>
        </div>

        <h3 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {assignment.title}
        </h3>

        <p
          className="text-xs line-clamp-2 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {assignment.description}
        </p>

        {isGraded && assignment.feedback && (
          <div
            className="rounded-xl p-3 border text-xs"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              borderColor: 'rgba(16, 185, 129, 0.2)',
            }}
          >
            <p className="font-bold text-emerald-700 dark:text-emerald-400">Instructor Feedback:</p>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">{assignment.feedback}</p>
          </div>
        )}

        <div
          className="flex flex-wrap items-center gap-4 text-xs pt-1"
          style={{ color: 'var(--text-muted)' }}
        >
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>{assignment.instructor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Due {assignment.dueDate}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{assignment.deadlineStatus}</span>
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-between border-t pt-4 mt-4 gap-3"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          {isGraded ? (
            <div className="flex items-center gap-1 font-bold text-emerald-600 text-sm">
              <Award className="h-4 w-4" />
              <span>Score: {assignment.grade}</span>
            </div>
          ) : (
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              Points: {assignment.totalPoints} pts
            </span>
          )}

          {assignment.attachments && (
            <span
              className="flex items-center gap-1 text-[11px]"
              style={{ color: 'var(--text-muted)' }}
            >
              <Paperclip className="h-3 w-3" />
              <span>{assignment.attachments.length} files</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAction?.(assignment)}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 shadow-sm"
          style={
            isPending
              ? {
                  backgroundColor: 'var(--color-primary-600)',
                  color: '#ffffff',
                }
              : isSubmitted
                ? {
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }
                : {
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#059669',
                  }
          }
        >
          {isPending ? (
            <>
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Submit Assignment</span>
            </>
          ) : isSubmitted ? (
            <>
              <FileCheck className="h-3.5 w-3.5 text-blue-500" />
              <span>View Submission</span>
            </>
          ) : (
            <>
              <Award className="h-3.5 w-3.5 text-emerald-500" />
              <span>Review Grade</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
