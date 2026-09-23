import { useState, useRef, useEffect } from 'react';
import { Eye, Users, Calendar, MoreVertical, CheckCircle2, UserCheck } from 'lucide-react';

export default function AdminAssignmentsTable({
  assignments = [],
  onViewSubmissions,
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

  if (assignments.length === 0) {
    return (
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <p className="text-sm font-semibold">No platform assignments found.</p>
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
              <th className="py-3 px-4">Deliverable Title</th>
              <th className="py-3 px-4">Associated Course</th>
              <th className="py-3 px-4">Created By Instructor</th>
              <th className="py-3 px-4">Submission Rate</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Submissions &amp; Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {assignments.map(item => {
              const pct = item.total > 0 ? Math.round((item.submissions / item.total) * 100) : 0;
              const isMenuOpen = openMenuId === item.id;

              return (
                <tr key={item.id} className="transition hover:bg-slate-50/5">
                  <td className="py-3.5 px-4 font-bold" style={{ color: 'var(--text-primary)' }}>
                    <div>
                      <p>{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-normal sm:hidden mt-0.5">
                        By {item.instructor}
                      </p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className="rounded-lg px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        color: 'var(--color-primary-600)',
                      }}
                    >
                      {item.course}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: 'var(--color-primary-600)' }}
                      >
                        {(item.instructor || 'I').charAt(0)}
                      </div>
                      <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
                        {item.instructor || 'Faculty Member'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>
                        {item.submissions}/{item.total} ({pct}%)
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {item.dueDate}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onViewSubmissions(item)}
                        className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition hover:opacity-90 shadow-sm"
                        style={{
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          borderColor: 'rgba(37, 99, 235, 0.2)',
                          color: 'var(--color-primary-600)',
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Submissions</span>
                      </button>

                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          aria-label="Options"
                          onMouseDown={e => e.stopPropagation()}
                          onClick={e => {
                            e.stopPropagation();
                            setOpenMenuId(prev => (prev === item.id ? null : item.id));
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
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onViewSubmissions(item);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:bg-slate-500/10"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              <Users className="h-3.5 w-3.5 text-blue-500" />
                              <span>Student Submissions</span>
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
