import { Search } from 'lucide-react';

export default function BrowseHeroBanner({
  searchQuery,
  onSearchChange,
  featuredTags = [],
  onTagClick,
  totalCoursesCount = 0,
}) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-sm"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-2xl space-y-3">
        <span
          className="text-xs font-bold tracking-wider uppercase"
          style={{ color: 'var(--color-primary-600)' }}
        >
          Explore Catalog ({totalCoursesCount} Courses)
        </span>

        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Discover In-Demand Tech Skills
        </h1>

        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Browse verified curriculum taught by seasoned software engineers and researchers from
          Nepal and global tech.
        </p>

        <div className="pt-2">
          <div
            className="relative flex w-full items-center rounded-2xl p-1.5 border shadow-inner transition-all focus-within:ring-2"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <Search className="ml-3 h-4 w-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search by topic, keyword, or instructor..."
              className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {featuredTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="font-semibold text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Trending:
            </span>
            {featuredTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick?.(tag)}
                className="rounded-lg px-2.5 py-1 text-[11px] font-medium border transition hover:opacity-80"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
