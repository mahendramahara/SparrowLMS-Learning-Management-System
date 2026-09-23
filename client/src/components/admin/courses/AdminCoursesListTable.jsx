import { useState, useRef, useEffect } from 'react';
import { Star, MoreVertical, Eye, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminCoursesListTable({
  courses = [],
  onDeleteCourse,
  onToggleCourseStatus,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (courses.length === 0) {
    return (
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <p className="text-sm font-semibold">No courses found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr
              className="border-b text-[11px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Level</th>
              <th className="py-3 px-4">Enrolled Students</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {courses.map(course => {
              const courseId = course._id || course.id;
              const isMenuOpen = openMenuId === courseId;
              const isPublished = course.status === 'Published';
              const categoryLabel = course.category?.name || (typeof course.category === 'string' ? course.category : 'General');

              return (
                <tr key={courseId} className="transition hover:bg-slate-50/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-10 w-14 rounded-lg object-cover shrink-0 border"
                        style={{ borderColor: 'var(--border-subtle)' }}
                      />
                      <div>
                        <p className="font-bold line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                          {course.title}
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {course.lessons} lessons · {course.duration || '12 hours'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className="rounded-lg px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        color: 'var(--color-primary-600)',
                      }}
                    >
                      {categoryLabel}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 font-medium">
                    {course.level || 'All Levels'}
                  </td>

                  <td className="py-3 px-4 font-bold" style={{ color: 'var(--text-primary)' }}>
                    {course.students}
                  </td>

                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="h-3 w-3 fill-amber-500" />
                      <span>{course.rating > 0 ? course.rating : 'New'}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isPublished
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/instructor/courses/preview/${courseId}`}
                        className="p-1.5 rounded-lg border transition hover:opacity-80"
                        style={{
                          borderColor: 'var(--border-subtle)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)',
                        }}
                        title="Inspect Live Preview"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>

                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          aria-label="Course Options"
                          onMouseDown={e => e.stopPropagation()}
                          onClick={e => {
                            e.stopPropagation();
                            setOpenMenuId(prev => (prev === courseId ? null : courseId));
                          }}
                          className="p-1.5 rounded-lg border transition hover:opacity-80"
                          style={{
                            borderColor: 'var(--border-subtle)',
                            backgroundColor: isMenuOpen ? 'var(--bg-subtle)' : 'var(--bg-card)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>

                        {isMenuOpen && (
                          <div
                            ref={menuRef}
                            onMouseDown={e => e.stopPropagation()}
                            onClick={e => e.stopPropagation()}
                            className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl border p-1.5 shadow-2xl transition-all z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                            style={{
                              backgroundColor: 'var(--bg-card)',
                              borderColor: 'var(--border-subtle)',
                            }}
                          >
                            <Link
                              to={`/instructor/courses/edit/${courseId}`}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:bg-slate-500/10"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              <Edit3 className="h-3.5 w-3.5 text-blue-500" />
                              <span>Edit Syllabus</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onToggleCourseStatus?.(courseId);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:bg-slate-500/10"
                              style={{ color: isPublished ? '#f59e0b' : '#10b981' }}
                            >
                              {isPublished ? (
                                <>
                                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                                  <span>Revert to Draft</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                  <span>Publish Course</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onDeleteCourse?.(courseId);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-500/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete Course</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
