import { useState, useMemo, useEffect } from 'react';
import AdminAssignmentsHeader from '../../components/admin/assignments/AdminAssignmentsHeader';
import AdminAssignmentsTable from '../../components/admin/assignments/AdminAssignmentsTable';
import AdminAssignmentSubmissionsModal from '../../components/admin/assignments/AdminAssignmentSubmissionsModal';
import { getAllAssignments } from '../../services/assignment.api';

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await getAllAssignments();
        if (res.success && Array.isArray(res.data)) {
          setAssignments(res.data);
        }
      } catch (err) {
        console.error('Failed to load assignments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const q = search.toLowerCase();
      return (
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.course && a.course.toLowerCase().includes(q)) ||
        (a.instructor && a.instructor.toLowerCase().includes(q))
      );
    });
  }, [assignments, search]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <AdminAssignmentsHeader
        search={search}
        onSearchChange={setSearch}
        totalCount={filteredAssignments.length}
      />

      {loading ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
          <p className="text-sm font-semibold">Loading assignments...</p>
        </div>
      ) : (
        <AdminAssignmentsTable
          assignments={filteredAssignments}
          onViewSubmissions={assignment => setSelectedAssignment(assignment)}
        />
      )}

      <AdminAssignmentSubmissionsModal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        assignment={selectedAssignment}
      />
    </div>
  );
}
