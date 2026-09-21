import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthInput({
  label,
  id,
  type = 'text',
  icon: Icon,
  error,
  required,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold mb-1.5"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            style={{ color: 'var(--text-muted)' }}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}

        <input
          id={id}
          type={inputType}
          required={required}
          className={`auth-input ${Icon ? 'pl-9' : 'pl-3.5'} ${isPassword ? 'pr-10' : 'pr-3.5'} ${error ? 'auth-input-error' : ''}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center pr-3 transition hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}
    </div>
  );
}
