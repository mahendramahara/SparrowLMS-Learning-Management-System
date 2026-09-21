import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MiniCalendar({
  month = 'September 2025',
  totalDays = 30,
  activeDay = 24,
  markedDay = 25,
}) {
  const daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div
      className="flex flex-col justify-between rounded-2xl p-5 border transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div
        className="flex items-center justify-between pb-3 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          Calendar
        </h3>
        <Link
          to="/student/calendar"
          className="flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: 'var(--color-primary-600)' }}
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex items-center justify-between py-3">
        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
          {month}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-1 rounded-lg border hover:opacity-75 transition"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1 rounded-lg border hover:opacity-75 transition"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
            aria-label="Next month"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div
        className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium py-1"
        style={{ color: 'var(--text-muted)' }}
      >
        {DAYS.map(d => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        <div />
        {daysInMonth.map(d => {
          const isActive = d === activeDay;
          const isMarked = d === markedDay;
          return (
            <div key={d} className="flex items-center justify-center py-1">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30'
                    : isMarked
                      ? 'border border-blue-500 text-blue-600 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {d}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
