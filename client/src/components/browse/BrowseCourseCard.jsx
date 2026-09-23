import { Star, Clock, BookOpen, Users, User, ArrowRight, Play } from 'lucide-react';

export default function BrowseCourseCard({ course, onEnroll, onPreview }) {
  if (!course) return null;

  return (
    <div
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div>
        <div
          onClick={() => onPreview?.(course)}
          className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
        >
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[1px]">
            <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-lg transform transition group-hover:scale-105">
              <Play className="h-3.5 w-3.5 fill-current text-blue-600" />
              <span>Preview Video</span>
            </div>
          </div>

          <span
            className="absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm"
            style={{ backgroundColor: 'var(--color-primary-600)' }}
          >
            {course.category}
          </span>

          <span className="absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
            {course.level}
          </span>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
              <span>{course.rating}</span>
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                ({course.reviewCount})
              </span>
            </div>

            <div
              className="flex items-center gap-1 text-[11px]"
              style={{ color: 'var(--text-muted)' }}
            >
              <Users className="h-3.5 w-3.5" />
              <span>{course.studentsCount} learners</span>
            </div>
          </div>

          <h3
            className="text-sm sm:text-base font-bold tracking-tight line-clamp-2 leading-snug"
            style={{ color: 'var(--text-primary)' }}
          >
            {course.title}
          </h3>

          <p
            className="text-xs line-clamp-2 leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {course.description}
          </p>

          <div
            className="flex items-center gap-1.5 pt-1 text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            <User className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--color-primary-600)' }} />
            <span className="font-medium truncate">{course.instructor}</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              • {course.instructorRole}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 space-y-3">
        <div
          className="flex items-center justify-between border-t pt-3 text-[11px]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{course.lessonsCount} lessons</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <span className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
              Course Fee
            </span>
            <p
              className="text-base font-extrabold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {course.price}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview?.(course)}
              className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold border transition hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              <Play className="h-3 w-3 fill-current text-blue-600" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => onEnroll?.(course)}
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              <span>Enroll</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
