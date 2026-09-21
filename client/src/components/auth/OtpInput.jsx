import { useRef, useEffect } from 'react';

export default function OtpInput({ value = '', onChange, length = 6, disabled = false, error }) {
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const digits = value.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  const handleChange = (index, val) => {
    const char = val.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    const nextDigits = [...digits];
    nextDigits[index] = char;
    const combined = nextDigits.join('');
    onChange?.(combined);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = e => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const pastedDigits = pastedData.slice(0, length);
    onChange?.(pastedDigits);

    const nextFocusIndex = Math.min(pastedDigits.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={el => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[i] || ''}
            disabled={disabled}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className="h-12 w-11 sm:h-14 sm:w-12 text-center text-xl font-bold tracking-tight rounded-xl border transition focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              borderColor: error ? '#ef4444' : 'var(--border-subtle)',
              boxShadow: error ? '0 0 0 1px #ef4444' : undefined,
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--color-primary-600)';
              e.target.style.boxShadow = '0 0 0 3px var(--color-primary-focus)';
            }}
            onBlur={e => {
              e.target.style.borderColor = error ? '#ef4444' : 'var(--border-subtle)';
              e.target.style.boxShadow = error ? '0 0 0 1px #ef4444' : 'none';
            }}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-center text-xs" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}
    </div>
  );
}
