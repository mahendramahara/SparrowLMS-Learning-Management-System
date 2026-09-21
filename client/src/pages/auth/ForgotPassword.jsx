import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthCard, AuthInput, AuthButton, OtpInput, AuthAlert } from '../../components/auth';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuth();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendResetOtp = async e => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res?.previewOtp) {
        setDevOtpHint(res.previewOtp);
        setOtp(res.previewOtp);
      }
      setStep(2);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'No account found with this email address.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async e => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to reset password. Please verify the code.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res?.previewOtp) {
        setDevOtpHint(res.previewOtp);
        setOtp(res.previewOtp);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to resend reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title={isSuccess ? 'Password Reset' : 'Reset Password'}
      subtitle={
        isSuccess
          ? 'Your password has been successfully updated'
          : step === 1
            ? 'Enter your email to receive a recovery code'
            : `Recovery code sent to ${email}`
      }
      footer={
        <p>
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-semibold hover:underline"
            style={{ color: 'var(--color-primary-600)' }}
          >
            Back to login
          </Link>
        </p>
      }
    >
      <AuthAlert type="error" message={errorMessage} />

      {isSuccess ? (
        <div className="space-y-4 text-center">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#059669' }}
          >
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            You can now log in to your account with your new password.
          </p>
          <AuthButton type="button" onClick={() => navigate('/login')}>
            Proceed to Login
          </AuthButton>
        </div>
      ) : step === 1 ? (
        <form onSubmit={handleSendResetOtp} className="space-y-4">
          <AuthInput
            label="Registered Email Address"
            id="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            placeholder="name@example.com"
            icon={Mail}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <AuthButton type="submit" loading={loading} icon={ArrowRight}>
            Send Recovery Code
          </AuthButton>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {devOtpHint && (
            <div
              className="rounded-xl border p-2.5 text-center text-xs"
              style={{
                borderColor: 'var(--color-primary-200)',
                backgroundColor: 'var(--color-primary-50)',
                color: 'var(--color-primary-700)',
              }}
            >
              Dev Reset Code:{' '}
              <span className="font-mono font-bold tracking-widest">{devOtpHint}</span>
            </div>
          )}

          <div className="space-y-2">
            <label
              className="block text-center text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              Enter 6-Digit Code
            </label>
            <OtpInput value={otp} onChange={setOtp} />
          </div>

          <AuthInput
            label="New Password"
            id="newPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="At least 6 characters"
            icon={Lock}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />

          <AuthInput
            label="Confirm New Password"
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Confirm your new password"
            icon={Lock}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          <AuthButton type="submit" loading={loading} icon={CheckCircle2}>
            Set New Password
          </AuthButton>

          <div
            className="flex items-center justify-between text-xs pt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            <button type="button" onClick={() => setStep(1)} className="hover:underline">
              Change email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="inline-flex items-center gap-1 font-semibold hover:underline"
              style={{ color: 'var(--color-primary-600)' }}
            >
              <RotateCcw className="h-3 w-3" />
              Resend Code
            </button>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
