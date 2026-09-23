import { Calendar } from 'lucide-react';

export default function AdminWelcomeBanner({ admin }) {
  const name = admin?.name ? admin.name.split(' ')[0] : 'Mahendra';
  const dateStr = admin?.dateStr || 'Mon, Sep 22, 2025';
  const timeStr = admin?.timeStr || '10:24 AM';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Good Morning, {name}!
        </h1>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Here is what is happening with your LMS today.
        </p>
      </div>

      <div
        className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2 border self-start sm:self-auto"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary-600)' }}
        >
          <Calendar className="h-4 w-4" />
        </div>
        <div className="text-left text-xs leading-tight">
          <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
            {dateStr}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {timeStr}
          </p>
        </div>
      </div>
    </div>
  );
}
