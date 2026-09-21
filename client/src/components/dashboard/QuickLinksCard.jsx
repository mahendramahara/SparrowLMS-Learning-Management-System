import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuickLinksCard({ links = [] }) {
  return (
    <div
      className="flex flex-col justify-between rounded-2xl p-5 border transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <h3
        className="text-sm font-bold pb-3 border-b"
        style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
      >
        Quick Links
      </h3>

      <div className="space-y-2.5 pt-3">
        {links.map(
          ({
            id,
            title,
            desc,
            to,
            icon: Icon,
            color = '#2563eb',
            bg = 'rgba(37, 99, 235, 0.12)',
          }) => (
            <Link
              key={id}
              to={to}
              className="group flex items-center justify-between gap-2 rounded-xl p-2 transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: bg, color }}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    {title}
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {desc}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )
        )}
      </div>
    </div>
  );
}
