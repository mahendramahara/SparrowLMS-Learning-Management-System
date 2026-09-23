import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import InstructorProfileSection from '../../components/instructor/settings/InstructorProfileSection';
import InstructorNotificationsSection from '../../components/instructor/settings/InstructorNotificationsSection';
import { updateProfile, updatePreferences } from '../../services/user.api';

export default function InstructorSettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    email: '',
    bio: '',
  });
  const [notifications, setNotifications] = useState({
    emailOnEnrollment: true,
    emailOnReview: true,
    emailOnAssignment: true,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        title: user.headline || user.title || 'Faculty Member',
        email: user.email || '',
        bio: user.bio || '',
      });
      if (user.preferences?.notifications) {
        setNotifications(prev => ({ ...prev, ...user.preferences.notifications }));
      }
    }
  }, [user]);

  const handleNotificationToggle = (key, checked) => {
    setNotifications(prev => ({ ...prev, [key]: checked }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: profile.name,
        headline: profile.title,
        bio: profile.bio,
      });
      await updatePreferences({
        preferences: { notifications },
      });
      toast.success('Instructor settings updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Studio Settings
        </h1>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Manage your instructor public profile, notification alerts, and studio preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <InstructorProfileSection
          profile={profile}
          onProfileChange={setProfile}
        />

        <InstructorNotificationsSection
          notifications={notifications}
          onNotificationToggle={handleNotificationToggle}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
