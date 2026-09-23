import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthCard, RoleSwitcher, AuthInput, AuthButton, AuthAlert, GoogleSignInButton } from '../../components/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, googleLogin, loading } = useAuth();

  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMessage) setErrorMessage('');
  };

  const getRedirectPath = userRole => {
    if (userRole === 'admin') return '/admin';
    if (userRole === 'instructor') return '/instructor';
    return '/student';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const user = await login(formData.email, formData.password);
      navigate(getRedirectPath(user?.role || role));
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    }
  };

  const handleGoogleSuccess = async credential => {
    setErrorMessage('');
    try {
      const user = await googleLogin(credential, role);
      navigate(getRedirectPath(user?.role || role));
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Google sign-in failed. Please try again.'
      );
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to continue your learning journey"
      footer={
        <p>
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold hover:underline"
            style={{ color: 'var(--color-primary-600)' }}
          >
            Create an account
          </Link>
        </p>
      }
    >
      <RoleSwitcher activeRole={role} onChange={setRole} />

      <AuthAlert type="error" message={errorMessage} />

      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <AuthInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@example.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              Password <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium hover:underline"
              style={{ color: 'var(--color-primary-600)' }}
            >
              Forgot password?
            </Link>
          </div>
          <AuthInput
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <AuthButton type="submit" loading={loading} icon={ArrowRight}>
          Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
        </AuthButton>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: 'var(--border-subtle)' }} />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span
            className="px-2"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }}
          >
            Or Continue With
          </span>
        </div>
      </div>

      <GoogleSignInButton
        role={role}
        onAuthSuccess={handleGoogleSuccess}
        text={`Sign In with Google as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
      />
    </AuthCard>
  );
}