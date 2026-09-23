import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentFailurePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div
        className="w-full max-w-md rounded-2xl border p-8 text-center space-y-6 shadow-xl"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
          <XCircle className="h-10 w-10" />
        </div>

        <div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
            Payment Cancelled or Failed
          </h2>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Your transaction with eSewa was not completed or was cancelled. No charges were deducted.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/courses"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary-600)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Courses</span>
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-4 text-xs font-semibold border transition"
            style={{
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
