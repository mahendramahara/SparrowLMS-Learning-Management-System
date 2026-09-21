import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false });
  }
  return cells;
}

export default function CalendarGrid({
  year,
  month,
  events,
  selectedDate,
  onSelectDate,
  onPrev,
  onNext,
}) {
  const today = new Date();
  const cells = buildCalendarDays(year, month);

  const eventsByDay = events.reduce((acc, evt) => {
    const d = new Date(evt.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate();
      if (!acc[key]) acc[key] = [];
      acc[key].push(evt);
    }
    return acc;
  }, {});

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="p-1.5 rounded-lg border transition hover:opacity-80"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onNext}
            className="p-1.5 rounded-lg border transition hover:opacity-80"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold pb-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px">
        {cells.map((cell, idx) => {
          const isToday =
            cell.current &&
            cell.day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          const dateStr = cell.current
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
            : null;
          const isSelected = dateStr === selectedDate;
          const dots = cell.current ? eventsByDay[cell.day] || [] : [];

          return (
            <button
              key={idx}
              onClick={() => cell.current && onSelectDate(dateStr)}
              disabled={!cell.current}
              className={`relative flex flex-col items-center justify-start pt-1.5 pb-2 rounded-xl min-h-[48px] transition-all text-xs font-medium ${
                !cell.current ? 'opacity-25 cursor-default' : 'cursor-pointer hover:opacity-80'
              }`}
              style={{
                backgroundColor: isSelected
                  ? 'var(--color-primary-600)'
                  : isToday
                    ? 'rgba(37, 99, 235, 0.12)'
                    : 'transparent',
                color: isSelected
                  ? '#fff'
                  : isToday
                    ? 'var(--color-primary-600)'
                    : 'var(--text-primary)',
                fontWeight: isToday || isSelected ? '700' : '500',
              }}
            >
              {cell.day}
              {dots.length > 0 && !isSelected && (
                <div className="flex gap-0.5 mt-1">
                  {dots.slice(0, 3).map(evt => (
                    <span
                      key={evt.id}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: evt.color }}
                    />
                  ))}
                </div>
              )}
              {dots.length > 0 && isSelected && (
                <div className="flex gap-0.5 mt-1">
                  {dots.slice(0, 3).map((_, i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/70" />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
