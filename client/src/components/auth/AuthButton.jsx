import { Loader2 } from 'lucide-react';

export default function AuthButton({
  type = 'submit',
  loading = false,
  disabled = false,
  children,
  icon: Icon,
  variant = 'primary',
  onClick,
  className = '',
}) {
  const baseStyles =
    'relative flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-subtle)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
        };
      default:
        return {
          backgroundColor: 'var(--color-primary-600)',
          color: '#ffffff',
        };
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${className}`}
      style={getVariantStyle()}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}
      <span>{children}</span>
    </button>
  );
}
