import { useState } from 'react';
import { User, Bell, Globe, ShieldCheck } from 'lucide-react';
import SettingsProfileSection from '../../components/settings/SettingsProfileSection';
import SettingsNotificationSection from '../../components/settings/SettingsNotificationSection';
import SettingsAppearanceSection from '../../components/settings/SettingsAppearanceSection';
import SettingsSecuritySection from '../../components/settings/SettingsSecuritySection';
import settingsData from '../../demo/studentSettings.json';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Globe },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

export default function StudentSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderSection = () => {
    switch (activeTab) {
      case 'profile':
        return <SettingsProfileSection profile={settingsData.profile} />;
      case 'notifications':
        return <SettingsNotificationSection notifications={settingsData.notifications} />;
      case 'appearance':
        return <SettingsAppearanceSection appearance={settingsData.appearance} />;
      case 'security':
        return <SettingsSecuritySection security={settingsData.security} />;
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
