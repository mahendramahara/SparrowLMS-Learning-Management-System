export default function NotificationFilterTabs({ activeFilter = 'all', onFilterChange, counts }) {
  const tabs = [
    { id: 'all', label: 'All', count: counts?.all || 0 },
    { id: 'unread', label: 'Unread', count: counts?.unread || 0 },
    { id: 'assignment', label: 'Assignments', count: counts?.assignment || 0 },
    { id: 'course', label: 'Courses', count: counts?.course || 0 },
    { id: 'grade', label: 'Grades', count: counts?.grade || 0 },
  ];

  return (
    <div
      className="flex items-center gap-1.5 p-1 rounded-xl border overflow-x-auto"
      style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}
    >
      {tabs.map(({ id, label, count }) => {
        const isActive = activeFilter === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onFilterChange(id)}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition shrink-0"
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
  );
}
