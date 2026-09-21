export default function BrowseCategoryFilter({
  categories = [],
  activeCategory = 'All Categories',
  onSelectCategory,
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map(category => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className="shrink-0 rounded-xl px-4 py-2 text-xs font-semibold border transition-all"
            style={
              isActive
                ? {
                    backgroundColor: 'var(--color-primary-600)',
                    borderColor: 'var(--color-primary-600)',
                    color: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                  }
                : {
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }
            }
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
