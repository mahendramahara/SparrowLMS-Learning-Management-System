import { BookOpen, FileText, GraduationCap, Clock } from 'lucide-react';

const TYPE_CONFIG = {
  class: { icon: BookOpen, label: 'Class', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.1)' },
  assignment: {
    icon: FileText,
    label: 'Assignment',
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.1)',
  },
  exam: { icon: GraduationCap, label: 'Exam', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
};

function formatTime(time) {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hr = parseInt(h, 10);
  return `${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

function CalendarEventItem({ event }) {
  const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.class;
  const Icon = config.icon;

  return (
    <div
      className="flex items-start gap-3 rounded-xl p-3.5 border transition hover:opacity-90"
      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
          {event.title}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
          {event.course}
        </p>
        <div className="flex items-center gap-1 mt-1" style={{ color: 'var(--text-muted)' }}>
          <Clock className="h-3 w-3" />
          <span className="text-[11px]">
            {formatTime(event.time)}
            {event.endTime ? ` – ${formatTime(event.endTime)}` : ''}
          </span>
        </div>
      </div>
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.label}
      </span>
    </div>
  );
}

export default function CalendarEventList({ selectedDate, events }) {
  const filtered = events.filter(e => e.date === selectedDate);

  const label = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : 'Select a date';

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-4"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div>
        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          {label}
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {filtered.length > 0
            ? `${filtered.length} event${filtered.length > 1 ? 's' : ''}`
            : 'No events scheduled'}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map(evt => (
            <CalendarEventItem key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl mb-3"
            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          >
            <BookOpen className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            No events for this day
          </p>
        </div>
      )}
    </div>
  );
}
