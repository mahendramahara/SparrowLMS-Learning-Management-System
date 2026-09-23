import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCourseRequestsTable({ requests = [], onApprove, onReject }) {
  if (requests.length === 0) {
    return (
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <p className="text-sm font-semibold">No pending course approval requests at this time.</p>
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
              <th className="py-3 px-4">Proposed Course Title</th>
              <th className="py-3 px-4">Instructor</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Lessons</th>
              <th className="py-3 px-4">Submission Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Approval Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {requests.map(req => (
              <tr key={req.id} className="transition hover:bg-slate-50/5">
                <td className="py-3.5 px-4 font-bold" style={{ color: 'var(--text-primary)' }}>
                  {req.courseTitle}
                </td>
                <td className="py-3.5 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {req.instructor}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className="rounded-lg px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: 'var(--color-primary-600)',
                    }}
                  >
                    {req.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400">
                  {req.lessonsCount} lessons
                </td>
                <td className="py-3.5 px-4 text-slate-400">
                  {req.submittedDate}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {req.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onApprove(req.id)}
                      className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition active:scale-95"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onReject(req.id)}
                      className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition active:scale-95"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
