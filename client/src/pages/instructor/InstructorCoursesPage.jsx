import { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import InstructorCoursesHeader from '../../components/instructor/courses/InstructorCoursesHeader';
import InstructorCourseStatsSummary from '../../components/instructor/courses/InstructorCourseStatsSummary';
import InstructorCoursesFilter from '../../components/instructor/courses/InstructorCoursesFilter';
import InstructorCourseCard from '../../components/instructor/courses/InstructorCourseCard';
import { getMyCourses } from '../../services/course.api';

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await getMyCourses();
        if (isMounted && res?.success) {
          setCourses(res.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load your courses');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesFilter = filter === 'All' || c.status === filter.toLowerCase();
      const catName = c.category?.name || (typeof c.category === 'string' ? c.category : '');
      const matchesSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        catName.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [courses, filter, search]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 py-20 rounded-2xl border"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}
      >
        <AlertCircle className="h-8 w-8 text-rose-500" />
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs font-bold text-blue-500 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <InstructorCoursesHeader />

      <InstructorCourseStatsSummary courses={courses} />

      <InstructorCoursesFilter
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />

      {filteredCourses.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-2 py-16 rounded-2xl border border-dashed"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <p className="text-sm font-semibold">
            {search || filter !== 'All' ? 'No courses match your filters.' : 'No courses yet. Create your first course!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(course => (
            <InstructorCourseCard key={course._id || course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
