import { useEffect } from 'react';

export default function EsewaCheckoutForm({ formData, paymentUrl, onCancel }) {
  useEffect(() => {
    if (formData && paymentUrl) {
      const form = document.getElementById('esewa_auto_submit_form');
      if (form) {
        form.submit();
      }
    }
  }, [formData, paymentUrl]);

  if (!formData || !paymentUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-md rounded-2xl border p-6 text-center space-y-4 shadow-2xl animate-in fade-in"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-extrabold text-xl">
          eSewa
        </div>

        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Redirecting to eSewa ePay...
          </h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Please wait while we transfer you securely to complete your course payment.
          </p>
        </div>

        <div className="flex justify-center py-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>

        <form id="esewa_auto_submit_form" action={paymentUrl} method="POST" className="hidden">
          {Object.entries(formData).map(([key, val]) => (
            <input key={key} type="hidden" name={key} value={val} />
          ))}
        </form>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-red-500 hover:underline pt-2"
          >
            Cancel Payment
          </button>
        )}
      </div>
    </div>
  );
}
