import { Search } from 'lucide-react';

export default function CourseFilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  counts,
}) {
  const tabs = [
    { id: 'all', label: 'All Courses', count: counts?.all || 0 },
    { id: 'in_progress', label: 'In Progress', count: counts?.in_progress || 0 },
    { id: 'completed', label: 'Completed', count: counts?.completed || 0 },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
      <div
        className="flex items-center gap-1.5 p-1 rounded-xl border"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}
      >
        {tabs.map(({ id, label, count }) => {
          const isActive = activeFilter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onFilterChange(id)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition"
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--color-primary-600)',
                      color: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }
                  : { color: 'var(--text-secondary)' }
              }
            >
              <span>{label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative w-full sm:w-72">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Filter by title or instructor..."
          className="w-full rounded-xl py-2 pl-9 pr-3 text-xs border outline-none transition"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        />
      </div>
    </div>
  );
}
