import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProfileHeroCard from '../../components/profile/ProfileHeroCard';
import ProfileCourseList from '../../components/profile/ProfileCourseList';
import ProfileAchievements from '../../components/profile/ProfileAchievements';
import ProfileActivityFeed from '../../components/profile/ProfileActivityFeed';
import { getMyEnrollments } from '../../services/enrollment.api';
import { getAllAssignments } from '../../services/assignment.api';
import { Loader2 } from 'lucide-react';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadProfileData = async () => {
      try {
        const [enrollRes, assignRes] = await Promise.allSettled([
          getMyEnrollments(),
          getAllAssignments(),
        ]);
        if (isMounted) {
          if (enrollRes.status === 'fulfilled' && enrollRes.value?.data) {
            setEnrollments(enrollRes.value.data);
          }
          if (assignRes.status === 'fulfilled' && assignRes.value?.data) {
            setAssignments(assignRes.value.data);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadProfileData();
    return () => {
      isMounted = false;
    };
  }, []);

  const courses = useMemo(() => {
    return enrollments.map(enr => {
      const crs = enr.course || {};
      const progress = enr.progress || 0;
      return {
        id: crs._id || enr._id,
        title: crs.title || 'Untitled Course',
        instructor: crs.instructor?.name || 'Instructor',
        progress,
        status: progress >= 100 ? 'completed' : 'in-progress',
        category: crs.category?.name || 'Development',
      };
    });
  }, [enrollments]);

  const stats = useMemo(() => {
    const coursesEnrolled = courses.length;
    const coursesCompleted = courses.filter(c => c.status === 'completed').length;
    const assignmentsSubmitted = assignments.filter(a => a.submitted || a.mySubmission).length;
    return {
      coursesEnrolled,
      coursesCompleted,
      assignmentsSubmitted,
      hoursLearned: Math.round(coursesEnrolled * 12 + assignmentsSubmitted * 2),
      averageScore: 92,
      currentStreak: coursesEnrolled > 0 ? 5 : 1,
    };
  }, [courses, assignments]);

  const activeProfile = useMemo(() => {
    return {
      name: user?.name || 'Student',
      email: user?.email || '',
      phone: user?.phone || '+977-9800000000',
      location: user?.location || 'Kathmandu, Nepal',
      website: user?.website || '',
      bio: user?.bio || 'Eager learner pursuing technical mastery.',
      role: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : 'Student',
      avatar: user?.avatar || '',
      joinedDate: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently',
      stats,
    };
  }, [user, stats]);

  const achievements = useMemo(() => {
    const list = [];
    if (courses.length > 0) {
      list.push({
        id: 'ach-1',
        title: 'First Step',
        desc: 'Enrolled in first online course',
        icon: 'compass',
        color: '#2563eb',
      });
    }
    if (stats.coursesCompleted > 0) {
      list.push({
        id: 'ach-2',
        title: 'Course Finisher',
        desc: 'Completed at least one complete course',
        icon: 'graduation-cap',
        color: '#059669',
      });
    }
    if (stats.assignmentsSubmitted > 0) {
      list.push({
        id: 'ach-3',
        title: 'Assignment Submitter',
        desc: 'Submitted course assignments',
        icon: 'zap',
        color: '#7c3aed',
      });
    }
    list.push({
      id: 'ach-4',
      title: 'Dedicated Learner',
      desc: 'Active member of SparrowLMS platform',
      icon: 'star',
      color: '#d97706',
    });
    return list;
  }, [courses, stats]);

  const recentActivity = useMemo(() => {
    const acts = [];
    courses.slice(0, 3).forEach(c => {
      acts.push({
        id: `act-${c.id}`,
        action: c.status === 'completed' ? 'Completed lesson' : 'Started course',
        detail: `Progress at ${c.progress}% in ${c.title}`,
        course: c.title,
        time: 'Recently',
      });
    });
    assignments.slice(0, 2).forEach(a => {
      acts.push({
        id: `act-assign-${a._id}`,
        action: 'Submitted assignment',
        detail: a.title,
        course: a.course?.title || '',
        time: 'Recently',
      });
    });
    return acts;
  }, [courses, assignments]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeroCard profile={activeProfile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfileCourseList courses={courses} />
          <ProfileAchievements achievements={achievements} />
        </div>

        <div>
          <ProfileActivityFeed activity={recentActivity} />
        </div>
      </div>
    </div>
  );
}

