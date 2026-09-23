import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';

export default function AdminTopCourses({ courses = [] }) {
  return (
    <div
      className="rounded-2xl p-5 border space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          Top Courses
        </h2>
        <Link
          to="/admin/courses"
          className="flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: 'var(--color-primary-600, #2563eb)' }}
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {courses.map(course => (
          <div
            key={course.id}
            className="flex items-center gap-3 rounded-xl p-3 border transition hover:shadow-sm"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-12 w-12 rounded-xl object-cover shrink-0 border"
              style={{ borderColor: 'var(--border-subtle)' }}
            />

            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold truncate leading-tight" style={{ color: 'var(--text-primary)' }}>
                {course.title}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {course.students} students
              </p>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 mt-1">
                <Star className="h-3 w-3 fill-amber-500" />
                <span>{course.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
