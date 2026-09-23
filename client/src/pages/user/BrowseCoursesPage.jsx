import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import BrowseHeroBanner from '../../components/browse/BrowseHeroBanner';
import BrowseCategoryFilter from '../../components/browse/BrowseCategoryFilter';
import BrowseFilterControls from '../../components/browse/BrowseFilterControls';
import BrowseCourseCard from '../../components/browse/BrowseCourseCard';
import StudentCoursePreviewModal from '../../components/browse/StudentCoursePreviewModal';
import { getCourses } from '../../services/course.api';
import { getCategories } from '../../services/category.api';
import { enrollInCourse } from '../../services/enrollment.api';
import { initiatePayment } from '../../services/payment.api';
import EsewaCheckoutForm from '../../components/payment/EsewaCheckoutForm';

const DEFAULT_LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function BrowseCoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [sortBy, setSortBy] = useState('popular');
  const [realCourses, setRealCourses] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState(null);
  const [previewCourse, setPreviewCourse] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [coursesRes, catRes] = await Promise.allSettled([
          getCourses({ isPublished: 'true', limit: 100 }),
          getCategories(),
        ]);

        if (coursesRes.status === 'fulfilled' && coursesRes.value?.success && isMounted) {
          setRealCourses(coursesRes.value.data || []);
        }
        if (catRes.status === 'fulfilled' && catRes.value?.success && isMounted) {
          setCategoriesList(catRes.value.data || []);
        }
      } catch {
        // non-critical
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const allCourses = useMemo(() => {
    return realCourses.map(c => ({
      id: c._id,
      title: c.title,
      description: c.description || c.subtitle || '',
      category: c.category?.name || (typeof c.category === 'string' ? c.category : 'General'),
      level: c.level || 'All Levels',
      price: c.price ? `$${c.price}` : 'Free',
      thumbnail: c.thumbnail || '',
      instructor: c.instructor?.name || 'Instructor',
      instructorRole: 'Course Author',
      duration: `${c.duration || 10} hours`,
      lessonsCount: c.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 0,
      studentsCount: c.enrolled || 0,
      rating: c.rating > 0 ? Number(c.rating).toFixed(1) : '5.0',
      reviewCount: c.reviewCount || 0,
      tags: c.tags || [],
      chapters: c.chapters || [],
      rawCourse: c,
    }));
  }, [realCourses]);

  const categories = useMemo(() => {
    const list = categoriesList.map(cat => (typeof cat === 'object' ? cat.name : cat));
    return ['All Categories', ...list];
  }, [categoriesList]);

  const featuredTags = useMemo(() => {
    const tagsSet = new Set();
    realCourses.forEach(c => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach(t => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet).slice(0, 6);
  }, [realCourses]);

  const filteredAndSortedCourses = useMemo(() => {
    return allCourses
      .filter(course => {
        const matchesCategory =
          activeCategory === 'All Categories' ||
          course.category.toLowerCase() === activeCategory.toLowerCase();

        const matchesLevel =
          levelFilter === 'All Levels' ||
          (course.level || '').toLowerCase() === levelFilter.toLowerCase();

        const matchesSearch =
          !searchQuery ||
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesLevel && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return Number(b.rating) - Number(a.rating);
        if (sortBy === 'lessons') return b.lessonsCount - a.lessonsCount;
        return b.studentsCount - a.studentsCount;
      });
  }, [allCourses, activeCategory, levelFilter, searchQuery, sortBy]);

  const handleEnroll = async course => {
    if (!user) {
      toast.error('Please login to enroll in this course');
      navigate('/login', { state: { from: '/courses' } });
      return;
    }

    const price = typeof course.price === 'number' ? course.price : parseFloat(String(course.price).replace(/[^0-9.]/g, '') || 0);

    if (price === 0) {
      try {
        const res = await enrollInCourse(course.id);
        toast.success(res?.message || 'Enrolled in course successfully!');
        navigate('/student/courses');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to enroll in course');
      }
      return;
    }

    try {
      const res = await initiatePayment(course.id);
      if (res.isFree || res.alreadyEnrolled) {
        toast.success(res.message);
        navigate('/student/courses');
        return;
      }
      if (res.data?.formData && res.data?.paymentUrl) {
        setCheckoutData({
          formData: res.data.formData,
          paymentUrl: res.data.paymentUrl,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <BrowseHeroBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        featuredTags={featuredTags}
        onTagClick={tag => setSearchQuery(tag)}
        totalCoursesCount={allCourses.length}
      />

      <BrowseCategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <BrowseFilterControls
        sortBy={sortBy}
        onSortChange={setSortBy}
        levelFilter={levelFilter}
        onLevelChange={setLevelFilter}
        levels={DEFAULT_LEVELS}
        filteredCount={filteredAndSortedCourses.length}
        totalCount={allCourses.length}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : filteredAndSortedCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCourses.map(course => (
            <BrowseCourseCard
              key={course.id}
              course={course}
              onEnroll={handleEnroll}
              onPreview={c => setPreviewCourse(c)}
            />
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
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            {allCourses.length === 0 ? 'No Courses Available' : 'No courses match your criteria'}
          </h3>
          <p className="text-xs max-w-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {allCourses.length === 0
              ? 'There are currently no published courses available in the catalog. Please check back later.'
              : 'Try resetting your search query or choosing another category filter.'}
          </p>
          {allCourses.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All Categories');
                setLevelFilter('All Levels');
              }}
              className="mt-4 rounded-xl px-4 py-2 text-xs font-semibold border transition hover:opacity-80"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {checkoutData && (
        <EsewaCheckoutForm
          formData={checkoutData.formData}
          paymentUrl={checkoutData.paymentUrl}
          onCancel={() => setCheckoutData(null)}
        />
      )}

      {previewCourse && (
        <StudentCoursePreviewModal
          course={previewCourse}
          onClose={() => setPreviewCourse(null)}
          onEnroll={handleEnroll}
        />
      )}
    </div>
  );
}
