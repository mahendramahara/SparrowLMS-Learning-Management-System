import { Link } from 'react-router-dom';

export default function InstructorFooter() {
  return (
    <footer
      className="mt-12 border-t py-6 px-4 text-xs transition-colors"
      style={{
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-muted)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            SparrowLMS Studio
          </span>
          <span>·</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/instructor/courses" className="hover:underline">
            Courses
          </Link>
          <Link to="/instructor/students" className="hover:underline">
            Students
          </Link>
          <Link to="/instructor/earnings" className="hover:underline">
            Earnings
          </Link>
          <Link to="/instructor/settings" className="hover:underline">
            Settings
          </Link>
        </div>
      </div>
    </footer>
  );
}
