import { ChevronRight } from 'lucide-react';

export default function CourseProgressCard({
  title,
  category,
  status = 'In Progress',
  progress = 0,
  completedLessons = 0,
  totalLessons = 10,
  icon: Icon,
  iconBg = 'rgba(37, 99, 235, 0.12)',
  iconColor = '#2563eb',
  onClick,
}) {
  const getBadgeStyle = () => {
    if (status === 'Completed') {
      return { bg: 'rgba(15, 23, 42, 0.85)', text: '#ffffff' };
    }
    if (status === 'Not Started') {
      return { bg: 'rgba(59, 130, 246, 0.9)', text: '#ffffff' };
    }
    return { bg: 'rgba(16, 185, 129, 0.9)', text: '#ffffff' };
  };

  const badgeStyle = getBadgeStyle();

  return (
    <div
      onClick={onClick}
      className="group flex flex-col justify-between rounded-2xl p-4 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div>
        <div className="flex items-center justify-between">
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
            style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
          >
            {status}
          </span>
        </div>

        <div className="flex justify-center py-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-105"
            style={{ backgroundColor: iconBg, color: iconColor }}
          >
            {Icon && <Icon className="h-8 w-8" />}
          </div>
        </div>

        <h3
          className="text-sm font-bold tracking-tight line-clamp-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {typeof category === 'object' ? category?.name : category}
        </p>
      </div>

      <div className="mt-4 pt-2">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span style={{ color: 'var(--text-muted)' }}>
            {completedLessons} / {totalLessons} lessons
          </span>
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
            {progress}%
          </span>
        </div>

        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: 'var(--bg-subtle)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: progress === 100 ? '#10b981' : 'var(--color-primary-600)',
            }}
          />
        </div>

        <div className="flex justify-end mt-2">
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
