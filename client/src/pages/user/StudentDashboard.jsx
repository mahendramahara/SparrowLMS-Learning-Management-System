import { useState } from 'react';
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
  CheckCircle2,
  MessageSquare,
  ClipboardList,
  GraduationCap,
  HelpCircle,
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
import dashboardData from '../../demo/studentDashboard.json';

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
  const displayName = user?.name || dashboardData.studentProfile.name;

  const [activeCourseProgress, setActiveCourseProgress] = useState(
    dashboardData.continueLearning.progress
  );

  const handleResume = () => {
    navigate('/student/course/c1');
  };

  const handleMarkComplete = () => {
    setActiveCourseProgress(100);
  };

  const activityFeedItems = dashboardData.activities.map(item => ({
    ...item,
    icon: ICON_MAP[item.icon] || FileText,
  }));

  const quickLinkItems = dashboardData.quickLinks.map(item => ({
    ...item,
    icon: ICON_MAP[item.icon] || BookOpen,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Good Morning, {displayName}!
          </h1>
          <Sparkles className="h-5 w-5 text-amber-500" />
        </div>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Keep going! You&apos;re doing great in your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardData.stats.map(stat => (
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
          <FeaturedCourseHero
            {...dashboardData.featuredCourse}
            onContinue={() => navigate('/student/course/c1')}
          />

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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dashboardData.courses.map(course => (
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
                  onClick={() => navigate('/student/course/c1')}
                />
              ))}
            </div>
          </div>

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
              courseTitle={dashboardData.continueLearning.courseTitle}
              moduleTitle={dashboardData.continueLearning.moduleTitle}
              progress={activeCourseProgress}
              onResume={handleResume}
              onComplete={handleMarkComplete}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <MiniCalendar
              month={dashboardData.calendar.month}
              totalDays={dashboardData.calendar.totalDays}
              activeDay={dashboardData.calendar.activeDay}
              markedDay={dashboardData.calendar.markedDay}
            />
            <RecentActivityFeed activities={activityFeedItems} />
          </div>
        </div>

        <div className="space-y-6">
          <StudentProfileCard
            name={user?.name || dashboardData.studentProfile.name}
            role={user?.role || dashboardData.studentProfile.role}
            program={dashboardData.studentProfile.program}
          />

          <UpcomingClassesCard classes={dashboardData.upcomingClasses} />

          <QuickLinksCard links={quickLinkItems} />
        </div>
      </div>
    </div>
  );
}
