import { useState, useEffect, useMemo } from 'react';
import { X, Search, CheckCircle2, Clock, Download, ExternalLink, Loader2, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSubmissions, gradeSubmission } from '../../../services/assignment.api';

export default function InstructorAssignmentSubmissionsModal({
  isOpen,
  onClose,
  assignment,
  onGraded,
}) {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gradingId, setGradingId] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [isSavingGrade, setIsSavingGrade] = useState(false);

  useEffect(() => {
    if (!isOpen || !assignment) return;
    let isMounted = true;

    const fetchSubs = async () => {
      setIsLoading(true);
      try {
        const res = await getSubmissions(assignment.id || assignment._id);
        if (res?.success && isMounted) {
          setSubmissions(res.data || []);
        }
      } catch (err) {
        if (isMounted) {
          toast.error(err.response?.data?.message || 'Failed to load submissions');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSubs();
    return () => {
      isMounted = false;
    };
  }, [isOpen, assignment]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => {
      const studentName = s.student?.name || 'Student';
      const studentEmail = s.student?.email || '';
      const matchesSearch =
        studentName.toLowerCase().includes(search.toLowerCase()) ||
        studentEmail.toLowerCase().includes(search.toLowerCase()) ||
        (s.deliverableFileName && s.deliverableFileName.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, search, statusFilter]);

  const handleStartGrading = sub => {
    setGradingId(sub._id);
    setGradeInput(sub.grade !== null && sub.grade !== undefined ? String(sub.grade) : '');
    setFeedbackInput(sub.feedback || '');
  };

  const handleSaveGrade = async subId => {
    if (gradeInput === '') {
      toast.error('Please enter a grade score');
      return;
    }

    setIsSavingGrade(true);
    try {
      const res = await gradeSubmission(subId, {
        grade: Number(gradeInput),
        feedback: feedbackInput,
      });

      if (res?.success) {
        toast.success('Submission graded successfully');
        setSubmissions(prev =>
          prev.map(s => (s._id === subId ? { ...s, grade: Number(gradeInput), feedback: feedbackInput, status: 'Graded' } : s))
        );
        setGradingId(null);
        onGraded?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save grade');
    } finally {
      setIsSavingGrade(false);
    }
  };

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
                Max Points: {assignment.points || 100}
              </span>
            </div>
            <h2 className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
              Evaluate: {assignment.title}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {submissions.length} total submission(s) received from enrolled students.
            </p>
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
              placeholder="Search by student name or email..."
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
            {['All', 'Graded', 'Submitted'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
                  statusFilter === tab ? 'bg-blue-600 text-white' : 'hover:opacity-80'
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
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
              <p className="text-xs font-semibold">
                {submissions.length === 0 ? 'No student submissions submitted yet.' : 'No submissions match your filter.'}
              </p>
            </div>
          ) : (
            filteredSubmissions.map(sub => {
              const isGraded = sub.status === 'Graded';
              const isCurrentlyGrading = gradingId === sub._id;
              const studentName = sub.student?.name || 'Student';
              const studentEmail = sub.student?.email || '';

              return (
                <div
                  key={sub._id}
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
                        style={{ backgroundColor: 'var(--color-primary-600)' }}
                      >
                        {studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                            {studentName}
                          </h4>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
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
                          {studentEmail} · Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="text-right mr-1">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Score</span>
                        <span className="text-xs font-bold" style={{ color: isGraded ? '#059669' : 'var(--text-muted)' }}>
                          {sub.grade !== null && sub.grade !== undefined ? `${sub.grade} / ${assignment.points || 100}` : 'Ungraded'}
                        </span>
                      </div>

                      {sub.deliverableUrl && (
                        <a
                          href={sub.deliverableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition hover:opacity-80 shadow-sm"
                          style={{
                            borderColor: 'var(--border-subtle)',
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--color-primary-600)',
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="max-w-[120px] truncate">{sub.deliverableFileName || 'Deliverable'}</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => (isCurrentlyGrading ? setGradingId(null) : handleStartGrading(sub))}
                        className="rounded-xl px-3 py-1.5 text-xs font-bold text-white transition active:scale-95"
                        style={{ backgroundColor: isCurrentlyGrading ? '#64748b' : 'var(--color-primary-600)' }}
                      >
                        {isCurrentlyGrading ? 'Cancel' : isGraded ? 'Update Grade' : 'Grade'}
                      </button>
                    </div>
                  </div>

                  {sub.notes && (
                    <div className="mt-2.5 text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">Student notes: </span>
                      {sub.notes}
                    </div>
                  )}

                  {isCurrentlyGrading ? (
                    <div
                      className="mt-3.5 rounded-xl p-3 border space-y-3"
                      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-32">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            Score (out of {assignment.points || 100})
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={assignment.points || 100}
                            value={gradeInput}
                            onChange={e => setGradeInput(e.target.value)}
                            placeholder="e.g. 95"
                            className="w-full rounded-lg border px-2.5 py-1.5 text-xs outline-none"
                            style={{
                              backgroundColor: 'var(--bg-subtle)',
                              borderColor: 'var(--border-subtle)',
                              color: 'var(--text-primary)',
                            }}
                          />
                        </div>

                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            Feedback Comments
                          </label>
                          <input
                            type="text"
                            value={feedbackInput}
                            onChange={e => setFeedbackInput(e.target.value)}
                            placeholder="Great job! Clean architecture and well-documented API."
                            className="w-full rounded-lg border px-2.5 py-1.5 text-xs outline-none"
                            style={{
                              backgroundColor: 'var(--bg-subtle)',
                              borderColor: 'var(--border-subtle)',
                              color: 'var(--text-primary)',
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={isSavingGrade}
                          onClick={() => handleSaveGrade(sub._id)}
                          className="flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                          style={{ backgroundColor: '#10b981' }}
                        >
                          {isSavingGrade && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                          <span>Submit Grade</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    sub.feedback && (
                      <div
                        className="mt-2.5 rounded-xl p-2.5 border text-xs"
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-subtle)',
                        }}
                      >
                        <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                          Feedback Given
                        </span>
                        <p style={{ color: 'var(--text-secondary)' }}>{sub.feedback}</p>
                      </div>
                    )
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
