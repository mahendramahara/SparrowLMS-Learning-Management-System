import { Search, Plus } from 'lucide-react';

export default function AdminUsersHeader({
  search,
  onSearchChange,
  activeRole,
  onRoleChange,
  onAddUser,
  counts,
}) {
  const tabs = [
    { id: 'All', label: 'All Users', count: counts?.all || 0 },
    { id: 'Student', label: 'Students', count: counts?.students || 0 },
    { id: 'Instructor', label: 'Instructors', count: counts?.instructors || 0 },
    { id: 'Admin', label: 'Admins', count: counts?.admins || 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            User Management Directory
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Manage student registrations, verify instructors, and assign administrative permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddUser}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
        >
          <Plus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>

      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl p-3 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full rounded-xl py-2 pl-9 pr-4 text-xs border outline-none transition"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto">
          {tabs.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => onRoleChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition shrink-0 ${
                activeRole === item.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] opacity-75 font-normal">({item.count})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
