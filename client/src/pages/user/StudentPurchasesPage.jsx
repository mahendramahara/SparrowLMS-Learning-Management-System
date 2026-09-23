import { useState, useEffect } from 'react';
import { ShoppingBag, Loader2, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { getMyPaymentHistory } from '../../services/payment.api';

export default function StudentPurchasesPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const res = await getMyPaymentHistory();
        if (isMounted && res?.data) {
          setPayments(res.data);
        }
      } catch (err) {
        void err;
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1
          className="text-2xl font-extrabold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Purchase History & Transactions
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Review your enrolled course invoices and eSewa payment receipts.
        </p>
      </div>

      <div
        className="rounded-2xl border overflow-hidden shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {payments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              No purchase records found
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Once you enroll in paid courses via eSewa, your payment statements will be recorded here.
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {payments.map(item => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 text-xs transition hover:bg-slate-50/5"
              >
                <div className="flex items-start gap-4">
                  {item.course?.thumbnail ? (
                    <img
                      src={item.course.thumbnail}
                      alt={item.course?.title}
                      className="h-14 w-24 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-24 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-slate-500 font-bold">
                      COURSE
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {item.course?.title || 'Enrolled Course'}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      <span>Invoice: {item.transactionCode || item.transactionUuid}</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <span className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      Gateway: {item.paymentGateway}
                    </span>
                  </div>
                </div>

                <div className="text-right sm:shrink-0 flex sm:flex-col justify-between items-end">
                  <span className="text-base font-black text-emerald-500">
                    {item.amount === 0 ? 'FREE' : `NPR ${item.amount}`}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
