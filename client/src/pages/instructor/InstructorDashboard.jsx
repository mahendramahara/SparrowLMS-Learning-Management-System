import { useState, useEffect } from 'react';
import InstructorHeroBanner from '../../components/instructor/InstructorHeroBanner';
import InstructorCoursesGrid from '../../components/instructor/InstructorCoursesGrid';
import InstructorProgressChart from '../../components/instructor/InstructorProgressChart';
import InstructorRecentStudents from '../../components/instructor/InstructorRecentStudents';
import InstructorProfileSidebarCard from '../../components/instructor/InstructorProfileSidebarCard';
import InstructorUpcomingClasses from '../../components/instructor/InstructorUpcomingClasses';
import InstructorQuickActions from '../../components/instructor/InstructorQuickActions';
import InstructorActivityFeed from '../../components/instructor/InstructorActivityFeed';
import { getInstructorDashboard } from '../../services/instructor.api';
import { Loader2 } from 'lucide-react';

export default function InstructorDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const res = await getInstructorDashboard();
        if (isMounted && res?.data) {
          setData(res.data);
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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6">
          <InstructorHeroBanner banner={data.banner} stats={data.stats} />
          <InstructorCoursesGrid courses={data.courses || []} />
          <InstructorProgressChart progressData={data.studentProgress || []} courseStats={data.courseStats} />
          <InstructorRecentStudents students={data.recentStudents || []} />
        </div>

        <div className="xl:col-span-4 space-y-6">
          <InstructorProfileSidebarCard instructor={data.instructor} />
          <InstructorUpcomingClasses classes={data.upcomingClasses || []} />
          <InstructorQuickActions actions={data.quickActions || []} />
          <InstructorActivityFeed activities={data.latestActivity || []} />
        </div>
      </div>
    </div>
  );
}
