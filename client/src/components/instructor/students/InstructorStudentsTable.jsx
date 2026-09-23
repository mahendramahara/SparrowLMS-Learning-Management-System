export default function InstructorStudentsTable({ students = [] }) {
  if (students.length === 0) {
    return (
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <p className="text-sm font-semibold">No students found matching your search.</p>
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
              <th className="py-3 px-4">Enrolled Course</th>
              <th className="py-3 px-4">Progress</th>
              <th className="py-3 px-4">Enrolled Date</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {students.map(student => (
              <tr key={student.id || student._id} className="transition hover:bg-slate-50/5">
                <td className="py-3 px-4">
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
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {student.name || 'Student'}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {student.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {student.course}
                </td>
                <td className="py-3 px-4 min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${student.progress}%`,
                          backgroundColor: student.progress >= 70 ? '#10b981' : '#2563eb',
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>
                      {student.progress}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                  {student.enrolledDate}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      student.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
