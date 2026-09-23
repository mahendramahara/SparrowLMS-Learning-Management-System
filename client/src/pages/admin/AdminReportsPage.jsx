import { useState, useEffect } from 'react';
import AdminReportsCards from '../../components/admin/reports/AdminReportsCards';
import AdminRevenueTrendsChart from '../../components/admin/reports/AdminRevenueTrendsChart';
import AdminCategoryRevenueChart from '../../components/admin/reports/AdminCategoryRevenueChart';
import AdminPayoutsLedger from '../../components/admin/reports/AdminPayoutsLedger';
import { getFinancialReports } from '../../services/admin.api';
import { Loader2 } from 'lucide-react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      try {
        const res = await getFinancialReports();
        if (isMounted && res?.data?.reports) {
          setReports(res.data.reports);
        }
      } catch (err) {
        void err;
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchReports();
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

  const activeReports = reports || {
    totalRevenue: 'NPR 0',
    instructorPayouts: 'NPR 0',
    platformProfit: 'NPR 0',
    totalTransactions: 0,
    monthlyGrowth: [],
    categoryRevenue: [],
    payouts: [],
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <AdminReportsCards reports={activeReports} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminRevenueTrendsChart monthlyGrowth={activeReports.monthlyGrowth} />
        </div>
        <div className="lg:col-span-1">
          <AdminCategoryRevenueChart categoryRevenue={activeReports.categoryRevenue} />
        </div>
      </div>

      <AdminPayoutsLedger initialPayouts={activeReports.payouts} />
    </div>
  );
}
