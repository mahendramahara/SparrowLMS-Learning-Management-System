import { Search } from 'lucide-react';

export default function InstructorStudentsHeader({ search, onSearchChange, totalCount }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Students Directory
        </h1>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Monitor your enrolled students, completion percentages, and active status.
        </p>
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
            placeholder="Search students by name, email, or course..."
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
          {totalCount} Total Enrolled
        </span>
      </div>
    </div>
  );
}
