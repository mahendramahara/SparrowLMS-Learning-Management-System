import { Link } from 'react-router-dom';
import { ArrowRight, MoreVertical } from 'lucide-react';

export default function AdminRecentEnrollmentsTable({ enrollments = [] }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div
        className="flex items-center justify-between p-5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <h2 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Recent Enrollments
        </h2>
        <Link
          to="/admin/enrollments"
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
              className="border-b text-[11px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <th className="py-3 px-4 w-10">#</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Instructor</th>
              <th className="py-3 px-4">Enrolled At</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {enrollments.map(item => (
              <tr key={item.id} className="transition hover:bg-slate-50/5">
                <td className="py-3.5 px-4 font-semibold text-slate-400">
                  {item.id}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.studentAvatar}
                      alt={item.studentName}
                      className="h-8 w-8 rounded-full object-cover shrink-0 border"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    />
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {item.studentName}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {item.course}
                </td>

                <td className="py-3.5 px-4" style={{ color: 'var(--text-muted)' }}>
                  {item.instructor}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                  {item.enrolledAt}
                </td>

                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {item.status}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    aria-label="Options"
                    className="p-1 rounded-lg transition hover:bg-slate-700/20 text-slate-400 hover:text-slate-200"
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
