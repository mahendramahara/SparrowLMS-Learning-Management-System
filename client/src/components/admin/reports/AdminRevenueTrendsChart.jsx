import { TrendingUp, ArrowUpRight, Calendar } from 'lucide-react';

export default function AdminRevenueTrendsChart({ monthlyGrowth = [] }) {
  if (monthlyGrowth.length === 0) return null;

  const maxRevenue = Math.max(...monthlyGrowth.map(d => d.revenue));
  const points = monthlyGrowth.map((d, i) => {
    const x = (i / (monthlyGrowth.length - 1)) * 400 + 40;
    const y = 180 - (d.revenue / (maxRevenue * 1.15)) * 140;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`;

  return (
    <div
      className="rounded-3xl border p-6 transition"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Gross Revenue &amp; Platform Growth
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
              <ArrowUpRight className="h-3 w-3" />
              <span>+38.4% QoQ</span>
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Aggregated monthly course sales and student enrollment velocity across all departments.
          </p>
        </div>

        <div
          className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold self-start sm:self-auto border"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          <span>Last 6 Months (FY 2025-26)</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox="0 0 480 230" className="w-full h-56 select-none overflow-visible">
          <defs>
            <linearGradient id="revenueGrowthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {[40, 90, 140, 190].map(y => (
            <line
              key={y}
              x1="30"
              y1={y}
              x2="460"
              y2={y}
              stroke="currentColor"
              strokeDasharray="4 4"
              className="text-slate-200 dark:text-slate-800"
              strokeWidth="1"
            />
          ))}

          <path d={areaD} fill="url(#revenueGrowthGradient)" />

          <path
            d={pathD}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map(p => (
            <g key={p.month}>
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#2563eb"
                stroke="white"
                strokeWidth="2.5"
                className="transition hover:r-7 cursor-pointer"
              />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-700 dark:fill-slate-300"
              >
                ${(p.revenue / 1000).toFixed(1)}k
              </text>
              <text
                x={p.x}
                y="218"
                textAnchor="middle"
                className="text-[11px] font-semibold fill-slate-400"
              >
                {p.month}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 mt-2 border-t"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Average Monthly Revenue</p>
          <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
            $35,136
          </p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Enrollment Conversion</p>
          <p className="text-sm font-bold text-emerald-500 mt-0.5">91.8% Active</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Refund / Chargeback Rate</p>
          <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
            0.42% (Low)
          </p>
        </div>
      </div>
    </div>
  );
}
