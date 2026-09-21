import { SlidersHorizontal } from 'lucide-react';

export default function BrowseFilterControls({
  sortBy = 'popular',
  onSortChange,
  levelFilter = 'All Levels',
  onLevelChange,
  levels = [],
  filteredCount = 0,
  totalCount = 0,
}) {
  return (
    <div
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div
        className="flex items-center gap-2 text-xs font-semibold"
        style={{ color: 'var(--text-secondary)' }}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" style={{ color: 'var(--color-primary-600)' }} />
        <span>
          Showing <span style={{ color: 'var(--text-primary)' }}>{filteredCount}</span> of{' '}
          {totalCount} courses
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs">
          <span style={{ color: 'var(--text-muted)' }}>Level:</span>
          <select
            value={levelFilter}
            onChange={e => onLevelChange(e.target.value)}
            className="rounded-xl px-2.5 py-1.5 text-xs border outline-none font-medium cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            {levels.map(lvl => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span style={{ color: 'var(--text-muted)' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
            className="rounded-xl px-2.5 py-1.5 text-xs border outline-none font-medium cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="lessons">Most Content</option>
          </select>
        </div>
      </div>
    </div>
  );
}
