import { useState, useMemo } from 'react';
import { ClipboardList } from 'lucide-react';
import AssignmentStatsSummary from '../../components/assignments/AssignmentStatsSummary';
import AssignmentFilterBar from '../../components/assignments/AssignmentFilterBar';
import AssignmentCard from '../../components/assignments/AssignmentCard';
import AssignmentSubmissionModal from '../../components/assignments/AssignmentSubmissionModal';
import assignmentData from '../../demo/studentAssignments.json';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState(assignmentData.assignments);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeModalAssignment, setActiveModalAssignment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const summary = useMemo(() => {
    return {
      total: assignments.length,
      pending: assignments.filter(a => a.status === 'Pending').length,
      submitted: assignments.filter(a => a.status === 'Submitted').length,
      graded: assignments.filter(a => a.status === 'Graded').length,
    };
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'all') return true;
      return item.status === activeFilter;
    });
  }, [assignments, searchQuery, activeFilter]);

  const handleAction = assignment => {
    if (assignment.status === 'Pending') {
      setActiveModalAssignment(assignment);
      setIsModalOpen(true);
    }
  };

  const handleSubmissionSuccess = assignmentId => {
    setAssignments(prev =>
      prev.map(item =>
        item.id === assignmentId
          ? {
              ...item,
              status: 'Submitted',
              deadlineStatus: 'Submitted just now',
            }
          : item
      )
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="space-y-1">
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Assignments &amp; Tasks
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
          Review pending course deliverables, submit project solutions, and track evaluated grades.
        </p>
      </div>

      <AssignmentStatsSummary summary={summary} />

      <AssignmentFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={summary}
      />

      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredAssignments.map(assignment => (
            <AssignmentCard key={assignment.id} assignment={assignment} onAction={handleAction} />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-2xl p-12 text-center border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl mb-3"
            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          >
            <ClipboardList className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            No assignments found
          </h3>
          <p className="text-xs max-w-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            No assignments match your current filter or search criteria.
          </p>
        </div>
      )}

      <AssignmentSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assignment={activeModalAssignment}
        onSubmitSuccess={handleSubmissionSuccess}
      />
    </div>
  );
}
