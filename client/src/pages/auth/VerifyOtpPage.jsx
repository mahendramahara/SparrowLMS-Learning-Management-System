import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthCard, AuthInput, AuthButton, OtpInput, AuthAlert } from '../../components/auth';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const initialType = searchParams.get('type') || 'email_verification';

  const { verifyOTP } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      </form>
    </AuthCard>
  );
}
