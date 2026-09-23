import { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  Edit,
  Trash2,
  UserX,
  UserCheck2,
} from 'lucide-react';

const ROLE_BADGES = {
  Admin: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: ShieldCheck },
  Instructor: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', icon: GraduationCap },
  Student: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', icon: UserCheck },
};

export default function AdminUsersTable({
  users = [],
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  onChangeRole,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (users.length === 0) {
    return (
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-muted)',
        }}
      >
        <p className="text-sm font-semibold">No users found matching your search.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr
              className="border-b text-[11px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Enrolled / Courses</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {users.map(u => {
              const roleConfig = ROLE_BADGES[u.role] || ROLE_BADGES.Student;
              const RoleIcon = roleConfig.icon;
              const isMenuOpen = openMenuId === u.id;
              const isSuspended = u.status === 'Suspended' || u.status === 'Inactive';

              return (
                <tr key={u.id} className="transition hover:bg-slate-50/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {u.name}
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                      style={{ backgroundColor: roleConfig.bg, color: roleConfig.color }}
                    >
                      <RoleIcon className="h-3 w-3" />
                      <span>{u.role}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {u.enrolledCourses} courses
                  </td>

                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {u.joinedDate}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isSuspended
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        aria-label="User Actions"
                        onMouseDown={e => e.stopPropagation()}
                        onClick={e => {
                          e.stopPropagation();
                          setOpenMenuId(prev => (prev === u.id ? null : u.id));
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition hover:opacity-90 active:scale-95 shadow-sm"
                        style={{
                          borderColor: 'var(--border-subtle)',
                          backgroundColor: isMenuOpen ? 'var(--bg-subtle)' : 'var(--bg-card)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span>Actions</span>
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>

                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          onMouseDown={e => e.stopPropagation()}
                          onClick={e => e.stopPropagation()}
                          className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl border p-1.5 shadow-2xl transition-all z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                          style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-subtle)',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              onEditUser(u);
                            }}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:bg-slate-500/10"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            <Edit className="h-3.5 w-3.5 text-blue-500" />
                            <span>Edit Details</span>
                          </button>

                          {u.role !== 'Instructor' && (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onChangeRole?.(u.id, 'Instructor');
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:bg-slate-500/10 text-purple-600 dark:text-purple-400"
                            >
                              <GraduationCap className="h-3.5 w-3.5" />
                              <span>Make Instructor</span>
                            </button>
                          )}

                          {u.role === 'Instructor' && (
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onChangeRole?.(u.id, 'Student');
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:bg-slate-500/10 text-emerald-600 dark:text-emerald-400"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              <span>Make Student</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              onToggleStatus(u.id);
                            }}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:bg-slate-500/10"
                            style={{ color: isSuspended ? '#10b981' : '#f59e0b' }}
                          >
                            {isSuspended ? (
                              <>
                                <UserCheck2 className="h-3.5 w-3.5 text-emerald-500" />
                                <span>Activate Account</span>
                              </>
                            ) : (
                              <>
                                <UserX className="h-3.5 w-3.5 text-amber-500" />
                                <span>Suspend Account</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              onDeleteUser(u.id);
                            }}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete User</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
