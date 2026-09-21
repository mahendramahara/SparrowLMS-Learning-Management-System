import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import CourseStatsSummary from '../../components/courses/CourseStatsSummary';
import CourseFilterBar from '../../components/courses/CourseFilterBar';
import StudentCourseItemCard from '../../components/courses/StudentCourseItemCard';
import studentCoursesData from '../../demo/studentCourses.json';

export default function StudentCoursesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const allCourses = studentCoursesData.courses;

  const counts = useMemo(() => {
    return {
      all: allCourses.length,
      in_progress: allCourses.filter(c => c.status === 'In Progress').length,
      completed: allCourses.filter(c => c.status === 'Completed').length,
    };
  }, [allCourses]);

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'in_progress') return course.status === 'In Progress';
      if (activeFilter === 'completed') return course.status === 'Completed';
      return true;
    });
  }, [allCourses, searchQuery, activeFilter]);

  const handleAction = course => {
    navigate(`/student/course/${course.id}`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="space-y-1">
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          My Enrolled Courses
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Track your course progression, resume lessons, and access earned certificates.
        </p>
      </div>

      <CourseStatsSummary summary={studentCoursesData.summary} />

      <CourseFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map(course => (
            <StudentCourseItemCard key={course.id} course={course} onAction={handleAction} />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-2xl p-12 text-center border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl mb-3"
            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          >
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            No courses found
          </h3>
          <p className="text-xs max-w-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            No enrolled courses match your current search or filter criteria. Try adjusting your
            search query.
          </p>
        </div>
      )}
    </div>
  );
}
