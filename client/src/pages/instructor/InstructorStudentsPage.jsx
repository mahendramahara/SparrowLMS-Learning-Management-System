import { useState, useMemo, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import InstructorStudentsHeader from '../../components/instructor/students/InstructorStudentsHeader';
import InstructorStudentsTable from '../../components/instructor/students/InstructorStudentsTable';
import { getMyStudents } from '../../services/instructor.api';

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const res = await getMyStudents();
        const raw = Array.isArray(res?.data) ? res.data : [];
        if (isMounted) {
          setStudents(raw);
        }
      } catch (err) {
        console.error('Failed to load instructor students', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchStudents();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;
    const query = search.toLowerCase();
    return students.filter(
      s =>
        (s.name && s.name.toLowerCase().includes(query)) ||
        (s.course && s.course.toLowerCase().includes(query)) ||
        (s.email && s.email.toLowerCase().includes(query))
    );
  }, [students, search]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <InstructorStudentsHeader
        search={search}
        onSearchChange={setSearch}
        totalCount={filteredStudents.length}
      />

      {isLoading ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
          <p className="text-xs font-semibold">Loading enrolled students...</p>
        </div>
      ) : (
        <InstructorStudentsTable students={filteredStudents} />
      )}
    </div>
  );
}
