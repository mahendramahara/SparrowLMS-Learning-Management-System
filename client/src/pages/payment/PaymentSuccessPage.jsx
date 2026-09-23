import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { verifyPayment } from '../../services/payment.api';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      const encodedData = searchParams.get('data');
      if (!encodedData) {
        setStatus('error');
        setErrorMessage('Missing transaction signature from payment provider');
        return;
      }

      if (hasTriggered.current) return;
      hasTriggered.current = true;

      try {
        const res = await verifyPayment({ encodedData });
        if (isMounted) {
          if (res?.success) {
            setStatus('success');
            setPaymentData(res.data?.payment || res.data);
          } else {
            setStatus('error');
            setErrorMessage(res?.message || 'Verification could not be confirmed');
          }
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err.response?.data?.message || 'Payment verification failed');
        }
      }
    };

    verify();
    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div
        className="w-full max-w-md rounded-2xl border p-8 text-center space-y-6 shadow-xl"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {status === 'verifying' && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Verifying Payment...
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Confirming transaction authenticity with eSewa servers.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
              Payment Successful!
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Your course enrollment is complete and ready.
            </p>

            {paymentData && (
              <div
                className="rounded-xl p-4 text-xs space-y-1.5 text-left border"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Transaction Code</span>
                  <span className="font-semibold">{paymentData.transactionCode || paymentData.transactionUuid}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Amount Paid</span>
                  <span className="font-bold text-emerald-500">NPR {paymentData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Method</span>
                  <span className="font-medium uppercase">eSewa ePay</span>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/student/courses"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary-600)' }}
              >
                <BookOpen className="h-4 w-4" />
                <span>Go to My Courses</span>
              </Link>
              <Link
                to="/student/purchases"
                className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-4 text-xs font-semibold border transition"
                style={{
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Purchase History</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Verification Failed
            </h2>
            <p className="text-xs text-red-500">
              {errorMessage}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/courses')}
                className="w-full rounded-xl py-2.5 px-4 text-xs font-bold text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary-600)' }}
              >
                Return to Course Catalog
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
