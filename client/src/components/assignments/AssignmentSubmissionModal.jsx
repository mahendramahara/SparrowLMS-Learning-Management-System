import { useState } from 'react';
import { X, UploadCloud, File, CheckCircle2 } from 'lucide-react';

export default function AssignmentSubmissionModal({
  isOpen,
  onClose,
  assignment,
  onSubmitSuccess,
}) {
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !assignment) return null;

  const handleFileChange = e => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onSubmitSuccess?.(assignment.id);
        onClose();
      }, 1000);
    }, 600);
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
              {assignment.courseTitle}
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
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                Upload Deliverable (.zip, .pdf, .js, .sql)
              </label>
              <label
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <UploadCloud className="h-8 w-8 text-blue-500 mb-2" />
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
                Submission Notes / GitHub Repository Link
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Include deployment links, repository references, or test instructions..."
                className="w-full rounded-xl p-3 text-xs border outline-none transition"
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
                onClick={onClose}
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
                <span>{isSubmitting ? 'Uploading...' : 'Confirm Submission'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
