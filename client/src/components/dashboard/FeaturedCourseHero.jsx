import { BookOpen, Clock, BarChart, ArrowRight, Laptop } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FeaturedCourseHero({
  tag,
  title,
  description,
  lessonsCount,
  duration,
  level,
  onContinue,
}) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onContinue) onContinue();
    else navigate('/student/courses');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 border border-indigo-900/50">
      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="max-w-xl space-y-4">
          {tag && (
            <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300 border border-blue-400/20">
              {tag}
            </span>
          )}

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{description}</p>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleAction}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg transition hover:bg-slate-100 active:scale-95"
            >
              <span>Continue Learning</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-300 border-t border-white/10">
            {lessonsCount && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                <span>{lessonsCount}</span>
              </div>
            )}
            {duration && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-400" />
                  <span>{duration}</span>
                </div>
              </>
            )}
            {level && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <BarChart className="h-3.5 w-3.5 text-blue-400" />
                  <span>{level}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center justify-center p-4">
          <div className="relative flex h-48 w-72 items-center justify-center rounded-2xl bg-slate-900/80 border border-white/10 p-4 shadow-2xl backdrop-blur-sm">
            <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg text-xs font-bold">
              JS
            </div>
            <div className="absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg text-xs font-bold">
              Node
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <Laptop className="h-12 w-12 text-blue-400" />
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                  React
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Express
                </span>
                <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                  MongoDB
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-4">
            <span className="h-1.5 w-5 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
