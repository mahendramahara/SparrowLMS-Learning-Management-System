import { useState, useMemo, useEffect } from 'react';
import { Search, ClipboardList, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import InstructorAssignmentsHeader from '../../components/instructor/assignments/InstructorAssignmentsHeader';
import InstructorAssignmentsStats from '../../components/instructor/assignments/InstructorAssignmentsStats';
import InstructorAssignmentCard from '../../components/instructor/assignments/InstructorAssignmentCard';
import InstructorCreateAssignmentModal from '../../components/instructor/assignments/InstructorCreateAssignmentModal';
import InstructorAssignmentSubmissionsModal from '../../components/instructor/assignments/InstructorAssignmentSubmissionsModal';
import { getAllAssignments, createAssignment } from '../../services/assignment.api';
import { getMyCourses } from '../../services/course.api';

export default function InstructorAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reviewAssignment, setReviewAssignment] = useState(null);

  const fetchData = async () => {
    try {
      const [assignmentsRes, coursesRes] = await Promise.allSettled([
        getAllAssignments(),
        getMyCourses(),
      ]);

      if (assignmentsRes.status === 'fulfilled' && assignmentsRes.value?.success) {
        setAssignments(assignmentsRes.value.data || []);
      }
      if (coursesRes.status === 'fulfilled' && coursesRes.value?.success) {
        setCourses(coursesRes.value.data || []);
      }
    } catch (err) {
      toast.error('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAssignments = useMemo(() => {
    return assignments.filter(item => {
      const courseTitle = item.course || '';
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse = filterCourse === 'All' || courseTitle === filterCourse;
      return matchesSearch && matchesCourse;
    });
  }, [assignments, searchQuery, filterCourse]);

  const handleCreateAssignment = async newAssignment => {
    try {
      const res = await createAssignment(newAssignment.courseId, newAssignment);
      if (res?.success) {
        toast.success('Assignment published successfully!');
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assignment');
    }
  };

  const handleReview = assignment => {
    setReviewAssignment(assignment);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InstructorAssignmentsHeader onNewAssignment={() => setIsCreateModalOpen(true)} />

      <InstructorAssignmentsStats assignments={assignments} />

      <div
        className="flex flex-col gap-3 rounded-2xl p-4 border sm:flex-row sm:items-center sm:justify-between"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-2.5 h-4 w-4"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search assignments or course name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border pl-9 pr-4 py-2 text-xs outline-none transition"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
            className="rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <option value="All">All Courses</option>
            {courses.map(c => (
              <option key={c._id || c.id} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredAssignments.map(assignment => (
            <InstructorAssignmentCard
              key={assignment.id || assignment._id}
              assignment={assignment}
              onReview={handleReview}
            />
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
            No Assignments Found
          </h3>
          <p className="text-xs max-w-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Create assignments for your courses to give practical assessments to enrolled learners.
          </p>
        </div>
      )}

      <InstructorCreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateAssignment}
        courses={courses}
      />

      <InstructorAssignmentSubmissionsModal
        isOpen={!!reviewAssignment}
        onClose={() => setReviewAssignment(null)}
        assignment={reviewAssignment}
        onGraded={fetchData}
      />
    </div>
  );
}
