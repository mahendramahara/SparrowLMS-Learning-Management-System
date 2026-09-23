import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Loader2 } from 'lucide-react';
import CourseStatsSummary from '../../components/courses/CourseStatsSummary';
import CourseFilterBar from '../../components/courses/CourseFilterBar';
import StudentCourseItemCard from '../../components/courses/StudentCourseItemCard';
import { getMyEnrollments } from '../../services/enrollment.api';

export default function StudentCoursesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchEnrollments = async () => {
      try {
        const res = await getMyEnrollments();
        if (res?.success && isMounted) {
          setEnrollments(res.data || []);
        }
      } catch {
        // graceful fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchEnrollments();
    return () => {
      isMounted = false;
    };
  }, []);

  const allCourses = useMemo(() => {
    return enrollments.map(e => {
      const c = e.course || {};
      const catName = c.category?.name || (typeof c.category === 'string' ? c.category : 'General');
      const totalLessons = c.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 10;
      const isCompleted = e.progress >= 100 || e.status === 'completed';

      return {
        id: c._id || e._id,
        courseId: c._id,
        enrollmentId: e._id,
        title: c.title || 'Untitled Course',
        description: c.subtitle || c.description || '',
        instructor: c.instructor?.name || 'Instructor',
        category: catName,
        level: c.level || 'All Levels',
        thumbnail: c.thumbnail || '',
        progress: e.progress || 0,
        status: isCompleted ? 'Completed' : 'In Progress',
        completedLessons: e.completedLessons?.length || Math.round((e.progress || 0) / 10),
        totalLessons,
        duration: `${c.duration || 10} hours`,
        lastAccessed: 'Recently',
      };
    });
  }, [enrollments]);

  const summary = useMemo(() => {
    const totalEnrolled = allCourses.length;
    const completed = allCourses.filter(c => c.status === 'Completed').length;
    const inProgress = allCourses.filter(c => c.status === 'In Progress').length;
    return {
      totalEnrolled,
      inProgress,
      completed,
      certificatesEarned: completed,
    };
  }, [allCourses]);

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
    navigate(`/student/course/${course.courseId || course.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

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

      <CourseStatsSummary summary={summary} />

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
            {allCourses.length === 0 ? 'No Enrolled Courses Yet' : 'No courses match your criteria'}
          </h3>
          <p className="text-xs max-w-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {allCourses.length === 0
              ? 'Browse our course catalog to find relevant topics and start your learning journey.'
              : 'Try adjusting your search query or switching tabs.'}
          </p>
          {allCourses.length === 0 && (
            <button
              type="button"
              onClick={() => navigate('/student/browse')}
              className="mt-4 flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Browse Catalog</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
