import { ShieldCheck } from 'lucide-react';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t py-6 px-4 sm:px-6 lg:px-8 text-xs transition"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-muted)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-500" />
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            SparrowLMS Administration Core
          </span>
          <span>·</span>
          <span>Enterprise v2.4</span>
        </div>

        <div>
          <span>Copyright {currentYear} SparrowLMS. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
