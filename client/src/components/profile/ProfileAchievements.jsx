import { Zap, Flame, Star, GraduationCap, Compass, Clock } from 'lucide-react';

const ICON_MAP = {
  zap: Zap,
  flame: Flame,
  star: Star,
  'graduation-cap': GraduationCap,
  compass: Compass,
  clock: Clock,
};

export default function ProfileAchievements({ achievements }) {
  return (
    <div
      className="rounded-2xl border p-5 space-y-4"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div>
        <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Achievements
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {achievements.length} badges earned
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements.map(({ id, title, desc, icon, color }) => {
          const Icon = ICON_MAP[icon] || Star;
          return (
            <div
              key={id}
              className="flex items-start gap-3 rounded-xl p-3.5"
              style={{ backgroundColor: 'var(--bg-subtle)' }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${color}18`, color }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </p>
                <p
                  className="text-[11px] mt-0.5 leading-snug"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
