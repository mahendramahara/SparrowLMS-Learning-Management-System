import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function AdminEnrollmentChart({ data }) {
  const [range, setRange] = useState('Last 6 Months');

  const months = data?.months || ['Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025'];
  const enrollments = data?.enrollments || [120, 390, 480, 560, 680, 840];
  const completions = data?.completions || [80, 150, 260, 320, 420, 510];

  const maxVal = 1000;
  const chartHeight = 220;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  const getPoints = dataset => {
    const stepX = (chartWidth - paddingX * 2) / (months.length - 1);
    return dataset.map((val, idx) => {
      const x = paddingX + idx * stepX;
      const y = chartHeight - paddingY - (val / maxVal) * (chartHeight - paddingY * 2);
      return { x, y, val };
    });
  };

  const enrollmentPoints = getPoints(enrollments);
  const completionPoints = getPoints(completions);

  const getSvgPath = points => {
    return points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');
  };

  const yTicks = [1000, 800, 600, 400, 200, 0];

  return (
    <div
      className="flex flex-col justify-between rounded-2xl p-5 border"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Enrollment Overview
          </h2>
          <div className="flex items-center gap-4 mt-1.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span style={{ color: 'var(--text-secondary)' }}>Enrollments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span style={{ color: 'var(--text-secondary)' }}>Course Completions</span>
            </div>
          </div>
        </div>

        <div className="relative self-start sm:self-auto">
          <select
            value={range}
            onChange={e => setRange(e.target.value)}
            className="appearance-none rounded-xl border px-3 py-1.5 pr-8 text-xs font-semibold outline-none transition"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="This Year">This Year</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
            style={{ color: 'var(--text-muted)' }}
          />
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-56 min-w-[420px]"
          preserveAspectRatio="none"
        >
          {yTicks.map(tick => {
            const y = chartHeight - paddingY - (tick / maxVal) * (chartHeight - paddingY * 2);
            return (
              <g key={tick}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize="10"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          <path
            d={getSvgPath(enrollmentPoints)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <path
            d={getSvgPath(completionPoints)}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {enrollmentPoints.map((pt, i) => (
            <circle
              key={`e_${i}`}
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill="#ffffff"
              stroke="#3b82f6"
              strokeWidth="2"
            />
          ))}

          {completionPoints.map((pt, i) => (
            <circle
              key={`c_${i}`}
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill="#ffffff"
              stroke="#10b981"
              strokeWidth="2"
            />
          ))}

          {months.map((month, idx) => {
            const stepX = (chartWidth - paddingX * 2) / (months.length - 1);
            const x = paddingX + idx * stepX;
            return (
              <text
                key={month}
                x={x}
                y={chartHeight - 4}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="10"
              >
                {month}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
