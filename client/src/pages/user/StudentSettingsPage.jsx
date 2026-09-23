import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { User, Bell, Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import SettingsProfileSection from '../../components/settings/SettingsProfileSection';
import SettingsNotificationSection from '../../components/settings/SettingsNotificationSection';
import SettingsAppearanceSection from '../../components/settings/SettingsAppearanceSection';
import SettingsSecuritySection from '../../components/settings/SettingsSecuritySection';
import { updateProfile, updatePreferences } from '../../services/user.api';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Globe },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

export default function StudentSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const profile = useMemo(() => ({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    role: user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Student',
    phone: user?.phone || '+977-9800000000',
    location: user?.location || 'Kathmandu, Nepal',
    website: user?.website || '',
    joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
  }), [user]);

  const notifications = useMemo(() => ({
    emailAssignments: user?.preferences?.notifications?.emailAssignments ?? true,
    emailGrades: user?.preferences?.notifications?.emailGrades ?? true,
    emailAnnouncements: user?.preferences?.notifications?.emailAnnouncements ?? true,
    emailNewCourses: user?.preferences?.notifications?.emailNewCourses ?? false,
    browserAssignments: user?.preferences?.notifications?.browserAssignments ?? true,
    browserMessages: user?.preferences?.notifications?.browserMessages ?? true,
    browserGrades: user?.preferences?.notifications?.browserGrades ?? true,
  }), [user]);

  const appearance = useMemo(() => ({
    language: user?.preferences?.language || 'English (US)',
    timezone: user?.preferences?.timezone || 'Asia/Kathmandu (UTC+5:45)',
    dateFormat: user?.preferences?.dateFormat || 'DD/MM/YYYY',
  }), [user]);

  const security = useMemo(() => ({
    lastPasswordChange: user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Recently',
    twoFactorEnabled: false,
    activeSessions: 1,
  }), [user]);

  const handleSaveProfile = async updatedProfile => {
    try {
      await updateProfile({
        name: updatedProfile.name,
        bio: updatedProfile.bio,
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleSavePreferences = async newPrefs => {
    try {
      await updatePreferences({
        preferences: {
          ...(user?.preferences || {}),
          notifications: newPrefs,
        },
      });
      toast.success('Preferences saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save preferences');
    }
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'profile':
        return <SettingsProfileSection profile={profile} onSave={handleSaveProfile} />;
      case 'notifications':
        return <SettingsNotificationSection notifications={notifications} onSave={handleSavePreferences} />;
      case 'appearance':
        return <SettingsAppearanceSection appearance={appearance} />;
      case 'security':
        return <SettingsSecuritySection security={security} />;
      default:
        return null;
    }
  };


  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1
          className="text-2xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Settings
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Manage your account, preferences, and security settings.
        </p>
      </div>

      <div
        className="flex gap-1 rounded-xl p-1 border"
        style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }}
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all"
            style={
              activeTab === id
                ? {
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }
                : { color: 'var(--text-muted)' }
            }
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {renderSection()}
    </div>
  );
}
