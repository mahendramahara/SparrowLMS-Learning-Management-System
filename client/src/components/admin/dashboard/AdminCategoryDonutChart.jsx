export default function AdminCategoryDonutChart({ data }) {
  const total = data?.total || 42;
  const categories = data?.categories || [];

  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div
      className="flex flex-col justify-between rounded-2xl p-5 border"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <h2 className="text-sm sm:text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Courses by Category
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="-rotate-90">
            {categories.map((cat, idx) => {
              const percent = cat.count / total;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += percent;

              return (
                <circle
                  key={cat.name || idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:opacity-85"
                />
              );
            })}
          </svg>

          <div className="absolute text-center leading-tight pointer-events-none">
            <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
              {total}
            </span>
            <p className="text-[10px] text-slate-400 font-semibold">Total Courses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 flex-1 w-full text-xs">
          {categories.map(cat => (
            <div key={cat.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
                  {cat.name}
                </span>
              </div>
              <span className="font-semibold shrink-0" style={{ color: 'var(--text-muted)' }}>
                {cat.count} ({cat.percentage})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
