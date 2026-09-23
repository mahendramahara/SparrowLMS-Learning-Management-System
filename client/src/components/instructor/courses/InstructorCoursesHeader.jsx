import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function InstructorCoursesHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          My Courses
        </h1>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Manage curriculum, pricing, and enrolled student metrics.
        </p>
      </div>

      <Link
        to="/instructor/courses/create"
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 self-start sm:self-auto"
        style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
      >
        <Plus className="h-4 w-4" />
        <span>Create New Course</span>
      </Link>
    </div>
  );
}
