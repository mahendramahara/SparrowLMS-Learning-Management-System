import { useState, useEffect } from 'react';
import InstructorEarningsHeader from '../../components/instructor/earnings/InstructorEarningsHeader';
import InstructorEarningsStats from '../../components/instructor/earnings/InstructorEarningsStats';
import InstructorTransactionsTable from '../../components/instructor/earnings/InstructorTransactionsTable';
import { getInstructorEarnings } from '../../services/payment.api';
import { Loader2 } from 'lucide-react';

export default function InstructorEarningsPage() {
  const [earnings, setEarnings] = useState({
    totalEarnings: 'NPR 0',
    thisMonth: 'NPR 0',
    pendingPayout: 'NPR 0',
    transactions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchEarnings = async () => {
      try {
        const res = await getInstructorEarnings();
        if (isMounted && res?.data) {
          setEarnings(res.data);
        }
      } catch (err) {
        void err;
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchEarnings();
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <InstructorEarningsHeader />
      <InstructorEarningsStats earnings={earnings} />
      <InstructorTransactionsTable transactions={earnings?.transactions || []} />
    </div>
  );
}
