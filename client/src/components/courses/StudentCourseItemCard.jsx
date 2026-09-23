import { Play, Award, Clock, BookOpen, User } from 'lucide-react';

export default function StudentCourseItemCard({ course, onAction }) {
  if (!course) return null;

  const isCompleted = course.progress === 100;

  return (
    <div
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div>
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <span
            className="absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm"
            style={{ backgroundColor: 'var(--color-primary-600)' }}
          >
            {course.category?.name || (typeof course.category === 'string' ? course.category : 'General')}
          </span>

          <span
            className="absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm"
            style={
              isCompleted
                ? { backgroundColor: '#10b981', color: '#ffffff' }
                : { backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#ffffff' }
            }
          >
            {course.status}
          </span>
        </div>

        <div className="p-5 space-y-3">
          <h3
            className="text-sm sm:text-base font-bold tracking-tight line-clamp-2 leading-snug"
            style={{ color: 'var(--text-primary)' }}
          >
            {course.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{course.instructor}</span>
          </div>

          <div
            className="rounded-xl p-2.5 border"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }}
          >
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Current Unit
            </p>
            <p
              className="text-xs font-semibold truncate mt-0.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              {course.currentModule}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-1 space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span style={{ color: 'var(--text-muted)' }}>
              {course.completedLessons} of {course.totalLessons} lessons
            </span>
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
              {course.progress}%
            </span>
          </div>

          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: 'var(--bg-subtle)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${course.progress}%`,
                backgroundColor: isCompleted ? '#10b981' : 'var(--color-primary-600)',
              }}
            />
          </div>
        </div>

        <div
          className="flex items-center justify-between pt-1 text-[11px]"
          style={{ color: 'var(--text-muted)' }}
        >
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
          <span>Active {course.lastAccessed}</span>
        </div>

        <button
          type="button"
          onClick={() => onAction?.(course)}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2 px-4 text-xs font-bold transition active:scale-95 shadow-sm"
          style={
            isCompleted
              ? {
                  backgroundColor: 'var(--bg-subtle)',
                  color: '#059669',
                  border: '1px solid var(--border-subtle)',
                }
              : {
                  backgroundColor: 'var(--color-primary-600)',
                  color: '#ffffff',
                }
          }
        >
          {isCompleted ? (
            <>
              <Award className="h-3.5 w-3.5" />
              <span>View Certificate</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Resume Learning</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
