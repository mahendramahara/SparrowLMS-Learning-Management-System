import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Video } from 'lucide-react';

export default function InstructorUpcomingClasses({ classes = [] }) {
  return (
    <div
      className="rounded-2xl p-6 border space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Upcoming Classes
        </h3>
        <Link
          to="/instructor/courses"
          className="flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: 'var(--color-primary-600, #2563eb)' }}
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {classes.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 p-3 rounded-xl border transition hover:bg-slate-50/5"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex flex-col items-center justify-center h-11 w-11 shrink-0 rounded-xl font-bold leading-none border"
                style={{
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  borderColor: 'rgba(37, 99, 235, 0.2)',
                  color: 'var(--color-primary-600, #2563eb)',
                }}
              >
                <span className="text-sm font-extrabold">{item.day}</span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">{item.month}</span>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </p>
                <p className="flex items-center gap-1 text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  <Clock className="h-3 w-3" />
                  <span>{item.time}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90 shadow-sm"
              style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
            >
              <Video className="h-3 w-3" />
              <span>Join</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
