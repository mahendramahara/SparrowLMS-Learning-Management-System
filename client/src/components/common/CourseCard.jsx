import { Star, Clock, BarChart2 } from 'lucide-react';

export default function CourseCard({
  image,
  badge,
  badgeColor,
  title,
  instructor,
  avatar,
  rating,
  enrolled,
  duration,
  level,
  price,
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl shadow-sm transition hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="relative">
        <img src={image} alt={title} className="h-32 w-full object-cover" />
        {badge && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm"
            style={{ backgroundColor: badgeColor || 'var(--color-primary-600)' }}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <img src={avatar} alt={instructor} className="h-5 w-5 rounded-full object-cover" />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            By {instructor}
          </span>
        </div>

        <div
          className="mt-2 flex items-center gap-1 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            {rating}
          </span>
          <span>({enrolled} enrolled)</span>
        </div>

        <div
          className="mt-2 flex items-center gap-3 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {duration}
          </span>
          <span className="flex items-center gap-1">
            <BarChart2 className="h-3.5 w-3.5" /> {level}
          </span>
        </div>

        <div
          className="mt-3 border-t pt-3 text-sm font-bold"
          style={{
            borderColor: 'var(--border-subtle)',
            color: 'var(--color-primary-600)',
          }}
        >
          {price}
        </div>
      </div>
    </div>
  );
}
