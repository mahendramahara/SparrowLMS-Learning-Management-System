import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../ui/Logo';

export default function AuthCard({
  title,
  subtitle,
  badge,
  children,
  footer,
  showBackHome = true,
}) {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'var(--bg-subtle)' }}
    >
      {showBackHome && (
        <Link
          to="/"
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs sm:text-sm font-medium transition hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      )}

      <div className="relative w-full max-w-md">
        <div className="auth-card-bg p-6 sm:p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <Link to="/" className="mb-4 inline-block">
              <Logo />
            </Link>

            {badge && (
              <span
                className="mb-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)',
                }}
              >
                {badge}
              </span>
            )}

            <h1
              className="text-xl sm:text-2xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>

          <div className="space-y-4">{children}</div>

          {footer && (
            <div
              className="mt-6 border-t pt-4 text-center text-xs sm:text-sm"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
