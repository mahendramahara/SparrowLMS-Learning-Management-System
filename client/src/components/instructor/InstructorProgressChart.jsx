import { useState } from 'react';
import { Users, CheckCircle, Clock, Award, TrendingUp } from 'lucide-react';

const STAT_ICONS = {
  users: Users,
  'check-circle': CheckCircle,
  clock: Clock,
  award: Award,
};

export default function InstructorProgressChart({ progressData, courseStats = [] }) {
  const [activeRange, setActiveRange] = useState('30 Days');
  const ranges = ['7 Days', '30 Days', '3 Months'];

  const isProgressObject = Boolean(progressData && typeof progressData === 'object' && !Array.isArray(progressData));
  const days = isProgressObject && Array.isArray(progressData.days) && progressData.days.length > 0
    ? progressData.days
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const counts = isProgressObject && Array.isArray(progressData.counts) && progressData.counts.length > 0
    ? progressData.counts
    : [10, 16, 14, 22, 19, 28, 24];

  const highlight = isProgressObject ? progressData.highlight : null;

  const statsList = Array.isArray(courseStats)
    ? courseStats
    : [
        {
          id: 'enrolled',
          title: 'Total Enrolled',
          value: String(courseStats?.totalEnrolled || 0),
          trend: 'Active learners',
          icon: 'users',
          color: '#2563eb',
          bg: 'rgba(37, 99, 235, 0.1)',
        },
        {
          id: 'completion',
          title: 'Course Completion',
          value: String(courseStats?.avgCompletion || '0%'),
          trend: 'Curriculum pace',
          icon: 'check-circle',
          color: '#10b981',
          bg: 'rgba(16, 185, 129, 0.1)',
        },
      ];

  const maxVal = Math.max(...(counts.length ? counts : [50]), 50);
  const minVal = 0;
  const width = 500;
  const height = 160;

  const points = counts.map((val, idx) => {
    const x = (idx / (counts.length - 1 || 1)) * (width - 40) + 20;
    const y = height - 20 - ((val - minVal) / (maxVal - minVal)) * (height - 40);
    return { x, y, val, label: days[idx] };
  });

  const pathD = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    return `${acc} C ${cp1x} ${prev.y}, ${cp2x} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = points.length
    ? `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
    : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div
        className="lg:col-span-7 rounded-2xl p-6 border flex flex-col justify-between"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Student Progress
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Overall learner activity &amp; engagement trend
            </p>
          </div>

          <div
            className="flex items-center gap-1 p-1 rounded-xl border text-xs"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            {ranges.map(range => (
              <button
                type="button"
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeRange === range
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full overflow-hidden pt-4 pb-2">
          {highlight && (
            <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10 rounded-xl px-3 py-1.5 shadow-lg border text-center text-xs font-semibold bg-slate-900 text-white border-slate-700">
              <span className="text-[10px] text-slate-400 block">{highlight.date}</span>
              <span>{highlight.text}</span>
            </div>
          )}

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line x1="0" y1="30" x2={width} y2="30" stroke="var(--border-subtle)" strokeDasharray="3 3" opacity="0.6" />
            <line x1="0" y1="75" x2={width} y2="75" stroke="var(--border-subtle)" strokeDasharray="3 3" opacity="0.6" />
            <line x1="0" y1="120" x2={width} y2="120" stroke="var(--border-subtle)" strokeDasharray="3 3" opacity="0.6" />

            {areaD && <path d={areaD} fill="url(#chartGradient)" />}

            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {points.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={i === 3 ? 5 : 3.5}
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth={i === 3 ? 3 : 2}
              />
            ))}
          </svg>

          <div className="flex items-center justify-between text-[11px] pt-2 px-2" style={{ color: 'var(--text-muted)' }}>
            {days.map((day, idx) => (
              <span key={idx}>{day}</span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="lg:col-span-5 rounded-2xl p-6 border flex flex-col justify-between"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Course Stats
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Aggregated metrics across all curriculums
          </p>
        </div>

        <div className="space-y-3">
          {statsList.map(item => {
            const Icon = STAT_ICONS[item.icon] || Users;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border transition hover:bg-slate-50/5"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: item.bg, color: item.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                      {item.title}
                    </p>
                    <p className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
                      {item.value}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{item.trend}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
