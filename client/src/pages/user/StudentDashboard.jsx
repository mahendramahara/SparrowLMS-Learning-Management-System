import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckSquare,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  Code,
  Terminal,
  Palette,
  Cpu,
  FileText,
  MessageSquare,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  Compass,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import FeaturedCourseHero from '../../components/dashboard/FeaturedCourseHero';
import CourseProgressCard from '../../components/dashboard/CourseProgressCard';
import ContinueLearningCard from '../../components/dashboard/ContinueLearningCard';
import MiniCalendar from '../../components/dashboard/MiniCalendar';
import RecentActivityFeed from '../../components/dashboard/RecentActivityFeed';
import StudentProfileCard from '../../components/dashboard/StudentProfileCard';
import UpcomingClassesCard from '../../components/dashboard/UpcomingClassesCard';
import QuickLinksCard from '../../components/dashboard/QuickLinksCard';
import { getStudentDashboard } from '../../services/enrollment.api';

const ICON_MAP = {
  book: BookOpen,
  check: CheckSquare,
  clock: Clock,
  award: Award,
  code: Code,
  terminal: Terminal,
  palette: Palette,
  cpu: Cpu,
  file: FileText,
  message: MessageSquare,
  clipboard: ClipboardList,
  graduation: GraduationCap,
  help: HelpCircle,
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || 'Student';

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const res = await getStudentDashboard();
        if (res?.data && isMounted) {
          setDashboardData(res.data);
        }
      } catch (err) {
        void err;
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    return dashboardData?.stats || [
      { id: 'enrolled', title: 'Enrolled Courses', value: '0', trend: 'Start learning', icon: 'book', iconBg: 'rgba(37, 99, 235, 0.12)', iconColor: '#2563eb' },
      { id: 'completed', title: 'Completed Courses', value: '0', trend: '0 finished', icon: 'check', iconBg: 'rgba(16, 185, 129, 0.12)', iconColor: '#059669' },
      { id: 'hours', title: 'Total Study Hours', value: '0', trend: 'Tracked time', icon: 'clock', iconBg: 'rgba(147, 51, 234, 0.12)', iconColor: '#9333ea' },
      { id: 'progress', title: 'Average Progress', value: '0%', trend: 'Overall completion', icon: 'award', iconBg: 'rgba(245, 158, 11, 0.12)', iconColor: '#d97706' },
    ];
  }, [dashboardData]);

  const enrolledCourses = useMemo(() => {
    return dashboardData?.courses || [];
  }, [dashboardData]);

  const continueCourse = useMemo(() => {
    if (dashboardData?.continueLearning) {
      return dashboardData.continueLearning;
    }
    if (enrolledCourses.length > 0) {
      const first = enrolledCourses[0];
      return {
        courseId: first.courseId || first.id,
        courseTitle: first.title,
        moduleTitle: 'Course Curriculum',
        progress: first.progress || 0,
      };
    }
    return null;
  }, [dashboardData, enrolledCourses]);

  const handleResume = () => {
    if (continueCourse?.courseId) {
      navigate(`/student/course/${continueCourse.courseId}`);
    } else {
      navigate('/student/browse');
    }
  };

  const handleMarkComplete = () => {};

  const activityFeedItems = (dashboardData?.recentActivity || []).map(item => ({
    ...item,
    icon: ICON_MAP[item.icon] || FileText,
  }));

  const quickLinkItems = [
    { id: 'ql_browse', title: 'Browse Courses', desc: 'Find new skills', to: '/student/browse', icon: Compass, color: '#2563eb', bg: 'rgba(37, 99, 235, 0.1)' },
    { id: 'ql_assign', title: 'Assignments', desc: 'Check due dates', to: '/student/assignments', icon: ClipboardList, color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)' },
    { id: 'ql_calendar', title: 'Calendar', desc: 'Schedules & events', to: '/student/calendar', icon: Clock, color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
    { id: 'ql_purchases', title: 'Purchases', desc: 'Receipts & invoices', to: '/student/purchases', icon: Award, color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)' },
  ];

  const now = new Date();
  const currentMonthStr = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const activeDayNum = now.getDate();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Welcome, {displayName}!
          </h1>
          <Sparkles className="h-5 w-5 text-amber-500" />
        </div>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Keep going! You&apos;re doing great in your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(stat => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            icon={ICON_MAP[stat.icon] || BookOpen}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {dashboardData?.featuredCourse ? (
            <FeaturedCourseHero
              {...dashboardData.featuredCourse}
              onContinue={handleResume}
            />
          ) : (
            <div
              className="rounded-2xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
                  GET STARTED
                </span>
                <h3 className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  Explore Industry-Ready Courses
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Browse our top-rated courses taught by industry experts in Nepal.
                </p>
              </div>
              <Link
                to="/student/browse"
                className="shrink-0 rounded-xl px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary-600)' }}
              >
                Browse Catalog
              </Link>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                My Courses
              </h2>
              <Link
                to="/student/courses"
                className="flex items-center gap-1 text-xs font-semibold hover:underline"
                style={{ color: 'var(--color-primary-600)' }}
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {enrolledCourses.length === 0 ? (
              <div
                className="rounded-2xl border p-8 text-center text-xs space-y-2"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>You haven't enrolled in any courses yet</p>
                <p>Browse our catalog to get started with full-stack development, design, and machine learning.</p>
                <Link
                  to="/student/browse"
                  className="inline-block mt-2 rounded-xl px-4 py-2 text-xs font-bold text-white"
                  style={{ backgroundColor: 'var(--color-primary-600)' }}
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {enrolledCourses.map(course => (
                  <CourseProgressCard
                    key={course.id}
                    title={course.title}
                    category={course.category}
                    status={course.status}
                    progress={course.progress}
                    completedLessons={course.completedLessons}
                    totalLessons={course.totalLessons}
                    icon={ICON_MAP[course.icon] || Code}
                    iconBg={course.iconBg}
                    iconColor={course.iconColor}
                    onClick={() => navigate(`/student/course/${course.courseId || course.id}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {continueCourse && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Continue Learning
                </h2>
                <Link
                  to="/student/courses"
                  className="flex items-center gap-1 text-xs font-semibold hover:underline"
                  style={{ color: 'var(--color-primary-600)' }}
                >
                  <span>View All</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <ContinueLearningCard
                courseTitle={continueCourse.courseTitle}
                moduleTitle={continueCourse.moduleTitle}
                progress={continueCourse.progress}
                onResume={handleResume}
                onComplete={handleMarkComplete}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <MiniCalendar
              month={currentMonthStr}
              totalDays={totalDaysInMonth}
              activeDay={activeDayNum}
              markedDay={activeDayNum}
            />
            <RecentActivityFeed activities={activityFeedItems} />
          </div>
        </div>

        <div className="space-y-6">
          <StudentProfileCard
            name={user?.name || 'Student'}
            role={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}
            program={user?.headline || 'SparrowLMS Student'}
          />

          <UpcomingClassesCard classes={[
            {
              id: 'cls_live',
              title: 'Live Lab & Code Review Session',
              time: 'Today • 4:00 PM',
              course: enrolledCourses[0]?.title || 'Development Workshop',
            },
          ]} />

          <QuickLinksCard links={quickLinkItems} />
        </div>
      </div>
    </div>
  );
}
