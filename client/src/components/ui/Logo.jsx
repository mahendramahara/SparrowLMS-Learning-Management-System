import { GraduationCap } from 'lucide-react';

export default function Logo({ dark = false, text = 'SparrowLMS' }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
        style={{ backgroundColor: 'var(--color-primary-600)' }}
      >
        <GraduationCap className="h-6 w-6" strokeWidth={2} />
      </div>
      <div className="leading-tight">
        <div
          className="text-xl font-extrabold tracking-tight"
          style={{ color: dark ? '#ffffff' : 'var(--text-primary)' }}
        >
          {text}
        </div>
        <div
          className="text-[10px] font-medium tracking-wide"
          style={{ color: dark ? '#94a3b8' : 'var(--text-muted)' }}
        >
          Learn · Grow · Succeed
        </div>
      </div>
    </div>
  );
}
