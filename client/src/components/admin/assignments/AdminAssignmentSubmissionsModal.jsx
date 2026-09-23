import { useState, useMemo, useEffect } from 'react';
import { X, Search, FileText, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { getSubmissions } from '../../../services/assignment.api';

export default function AdminAssignmentSubmissionsModal({
  isOpen,
  onClose,
  assignment,
}) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    if (!isOpen || !assignment) return;
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const res = await getSubmissions(assignment.id || assignment._id);
        if (res.success && Array.isArray(res.data)) {
          setSubmissions(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch submissions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [isOpen, assignment]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => {
      const studentName = s.student?.name || s.studentName || '';
      const studentEmail = s.student?.email || s.studentEmail || '';
      const attachment = s.deliverableFileName || s.deliverableUrl || s.attachment || '';
      const q = search.toLowerCase();
      const matchesSearch =
        studentName.toLowerCase().includes(q) ||
        studentEmail.toLowerCase().includes(q) ||
        attachment.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, search, statusFilter]);

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-3xl rounded-3xl p-6 border shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-start justify-between pb-4 border-b shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-lg px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  color: 'var(--color-primary-600)',
                }}
              >
                {assignment.course}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Due: {assignment.dueDate}
              </span>
            </div>
            <h2 className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
              {assignment.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Created by Instructor:</span>
              <span className="font-semibold text-blue-500">{assignment.instructor || 'Faculty Member'}</span>
              <span>·</span>
              <span>{assignment.submissions} Submissions received</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition hover:opacity-80"
            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3 shrink-0">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search student or submission file..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border pl-9 pr-3 py-1.5 text-xs outline-none transition"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['All', 'Graded', 'Pending'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
                  statusFilter === tab
                    ? 'bg-blue-600 text-white'
                    : 'hover:opacity-80'
                }`}
                style={
                  statusFilter !== tab
                    ? {
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-secondary)',
                      }
                    : undefined
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
          {loading ? (
            <div
              className="rounded-2xl border p-8 text-center"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <p className="text-xs font-semibold">Loading student submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div
              className="rounded-2xl border p-8 text-center"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <p className="text-xs font-semibold">No student submissions match your filter.</p>
            </div>
          ) : (
            filteredSubmissions.map(sub => {
              const studentName = sub.student?.name || sub.studentName || 'Student';
              const studentEmail = sub.student?.email || sub.studentEmail || '';
              const attachmentName = sub.deliverableFileName || sub.deliverableUrl || sub.attachment || '';
              const isGraded = sub.status === 'Graded';
              const formattedDate = sub.submittedAt
                ? new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '';

              return (
                <div
                  key={sub._id || sub.id}
                  className="rounded-2xl border p-4 transition hover:shadow-sm"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
                      >
                        {studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                            {studentName}
                          </h4>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.2 text-[9px] font-bold ${
                              isGraded
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}
                          >
                            {isGraded ? <CheckCircle2 className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                            <span>{sub.status}</span>
                          </span>
                        </div>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {studentEmail} {formattedDate ? `· Submitted ${formattedDate}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Score</span>
                        <span className="text-xs font-bold" style={{ color: isGraded ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {isGraded && sub.grade !== undefined && sub.grade !== null
                            ? `${sub.grade} / ${assignment.points || 100}`
                            : 'Ungraded'}
                        </span>
                      </div>

                      {sub.deliverableUrl && (
                        <a
                          href={sub.deliverableUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition hover:opacity-80 shadow-sm"
                          style={{
                            borderColor: 'var(--border-subtle)',
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-secondary)',
                          }}
                          title="View Student Deliverable"
                        >
                          <ExternalLink className="h-3 w-3 text-blue-500" />
                          <span className="max-w-[120px] truncate">{attachmentName || 'Deliverable Link'}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {sub.notes && (
                    <div
                      className="mt-3 rounded-xl p-2.5 border text-xs"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-subtle)',
                      }}
                    >
                      <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                        Student Notes
                      </span>
                      <p style={{ color: 'var(--text-secondary)' }}>{sub.notes}</p>
                    </div>
                  )}

                  {sub.feedback && (
                    <div
                      className="mt-3 rounded-xl p-2.5 border text-xs"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-subtle)',
                      }}
                    >
                      <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                        Instructor Feedback ({assignment.instructor})
                      </span>
                      <p style={{ color: 'var(--text-secondary)' }}>{sub.feedback}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="pt-4 border-t shrink-0 flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Showing {filteredSubmissions.length} of {submissions.length} submissions
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-bold transition hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
