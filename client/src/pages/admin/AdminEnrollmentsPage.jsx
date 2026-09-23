import { useState, useMemo, useEffect } from 'react';
import AdminEnrollmentsHeader from '../../components/admin/enrollments/AdminEnrollmentsHeader';
import AdminEnrollmentsTable from '../../components/admin/enrollments/AdminEnrollmentsTable';
import { getEnrollments } from '../../services/admin.api';
import { Loader2 } from 'lucide-react';

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchEnrollments = async () => {
      try {
        const res = await getEnrollments();
        if (isMounted && res?.data) {
          setEnrollments(res.data);
        }
      } catch (err) {
        void err;
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchEnrollments();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(e => {
      const q = search.toLowerCase();
      return (
        e.studentName.toLowerCase().includes(q) ||
        e.courseTitle.toLowerCase().includes(q) ||
        e.instructor.toLowerCase().includes(q)
      );
    });
  }, [enrollments, search]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <AdminEnrollmentsHeader
        search={search}
        onSearchChange={setSearch}
        totalCount={filteredEnrollments.length}
      />

      <AdminEnrollmentsTable enrollments={filteredEnrollments} />
    </div>
  );
}
