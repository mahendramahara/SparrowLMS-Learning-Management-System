import { useState, useEffect, useMemo } from 'react';
import CalendarGrid from '../../components/calendar/CalendarGrid';
import CalendarEventList from '../../components/calendar/CalendarEventList';
import CalendarLegend from '../../components/calendar/CalendarLegend';
import { getAllAssignments } from '../../services/assignment.api';
import { getMyCourses } from '../../services/course.api';
import { Loader2 } from 'lucide-react';

export default function InstructorCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  );
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [assignRes, coursesRes] = await Promise.allSettled([
          getAllAssignments(),
          getMyCourses(),
        ]);
        if (isMounted) {
          if (assignRes.status === 'fulfilled' && assignRes.value?.data) {
            setAssignments(assignRes.value.data);
          }
          if (coursesRes.status === 'fulfilled' && coursesRes.value?.data) {
            setCourses(coursesRes.value.data);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
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
          title: `Deadline: ${a.title}`,
          date: dateStr,
          time: timeStr || '23:59',
          endTime: null,
          type: 'assignment',
          course: a.course?.title || 'Assignment Deadline',
          instructor: 'You',
          color: '#d97706',
        });
      }
    });

    courses.forEach(c => {
      const createdDate = c.createdAt ? new Date(c.createdAt) : new Date();
      const dateStr = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}-${String(createdDate.getDate()).padStart(2, '0')}`;
      list.push({
        id: `course-${c._id}`,
        title: `${c.title} — Lecture & QA Office Hours`,
        date: dateStr,
        time: '14:00',
        endTime: '15:30',
        type: 'class',
        course: c.title,
        instructor: 'You',
        color: '#2563eb',
      });
    });

    return list;
  }, [assignments, courses]);

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
          Teaching Schedule & Calendar
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Manage your lectures, office hours, and assignment deadlines.
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
