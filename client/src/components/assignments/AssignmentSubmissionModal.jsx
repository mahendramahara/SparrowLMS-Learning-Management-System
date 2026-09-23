import { useState, useEffect } from 'react';
import { X, UploadCloud, CheckCircle2, Loader2, Link2, ExternalLink, Award, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitAssignment } from '../../services/assignment.api';

export default function AssignmentSubmissionModal({
  isOpen,
  onClose,
  assignment,
  onSubmitSuccess,
}) {
  const existingSub = assignment?.submission;
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (existingSub) {
      setNotes(existingSub.notes || '');
      setDeliverableUrl(existingSub.deliverableUrl || '');
      setFileName(existingSub.deliverableFileName || '');
      setIsEditing(false);
    } else {
      setNotes('');
      setDeliverableUrl('');
      setFileName('');
      setIsEditing(true);
    }
  }, [assignment, existingSub]);

  if (!isOpen || !assignment) return null;

  const handleFileChange = e => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!fileName && !deliverableUrl.trim() && !notes.trim()) {
      toast.error('Please attach a deliverable file, project link, or submission notes');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitAssignment(assignment.id || assignment._id, {
        notes,
        deliverableUrl: deliverableUrl.trim(),
        deliverableFileName: fileName || (deliverableUrl.trim() ? 'Project Repository' : 'Direct Submission'),
      });

      if (res?.success) {
        setSubmitted(true);
        toast.success('Assignment submitted successfully!');
        setTimeout(() => {
          setSubmitted(false);
          onSubmitSuccess?.(assignment.id || assignment._id);
          onClose();
        }, 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)',
        }}
      >
        <div
          className="flex items-center justify-between pb-3 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider">
              {assignment.courseTitle || assignment.course}
            </span>
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Submit: {assignment.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:opacity-75 transition text-slate-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-emerald-600">Assignment Submitted Successfully!</p>
          </div>
        ) : existingSub && !isEditing ? (
          <div className="space-y-4">
            <div
              className="rounded-2xl border p-4 space-y-3"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                  Submission Status
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    existingSub.status === 'Graded'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                  }`}
                >
                  {existingSub.status === 'Graded' ? <Award className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  <span>{existingSub.status}</span>
                </span>
              </div>

              {existingSub.grade !== undefined && existingSub.grade !== null && (
                <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Score</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {existingSub.grade} / {assignment.points || 100}
                  </span>
                </div>
              )}

              {existingSub.deliverableUrl && (
                <div className="border-t pt-2" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[11px] font-semibold block mb-1" style={{ color: 'var(--text-muted)' }}>
                    Deliverable Repository / File
                  </span>
                  <a
                    href={existingSub.deliverableUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>{existingSub.deliverableFileName || existingSub.deliverableUrl}</span>
                  </a>
                </div>
              )}

              {existingSub.notes && (
                <div className="border-t pt-2" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[11px] font-semibold block mb-1" style={{ color: 'var(--text-muted)' }}>
                    Your Submission Notes
                  </span>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {existingSub.notes}
                  </p>
                </div>
              )}

              {existingSub.feedback && (
                <div className="border-t pt-2" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[11px] font-bold block mb-1 text-emerald-600">
                    Instructor Evaluation & Feedback
                  </span>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {existingSub.feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              {existingSub.status !== 'Graded' && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold border transition hover:opacity-80"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  Resubmit / Update Deliverable
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary-600)' }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                Deliverable Repository / Demo URL
              </label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://github.com/username/project or live demo URL..."
                  value={deliverableUrl}
                  onChange={e => setDeliverableUrl(e.target.value)}
                  className="w-full rounded-xl pl-9 pr-3 py-2 text-xs border outline-none transition"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                Or Upload Solution File (.zip, .pdf, .docx, .js)
              </label>
              <label
                className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <UploadCloud className="h-7 w-7 text-blue-500 mb-1.5" />
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {fileName || 'Click to select solution file or drag & drop'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Maximum size: 50MB</span>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            <div>
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                Submission Notes / Documentation
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Include brief explanations, deployment notes, or test instructions..."
                className="w-full rounded-xl p-3 text-xs border outline-none transition resize-none"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div
              className="flex items-center justify-end gap-2 pt-2 border-t"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <button
                type="button"
                onClick={() => (existingSub ? setIsEditing(false) : onClose())}
                className="rounded-xl px-4 py-2 text-xs font-semibold border transition hover:opacity-80"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary-600)' }}
              >
                {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{isSubmitting ? 'Submitting...' : 'Confirm Submission'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
