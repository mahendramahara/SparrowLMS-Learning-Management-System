import { useState } from 'react';
import CalendarGrid from '../../components/calendar/CalendarGrid';
import CalendarEventList from '../../components/calendar/CalendarEventList';
import CalendarLegend from '../../components/calendar/CalendarLegend';
import calendarData from '../../demo/studentCalendar.json';

export default function StudentCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  );

  const events = calendarData.events;

  const handlePrev = () => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else setMonth(m => m - 1);
  };

  const handleNext = () => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else setMonth(m => m + 1);
  };

  const upcomingCount = events.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Calendar
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          View your classes, assignments, and exams in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarGrid
            year={year}
            month={month}
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>

        <div className="flex flex-col gap-4">
          <CalendarEventList selectedDate={selectedDate} events={events} />
          <CalendarLegend upcomingCount={upcomingCount} />
        </div>
      </div>
    </div>
  );
}
