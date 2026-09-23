import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';

export default function AdminRecentMessages({ messages = [] }) {
  return (
    <div
      className="rounded-2xl p-5 border space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          Recent Messages
        </h2>
        <Link
          to="/admin/messages"
          className="flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: 'var(--color-primary-600, #2563eb)' }}
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className="flex items-center gap-3 text-xs">
            <img
              src={msg.avatar}
              alt={msg.sender}
              className="h-8 w-8 rounded-full object-cover shrink-0 border"
              style={{ borderColor: 'var(--border-subtle)' }}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {msg.sender}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {msg.time}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
