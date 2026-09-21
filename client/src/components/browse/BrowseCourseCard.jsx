import { Star, Clock, BookOpen, Users, User, ArrowRight } from 'lucide-react';

export default function BrowseCourseCard({ course, onEnroll }) {
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

          <button
            type="button"
            onClick={() => onEnroll?.(course)}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--color-primary-600)' }}
          >
            <span>Enroll Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
