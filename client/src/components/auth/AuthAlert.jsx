import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const ALERT_STYLES = {
  error: {
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    color: '#dc2626',
    Icon: AlertCircle,
  },
  success: {
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: '#059669',
    Icon: CheckCircle2,
  },
  info: {
    background: 'var(--color-primary-50)',
    border: '1px solid var(--color-primary-200)',
    color: 'var(--color-primary-700)',
    Icon: Info,
  },
};

export default function AuthAlert({ type = 'error', message }) {
  if (!message) return null;

  const { background, border, color, Icon } = ALERT_STYLES[type] || ALERT_STYLES.error;

  return (
    <div
      className="flex items-start gap-2.5 rounded-xl p-3 text-xs leading-relaxed"
      style={{ background, border, color }}
    >
      <Icon className="h-4 w-4 shrink-0 mt-0.5" />
      <div className="flex-1">{message}</div>
    </div>
  );
}
