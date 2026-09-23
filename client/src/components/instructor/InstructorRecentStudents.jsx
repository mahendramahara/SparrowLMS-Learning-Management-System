import { Link } from 'react-router-dom';
import { ArrowRight, MoreVertical } from 'lucide-react';

export default function InstructorRecentStudents({ students = [] }) {
  return (
    <div
      className="rounded-2xl p-6 border space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Recent Students
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Latest learners active across your courses
          </p>
        </div>
        <Link
          to="/instructor/students"
          className="flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: 'var(--color-primary-600, #2563eb)' }}
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr
              className="border-b text-[11px] font-semibold uppercase tracking-wider"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <th className="pb-3 font-semibold">Name</th>
              <th className="pb-3 font-semibold">Course</th>
              <th className="pb-3 font-semibold">Progress</th>
              <th className="pb-3 font-semibold">Last Active</th>
              <th className="pb-3 text-right font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {students.map(student => (
              <tr key={student.id || student._id} className="transition hover:bg-slate-50/5">
                <td className="py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm overflow-hidden"
                      style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
                    >
                      {student.avatar ? (
                        <img src={student.avatar} alt={student.name} className="h-full w-full object-cover" />
                      ) : (
                        (student.name || 'S').charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {student.name || 'Student'}
                    </span>
                  </div>
                </td>
                <td className="py-3.5" style={{ color: 'var(--text-secondary)' }}>
                  {student.course}
                </td>
                <td className="py-3.5 min-w-[140px]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${student.progress}%`,
                          backgroundColor:
                            student.progress >= 80
                              ? '#10b981'
                              : student.progress >= 50
                                ? '#2563eb'
                                : '#f59e0b',
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>
                      {student.progress}%
                    </span>
                  </div>
                </td>
                <td className="py-3.5 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                  {student.lastActive}
                </td>
                <td className="py-3.5 text-right">
                  <button
                    type="button"
                    aria-label="Student options"
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
