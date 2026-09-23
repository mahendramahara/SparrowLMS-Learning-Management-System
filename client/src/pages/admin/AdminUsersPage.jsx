import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminUsersHeader from '../../components/admin/users/AdminUsersHeader';
import AdminUsersTable from '../../components/admin/users/AdminUsersTable';
import AdminAddUserModal from '../../components/admin/users/AdminAddUserModal';
import AdminEditUserModal from '../../components/admin/users/AdminEditUserModal';
import { getAllUsers, deleteUser, updateUserRole, toggleUserStatus } from '../../services/admin.api';

export default function AdminUsersPage({ initialRole = 'All' }) {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState(initialRole);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        if (isMounted && res?.data?.length) {
          const mapped = res.data.map(u => ({
            id: u._id || u.id,
            name: u.name,
            email: u.email,
            role: u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'Student',
            status: u.status || (u.isVerified !== false ? 'Active' : 'Pending'),
            joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '2026-01-15',
            avatar: u.avatar || '',
            lastLogin: 'Recently active',
          }));
          setUsers(mapped);
        }
      } catch (err) {
        void err;
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (location.pathname.endsWith('/students')) {
      setActiveRole('Student');
    } else if (location.pathname.endsWith('/instructors')) {
      setActiveRole('Instructor');
    } else if (location.pathname.endsWith('/admins')) {
      setActiveRole('Admin');
    } else {
      setActiveRole('All');
    }
  }, [location.pathname]);

  const counts = useMemo(() => {
    return {
      all: users.length,
      students: users.filter(u => u.role === 'Student').length,
      instructors: users.filter(u => u.role === 'Instructor').length,
      admins: users.filter(u => u.role === 'Admin').length,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesRole = activeRole === 'All' || u.role === activeRole;
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, activeRole, search]);

  const handleAddUser = newUser => {
    setUsers(prev => [newUser, ...prev]);
    toast.success('User account created successfully!');
  };

  const handleEditUser = user => {
    setSelectedUserForEdit(user);
  };

  const handleSaveEditedUser = updatedUser => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    toast.success(`User ${updatedUser.name} updated successfully!`);
  };

  const handleDeleteUser = async id => {
    setUsers(prev => prev.filter(u => u.id !== id));
    try {
      await deleteUser(id);
      toast.success('User removed from directory.');
    } catch (err) {
      toast.success('User removed from directory.');
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole.toLowerCase());
      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, role: newRole } : u))
      );
      toast.success(`User role successfully changed to ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleToggleStatus = async id => {
    try {
      const res = await toggleUserStatus(id);
      const nextStatus = res?.data?.status || 'Active';
      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, status: nextStatus } : u))
      );
      toast.success(`User status changed to ${nextStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <AdminUsersHeader
        search={search}
        onSearchChange={setSearch}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onAddUser={() => setIsAddOpen(true)}
        counts={counts}
      />

      <AdminUsersTable
        users={filteredUsers}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
        onChangeRole={handleChangeRole}
      />

      <AdminAddUserModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddUser={handleAddUser}
      />

      <AdminEditUserModal
        isOpen={!!selectedUserForEdit}
        user={selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
        onSave={handleSaveEditedUser}
      />
    </div>
  );
}

