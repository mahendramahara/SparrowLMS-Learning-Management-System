import { Search, Download } from 'lucide-react';

export default function AdminEnrollmentsHeader({ search, onSearchChange, totalCount }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Enrollment Records &amp; Audits
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Monitor student course purchases, financial settlements, and active enrollments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.alert('Exporting enrollment report CSV...')}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
        >
          <Download className="h-4 w-4" />
          <span>Export Audit Log</span>
        </button>
      </div>

      <div
        className="flex items-center justify-between gap-4 rounded-2xl p-4 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search enrollments by student, course, or instructor..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full rounded-xl py-2 pl-9 pr-4 text-xs border outline-none"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
          {totalCount} Total Recorded
        </span>
      </div>
    </div>
  );
}
