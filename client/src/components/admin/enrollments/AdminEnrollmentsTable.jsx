import { MoreVertical } from 'lucide-react';

export default function AdminEnrollmentsTable({ enrollments = [] }) {
  if (enrollments.length === 0) {
    return (
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <p className="text-sm font-semibold">No enrollment records found.</p>
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
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Course Enrolled</th>
              <th className="py-3 px-4">Instructor</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {enrollments.map(item => (
              <tr key={item.id} className="transition hover:bg-slate-50/5">
                <td className="py-3.5 px-4 font-bold" style={{ color: 'var(--text-primary)' }}>
                  {item.studentName}
                </td>

                <td className="py-3.5 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {item.courseTitle}
                </td>

                <td className="py-3.5 px-4" style={{ color: 'var(--text-muted)' }}>
                  {item.instructor}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                  {item.date}
                </td>

                <td className="py-3.5 px-4 font-bold text-emerald-500">
                  {item.amount}
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
