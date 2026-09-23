import { Users, GraduationCap, Video, Star, TrendingUp, Sparkles } from 'lucide-react';

const ICON_MAP = {
  users: Users,
  book: GraduationCap,
  video: Video,
  star: Star,
};

export default function InstructorHeroBanner({ banner, stats }) {
  const { greeting, subtitle, quote } = banner || {};

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden rounded-2xl p-6 sm:p-7 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {greeting}
            </h1>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          </div>

          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-3.5 border self-start lg:self-auto"
            style={{
              backgroundColor: 'rgba(37, 99, 235, 0.05)',
              borderColor: 'rgba(37, 99, 235, 0.2)',
            }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm"
              style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                {quote}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Empowering learners worldwide
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {stats?.map(item => {
            const Icon = ICON_MAP[item.icon] || Users;
            return (
              <div
                key={item.id}
                className="rounded-xl p-4 border transition-all hover:translate-y-[-2px]"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: item.bg, color: item.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    {item.trend}
                  </span>
                </div>

                <p className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {item.value}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
