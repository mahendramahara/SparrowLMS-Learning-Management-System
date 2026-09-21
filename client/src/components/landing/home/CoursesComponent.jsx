import { ArrowRight } from 'lucide-react';
import CourseCard from '../../common/CourseCard';
import coursesData from '../../../demo/courses.json';

const COURSE_PRESENTATION = [
  { badge: 'Featured', badgeColor: '#16A34A', avatar: '/images/avatars/suman.jpg' },
  { badge: 'Popular', badgeColor: '#7C3AED', avatar: '/images/avatars/aaras.jpg' },
  { badge: null, badgeColor: '', avatar: '/images/avatars/pratik.jpg' },
];

const COURSES = coursesData
  .filter(course => course.status === 'Published')
  .map((course, index) => ({
    ...COURSE_PRESENTATION[index % COURSE_PRESENTATION.length],
    image: course.thumbnail,
    title: course.title,
    instructor: course.instructor,
    rating: course.rating,
    enrolled: course.enrolled,
    duration: course.duration,
    level: course.level,
    price: course.price,
  }));

export default function FeaturedCourses() {
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
            href="#"
            className="flex items-center gap-1 text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary-600)' }}
          >
            View All Courses <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map(c => (
            <CourseCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
