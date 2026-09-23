import { Link } from 'react-router-dom';
import { Star, Edit3, Eye, ArrowUpRight } from 'lucide-react';

export default function InstructorCourseCard({ course }) {
  const courseId = course._id || course.id;
  const isPublished = course.isPublished || course.status === 'published';

  const totalLessons = (course.chapters || []).reduce(
    (acc, ch) => acc + (ch.lessons?.length || 0),
    0
  );
  const enrolledCount = course.enrolled ?? course.students ?? 0;

  return (
    <div
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div>
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-800">
              <span className="text-xs text-slate-500">No Thumbnail</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <Link
            to={`/instructor/courses/${courseId}/preview`}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <span className="flex items-center gap-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 px-3.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white shadow-lg backdrop-blur-md transition hover:scale-105">
              <Eye className="h-4 w-4 text-blue-600" />
              Preview Course
            </span>
          </Link>

          <span
            className="absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm pointer-events-none"
            style={{ backgroundColor: 'var(--color-primary-600)' }}
          >
            {course.category?.name || (typeof course.category === 'string' ? course.category : 'General')}
          </span>

          <span
            className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm pointer-events-none ${
              isPublished ? 'bg-emerald-500/90 text-white' : 'bg-slate-700/90 text-slate-200'
            }`}
          >
            {isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold capitalize" style={{ color: 'var(--text-muted)' }}>
              {course.level || 'All Levels'}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              <span>{course.rating > 0 ? Number(course.rating).toFixed(1) : 'New'}</span>
              {course.reviewCount > 0 && (
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  ({course.reviewCount})
                </span>
              )}
            </div>
          </div>

          <h3
            className="text-sm sm:text-base font-bold tracking-tight line-clamp-2 leading-snug"
            style={{ color: 'var(--text-primary)' }}
          >
            {course.title}
          </h3>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--bg-subtle)' }}>
              <p className="font-extrabold" style={{ color: 'var(--text-primary)' }}>
                {totalLessons}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Lessons</p>
            </div>

            <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--bg-subtle)' }}>
              <p className="font-extrabold text-blue-500">{enrolledCount}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Students</p>
            </div>

            <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--bg-subtle)' }}>
              <p className="font-extrabold text-emerald-500">
                ${Number(course.price || 0).toFixed(0)}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Price</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="px-5 pb-5 pt-2 flex items-center justify-between gap-2 border-t"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <Link
          to={`/instructor/courses/edit/${courseId}`}
          className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border transition hover:opacity-80"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit Syllabus
        </Link>

        <Link
          to={`/instructor/courses/${courseId}/preview`}
          className="flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-xl transition hover:opacity-90 active:scale-95"
          style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary-600)' }}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Preview</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
