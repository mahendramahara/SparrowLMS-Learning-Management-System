import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import CourseCard from '../../common/CourseCard';
import { getCourses } from '../../../services/course.api';

const COURSE_PRESENTATION = [
  { badge: 'Featured', badgeColor: '#16A34A', avatar: '/images/avatars/suman.jpg' },
  { badge: 'Popular', badgeColor: '#7C3AED', avatar: '/images/avatars/aaras.jpg' },
  { badge: null, badgeColor: '', avatar: '/images/avatars/pratik.jpg' },
];

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const res = await getCourses({ limit: 6 });
        if (isMounted && res?.data?.length) {
          const mapped = res.data.map((course, index) => ({
            ...COURSE_PRESENTATION[index % COURSE_PRESENTATION.length],
            image: course.thumbnail,
            title: course.title,
            instructor: course.instructor?.name || 'Sparrow Instructor',
            rating: course.rating || 5.0,
            enrolled: course.enrolled || 0,
            duration: `${course.duration || 10}h`,
            level: course.level || 'Beginner',
            price: course.price === 0 ? 'Free' : `NPR ${course.price}`,
          }));
          setCourses(mapped);
        }
      } catch (err) {
        void err;
      }
    };
    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="px-6 py-14" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Featured Courses
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              Most popular courses chosen by our learners.
            </p>
          </div>
          <a
            href="/courses"
            className="flex items-center gap-1 text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary-600)' }}
          >
            View All Courses <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(c => (
            <CourseCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
