import { BookOpen, Users, DollarSign, Star } from 'lucide-react';

export default function InstructorCourseStatsSummary({ courses = [] }) {
  const totalCourses = courses.length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
  const totalLessons = courses.reduce((sum, c) => sum + (c.lessons || 0), 0);
  const avgRating = (
    courses.filter(c => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) /
    (courses.filter(c => c.rating > 0).length || 1)
  ).toFixed(1);

  const stats = [
    { label: 'Total Courses', value: totalCourses, icon: BookOpen, color: '#2563eb', bg: 'rgba(37, 99, 235, 0.1)' },
    { label: 'Active Students', value: totalStudents, icon: Users, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Published Lessons', value: totalLessons, icon: DollarSign, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Average Rating', value: avgRating, icon: Star, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-3.5 rounded-2xl p-4 border transition"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: stat.bg, color: stat.color }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </p>
              <h4 className="text-xl font-extrabold tracking-tight mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {stat.value}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}
