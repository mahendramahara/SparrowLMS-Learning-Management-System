import { useState, useEffect } from 'react';
import { X, Calendar, BookOpen } from 'lucide-react';

export default function InstructorCreateAssignmentModal({
  isOpen,
  onClose,
  onCreate,
  courses = [],
}) {
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    dueDate: '',
    points: 100,
    instructions: '',
  });

  useEffect(() => {
    if (courses.length > 0 && !formData.course) {
      setFormData(prev => ({ ...prev, course: courses[0]._id || courses[0].id }));
    }
  }, [courses, formData.course]);

  if (!isOpen) return null;

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.title || !formData.course) return;

    onCreate({
      title: formData.title.trim(),
      courseId: formData.course,
      course: formData.course,
      dueDate: formData.dueDate,
      points: Number(formData.points) || 100,
      instructions: formData.instructions.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Create New Assignment
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Set project requirements and deadline for your enrolled learners.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition hover:opacity-80"
            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Assignment Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Build an Authenticated REST API with JWT"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition focus:ring-2 focus:ring-primary-500"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Target Course
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.course}
                  onChange={e => setFormData({ ...formData, course: e.target.value })}
                  className="w-full appearance-none rounded-xl border px-3.5 py-2.5 text-xs outline-none transition"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {courses.length === 0 ? (
                    <option value="">No courses created yet</option>
                  ) : (
                    courses.map(c => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.title}
                      </option>
                    ))
                  )}
                </select>
                <BookOpen className="pointer-events-none absolute right-3 top-3 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
                <Calendar className="pointer-events-none absolute right-3 top-3 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Maximum Points / Score
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={formData.points}
              onChange={e => setFormData({ ...formData, points: e.target.value })}
              className="w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Instructions &amp; Requirements
            </label>
            <textarea
              rows={3}
              placeholder="Outline specific objectives, evaluation criteria, and deliverable format..."
              value={formData.instructions}
              onChange={e => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition resize-none"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold transition hover:opacity-80"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={courses.length === 0}
              className="rounded-xl px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              Publish Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
