import { Search } from 'lucide-react';

export default function InstructorCoursesFilter({ search, onSearchChange, filter, onFilterChange }) {
  const tabs = ['All', 'Published', 'Draft'];

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl p-3 border"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full rounded-xl py-2 pl-9 pr-4 text-xs border outline-none transition"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      <div className="flex items-center gap-1.5 self-stretch sm:self-auto">
        {tabs.map(item => (
          <button
            key={item}
            type="button"
            onClick={() => onFilterChange(item)}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              filter === item
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
