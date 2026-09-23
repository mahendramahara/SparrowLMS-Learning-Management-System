import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import AdminSettingsForm from '../../components/admin/settings/AdminSettingsForm';
import { getSystemSettings, updateSystemSettings } from '../../services/admin.api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'SparrowLMS Learning Platform',
    supportEmail: 'admin@sparrowlms.com',
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
    payoutPercentage: 80,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await getSystemSettings();
        if (isMounted && res?.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error('Failed to load system settings', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggle = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      const res = await updateSystemSettings(settings);
      if (res?.success) {
        toast.success('Admin platform settings updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update system settings');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          System Administration Settings
        </h1>
        <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Configure global platform parameters, registration gates, and revenue share percentages.
        </p>
      </div>

      {isLoading ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
          <p className="text-xs font-semibold">Loading platform settings...</p>
        </div>
      ) : (
        <AdminSettingsForm
          settings={settings}
          onSave={handleSave}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
}
