import { Link, useLocation } from 'react-router-dom';
import { Clock, ArrowLeft, GraduationCap, MessageSquare, LayoutDashboard, ClipboardList, HelpCircle, Star } from 'lucide-react';

const ROUTE_CONFIGS = {
  '/student/grades': {
    title: 'Grades & Academic Performance',
    description:
      'The automated grade book, GPA progression charts, and downloadable official transcript features are currently scheduled for the next milestone.',
    badge: 'Under Development',
    icon: GraduationCap,
  },
  '/student/messages': {
    title: 'Direct Messaging & Cohort Channels',
    description:
      'Direct student-to-instructor messaging, office hour chat, and peer discussion channels will be introduced in the upcoming sprint.',
    badge: 'Coming Soon',
    icon: MessageSquare,
  },
  '/instructor/assignments': {
    title: 'Assignments Studio',
    description:
      'Automated grading workflows, code submission sandboxes, and rubric evaluation tools are currently under active development.',
    badge: 'Coming Soon',
    icon: ClipboardList,
  },
  '/instructor/quizzes': {
    title: 'Interactive Quizzes & Assessments',
    description:
      'Timed exams, automated multiple-choice scoring, and question bank management will be available in the upcoming release.',
    badge: 'Coming Soon',
    icon: HelpCircle,
  },
  '/instructor/messages': {
    title: 'Instructor & Student Messaging',
    description:
      'Direct office hour chats, student Q&A threads, and broadcast announcements are currently scheduled for development.',
    badge: 'Coming Soon',
    icon: MessageSquare,
  },
  '/instructor/reviews': {
    title: 'Course Reviews & Feedback',
    description:
      'Detailed learner reviews, sentiment analysis, and instructor response tools are currently being developed.',
    badge: 'Coming Soon',
    icon: Star,
  },
  '/admin/messages': {
    title: 'Platform Messaging & Broadcasts',
    description:
      'System-wide announcements, instructor direct communications, and support ticketing threads are scheduled for the next release.',
    badge: 'Coming Soon',
    icon: MessageSquare,
  },
};

export default function FeatureUnderDevelopmentPage({ title, description, badge, icon: PropIcon }) {
  const location = useLocation();
  const config = ROUTE_CONFIGS[location.pathname] || {};
  const isInstructor = location.pathname.startsWith('/instructor');
  const isAdmin = location.pathname.startsWith('/admin');

  const displayTitle = title || config.title || 'Feature Under Active Development';
  const displayDescription =
    description ||
    config.description ||
    'This module is part of our upcoming release cycle. Our team is actively engineering this component to provide an industry-grade learning experience.';
  const displayBadge = badge || config.badge || 'Scheduled Feature';
  const Icon = PropIcon || config.icon || Clock;

  const returnPath = isAdmin ? '/admin' : isInstructor ? '/instructor' : '/student';
  const coursesPath = isAdmin ? '/admin/courses' : isInstructor ? '/instructor/courses' : '/student/courses';

  return (
    <div className="mx-auto max-w-3xl py-12 px-4 text-center">
      <div
        className="flex flex-col items-center rounded-3xl p-8 sm:p-12 border shadow-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl mb-5 shadow-inner"
          style={{
            backgroundColor: 'rgba(37, 99, 235, 0.12)',
            color: 'var(--color-primary-600)',
          }}
        >
          <Icon className="h-8 w-8" />
        </div>

        <span
          className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--color-primary-600)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {displayBadge}
        </span>

        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {displayTitle}
        </h1>

        <p
          className="text-xs sm:text-sm leading-relaxed max-w-lg mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          {displayDescription}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to={returnPath}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--color-primary-600)' }}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>

          <Link
            to={coursesPath}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold border transition hover:opacity-80"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to My Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
