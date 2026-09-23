import { useState, useMemo, useEffect } from 'react';
import { ClipboardList, Loader2, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AssignmentStatsSummary from '../../components/assignments/AssignmentStatsSummary';
import AssignmentFilterBar from '../../components/assignments/AssignmentFilterBar';
import AssignmentCard from '../../components/assignments/AssignmentCard';
import AssignmentSubmissionModal from '../../components/assignments/AssignmentSubmissionModal';
import { getAllAssignments } from '../../services/assignment.api';

export default function StudentAssignmentsPage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeModalAssignment, setActiveModalAssignment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAssignments = async () => {
    try {
      const res = await getAllAssignments();
      if (res?.success) {
        setAssignments(res.data || []);
      }
    } catch {
      // graceful fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const formattedAssignments = useMemo(() => {
    return assignments.map(a => {
      const due = a.dueDate ? new Date(a.dueDate) : null;
      const formattedDue = due ? due.toLocaleDateString() : 'No deadline';
      const isPastDue = due ? due.getTime() < Date.now() : false;

      return {
        ...a,
        id: a.id || a._id,
        courseTitle: a.courseTitle || a.course || 'Course',
        description: a.instructions || 'Review objectives and submit solution files or repository link.',
        dueDate: formattedDue,
        totalPoints: a.points || 100,
        deadlineStatus: a.status === 'Submitted'
          ? 'Submitted'
          : a.status === 'Graded'
          ? 'Graded'
          : isPastDue
          ? 'Past due'
          : 'Pending submission',
      };
    });
  }, [assignments]);

  const summary = useMemo(() => {
    return {
      total: formattedAssignments.length,
      pending: formattedAssignments.filter(a => a.status === 'Pending').length,
      submitted: formattedAssignments.filter(a => a.status === 'Submitted').length,
      graded: formattedAssignments.filter(a => a.status === 'Graded').length,
    };
  }, [formattedAssignments]);

  const filteredAssignments = useMemo(() => {
    return formattedAssignments.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'all') return true;
      return item.status === activeFilter;
    });
  }, [formattedAssignments, searchQuery, activeFilter]);

  const handleAction = assignment => {
    setActiveModalAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleSubmissionSuccess = () => {
    fetchAssignments();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

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
            {formattedAssignments.length === 0 ? 'No Assignments Assigned' : 'No assignments match your filter'}
          </h3>
          <p className="text-xs max-w-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {formattedAssignments.length === 0
              ? 'When instructors create tasks for your enrolled courses, they will appear here.'
              : 'Try changing your status tab or resetting the search filter.'}
          </p>
          {formattedAssignments.length === 0 && (
            <button
              type="button"
              onClick={() => navigate('/student/courses')}
              className="mt-4 flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>View Enrolled Courses</span>
            </button>
          )}
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
