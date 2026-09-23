import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, Lock, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthCard, AuthInput, AuthButton, OtpInput, AuthAlert, OnboardingForm, GoogleSignInButton } from '../../components/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { sendOTP, resendOTP, verifyOTP, register: registerUser, googleLogin } = useAuth();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');

  const handleSendOtp = async e => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await sendOTP(email);
      if (res?.previewOtp) {
        setDevOtpHint(res.previewOtp);
        setOtp(res.previewOtp);
      }
      setStep(2);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to send verification code. Please check your email.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async credential => {
    setErrorMessage('');
    try {
      await googleLogin(credential, 'student');
      setStep(4);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Google registration failed. Please try again.'
      );
    }
  };

  const handleVerifyOtp = async e => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      await verifyOTP(email, otp, 'email_verification');
      setStep(3);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      await registerUser({ name, email, password, otp });
      setStep(4);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await resendOTP(email, 'email_verification');
      if (res?.previewOtp) {
        setDevOtpHint(res.previewOtp);
        setOtp(res.previewOtp);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      maxWidth={step === 4 ? 'max-w-xl' : 'max-w-md'}
      title={step === 4 ? 'Personalize Your Experience' : 'Create an Account'}
      subtitle={
        step === 1
          ? 'Enter your email to receive a verification code'
          : step === 2
            ? `Verification code sent to ${email}`
            : step === 3
              ? 'Set your name and secure password'
              : 'Choose learning topics and preferences to customize your feed'
      }
      badge={`Step ${step} of 4`}
      footer={
        step !== 4 && (
          <p>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: 'var(--color-primary-600)' }}
            >
              Sign in
            </Link>
          </p>
        )
      }
    >
      <div className="flex items-center justify-between gap-1 mb-2">
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: step >= s ? 'var(--color-primary-600)' : 'var(--border-medium)',
            }}
          />
        ))}
      </div>

      <AuthAlert type="error" message={errorMessage} />

      {step === 1 && (
        <div className="space-y-4">
          <form onSubmit={handleSendOtp} className="space-y-4">
            <AuthInput
              label="Email Address"
              id="email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              placeholder="name@example.com"
              icon={Mail}
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
            />
            <AuthButton type="submit" loading={loading} icon={ArrowRight}>
              Continue
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
            role="student"
            onAuthSuccess={handleGoogleSuccess}
            text="Sign Up with Google"
          />
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          {devOtpHint && (
            <div
              className="rounded-xl border p-2.5 text-center text-xs"
              style={{
                borderColor: 'var(--color-primary-200)',
                backgroundColor: 'var(--color-primary-50)',
                color: 'var(--color-primary-700)',
              }}
            >
              Dev OTP: <span className="font-mono font-bold tracking-widest">{devOtpHint}</span>
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

          <AuthButton type="submit" loading={loading} icon={CheckCircle2}>
            Verify Code
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

      {step === 3 && (
        <form onSubmit={handleRegister} className="space-y-4">
          <AuthInput
            label="Full Name"
            id="name"
            type="text"
            required
            autoFocus
            autoComplete="name"
            placeholder="Your name"
            icon={User}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <AuthInput
            label="Password"
            id="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="At least 6 characters"
            icon={Lock}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <AuthInput
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Confirm your password"
            icon={Lock}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <AuthButton type="submit" loading={loading} icon={CheckCircle2}>
            Create Account
          </AuthButton>
        </form>
      )}

      {step === 4 && (
        <OnboardingForm onComplete={() => navigate('/student')} />
      )}
    </AuthCard>
  );
}
