import { Search } from 'lucide-react';

export default function AdminCoursesHeader({
  search,
  onSearchChange,
  activeTab,
  onTabChange,
  counts,
}) {
  const tabs = [
    { id: 'all', label: 'All Courses', count: counts?.courses || 0 },
    { id: 'categories', label: 'Categories', count: counts?.categories || 0 },
    { id: 'requests', label: 'Course Requests', count: counts?.requests || 0 },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Course Catalog &amp; Approvals
        </h1>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Review published curricula, manage platform categories, and approve new course submissions.
        </p>
      </div>

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
            placeholder="Search by title, instructor, category..."
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

        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto">
          {tabs.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition shrink-0 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] opacity-75 font-normal">({item.count})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
