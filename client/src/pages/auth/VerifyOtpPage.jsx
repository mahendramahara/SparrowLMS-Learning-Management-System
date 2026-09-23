import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthCard, AuthInput, AuthButton, OtpInput, AuthAlert } from '../../components/auth';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const initialType = searchParams.get('type') || 'email_verification';

  const { verifyOTP, resendOTP } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async e => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please provide your email address.');
      return;
    }
    if (otp.length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setErrorMessage('');
    setLoading(true);
    try {
      await verifyOTP(email, otp, initialType);
      setSuccessMessage('Code verified successfully.');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrorMessage('Please enter your email to resend code.');
      return;
    }
    setErrorMessage('');
    setResending(true);
    try {
      await resendOTP(email, initialType);
      setSuccessMessage('New verification code sent to your email.');
      setCooldown(60);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthCard
      title="Verify Code"
      subtitle="Enter the 6-digit code sent to your email"
      footer={
        <p>
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
      <AuthAlert type="success" message={successMessage} />

      <form onSubmit={handleVerify} className="space-y-4">
        <AuthInput
          label="Email Address"
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@example.com"
          icon={Mail}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <div className="space-y-2 pt-1">
          <label
            className="block text-center text-xs font-semibold"
            style={{ color: 'var(--text-secondary)' }}
          >
            6-Digit Verification Code
          </label>
          <OtpInput value={otp} onChange={setOtp} />
        </div>

        <AuthButton type="submit" loading={loading} icon={CheckCircle2}>
          Verify &amp; Continue
        </AuthButton>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline disabled:opacity-50"
            style={{ color: 'var(--color-primary-600)' }}
          >
            <RotateCcw className="h-3 w-3" />
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
