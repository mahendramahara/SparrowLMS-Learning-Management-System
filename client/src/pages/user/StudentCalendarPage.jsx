import { useState, useEffect, useMemo } from 'react';
import CalendarGrid from '../../components/calendar/CalendarGrid';
import CalendarEventList from '../../components/calendar/CalendarEventList';
import CalendarLegend from '../../components/calendar/CalendarLegend';
import { getAllAssignments } from '../../services/assignment.api';
import { getMyEnrollments } from '../../services/enrollment.api';
import { Loader2 } from 'lucide-react';

export default function StudentCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  );
  const [assignments, setAssignments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadEvents = async () => {
      try {
        const [assignRes, enrollRes] = await Promise.allSettled([
          getAllAssignments(),
          getMyEnrollments(),
        ]);
        if (isMounted) {
          if (assignRes.status === 'fulfilled' && assignRes.value?.data) {
            setAssignments(assignRes.value.data);
          }
          if (enrollRes.status === 'fulfilled' && enrollRes.value?.data) {
            setEnrollments(enrollRes.value.data);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const events = useMemo(() => {
    const list = [];
    assignments.forEach(a => {
      const due = a.rawDueDate ? new Date(a.rawDueDate) : (a.dueDate ? new Date(a.dueDate) : null);
      if (due && !isNaN(due.getTime())) {
        const dateStr = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, '0')}-${String(due.getDate()).padStart(2, '0')}`;
        const timeStr = `${String(due.getHours()).padStart(2, '0')}:${String(due.getMinutes()).padStart(2, '0')}`;
        list.push({
          id: a._id || a.id,
          title: a.title,
          date: dateStr,
          time: timeStr || '23:59',
          endTime: null,
          type: 'assignment',
          course: a.course?.title || 'Course Assignment',
          instructor: a.course?.instructor?.name || 'Instructor',
          color: '#d97706',
        });
      }
    });

    enrollments.forEach(e => {
      const accessDate = e.enrolledAt ? new Date(e.enrolledAt) : new Date();
      const dateStr = `${accessDate.getFullYear()}-${String(accessDate.getMonth() + 1).padStart(2, '0')}-${String(accessDate.getDate()).padStart(2, '0')}`;
      list.push({
        id: `course-${e._id}`,
        title: `${e.course?.title || 'Course'} — Learning Session`,
        date: dateStr,
        time: '10:00',
        endTime: '11:30',
        type: 'class',
        course: e.course?.title || 'Enrolled Course',
        instructor: e.course?.instructor?.name || 'Instructor',
        color: '#2563eb',
      });
    });

    return list;
  }, [assignments, enrollments]);

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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

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
