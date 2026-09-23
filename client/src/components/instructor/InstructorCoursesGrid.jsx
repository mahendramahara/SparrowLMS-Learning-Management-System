import { Link } from 'react-router-dom';
import { BookOpen, Star, Users, ArrowRight, Eye, Edit3 } from 'lucide-react';

export default function InstructorCoursesGrid({ courses = [] }) {
  return (
    <div
      className="rounded-2xl p-6 border space-y-5"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          My Courses
        </h2>
        <Link
          to="/instructor/courses"
          className="flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: 'var(--color-primary-600, #2563eb)' }}
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {courses.map(course => {
          const courseId = course.id || course._id;
          const isPublished = course.status === 'Published';
          return (
            <div
              key={courseId}
              className="group relative flex flex-col justify-between rounded-xl border p-3.5 transition-all hover:shadow-md hover:translate-y-[-2px]"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div>
                <Link
                  to={`/instructor/courses/${courseId}/preview`}
                  className="relative h-28 w-full rounded-lg flex items-center justify-center p-3 mb-3 text-white overflow-hidden shadow-sm block group/thumb"
                  style={{ background: course.gradient }}
                >
                  <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-1 rounded-md bg-black/30 backdrop-blur-sm border border-white/10">
                    {course.tag}
                  </span>

                  <span
                    className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isPublished ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-100'
                    }`}
                  >
                    {course.status}
                  </span>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="flex items-center gap-1 text-[11px] font-bold bg-white/90 text-slate-900 px-2.5 py-1 rounded-lg shadow-sm">
                      <Eye className="h-3 w-3 text-blue-600" />
                      Preview
                    </span>
                  </div>
                </Link>

                <Link
                  to={`/instructor/courses/${courseId}/preview`}
                  className="text-xs font-bold line-clamp-2 leading-snug hover:text-blue-600 transition block"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {course.title}
                </Link>
              </div>

              <div className="mt-3 pt-3 border-t space-y-2 text-[11px]" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center justify-between" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {course.lessons} lessons
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-amber-500">
                    <Star className="h-3 w-3 fill-amber-500" />
                    {course.rating} ({course.reviewsCount})
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
                    <Users className="h-3 w-3 text-blue-500" />
                    <span>{course.studentsCount} students</span>
                  </div>

                  <Link
                    to={`/instructor/courses/${courseId}/preview`}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
