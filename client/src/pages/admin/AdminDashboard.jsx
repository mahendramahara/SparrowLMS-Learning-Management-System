import { useState, useEffect } from 'react';
import AdminWelcomeBanner from '../../components/admin/dashboard/AdminWelcomeBanner';
import AdminMetricsGrid from '../../components/admin/dashboard/AdminMetricsGrid';
import AdminEnrollmentChart from '../../components/admin/dashboard/AdminEnrollmentChart';
import AdminCategoryDonutChart from '../../components/admin/dashboard/AdminCategoryDonutChart';
import AdminQuickActions from '../../components/admin/dashboard/AdminQuickActions';
import AdminRecentActivity from '../../components/admin/dashboard/AdminRecentActivity';
import AdminSystemStatus from '../../components/admin/dashboard/AdminSystemStatus';
import AdminRecentEnrollmentsTable from '../../components/admin/dashboard/AdminRecentEnrollmentsTable';
import AdminTopCourses from '../../components/admin/dashboard/AdminTopCourses';
import AdminRecentMessages from '../../components/admin/dashboard/AdminRecentMessages';
import { getDashboardStats } from '../../services/admin.api';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        if (isMounted && res?.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        void err;
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchStats();
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

  if (!dashboardData) return null;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <AdminWelcomeBanner admin={dashboardData.admin} />

      <AdminMetricsGrid metrics={dashboardData.metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AdminEnrollmentChart data={dashboardData.enrollmentTrends} />
            <AdminCategoryDonutChart data={dashboardData.categoryDistribution} />
          </div>

          <AdminRecentEnrollmentsTable enrollments={dashboardData.recentEnrollments || []} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <AdminTopCourses courses={dashboardData.topCourses || []} />
            </div>
            <div className="xl:col-span-1">
              <AdminRecentMessages messages={dashboardData.recentMessages || []} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <AdminQuickActions actions={dashboardData.quickActions || []} />
          <AdminRecentActivity activities={dashboardData.recentActivity || []} />
          <AdminSystemStatus statuses={dashboardData.systemStatus || []} />
        </div>
      </div>
    </div>
  );
}
