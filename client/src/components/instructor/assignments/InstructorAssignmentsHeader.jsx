import { Plus } from 'lucide-react';

export default function InstructorAssignmentsHeader({ onNewAssignment }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Assignments &amp; Tasks
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Create and manage course deliverables, review submissions, and evaluate student work.
        </p>
      </div>

      <button
        onClick={onNewAssignment}
        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
        style={{ backgroundColor: 'var(--color-primary-600)' }}
      >
        <Plus className="h-4 w-4" />
        <span>Create Assignment</span>
      </button>
    </div>
  );
}
