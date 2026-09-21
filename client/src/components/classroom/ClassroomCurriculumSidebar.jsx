import { CheckCircle2, PlayCircle, Lock, ChevronDown, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function ClassroomCurriculumSidebar({
  modules = [],
  activeLessonId,
  onSelectLesson,
}) {
  const [openModuleIds, setOpenModuleIds] = useState(() => {
    return modules.map(m => m.id);
  });

  const toggleModule = id => {
    setOpenModuleIds(prev => (prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]));
  };

  return (
    <div
      className="flex flex-col rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" style={{ color: 'var(--color-primary-600)' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Course Curriculum
          </h3>
        </div>
        <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
          {modules.length} Modules
        </span>
      </div>

      <div
        className="divide-y overflow-y-auto max-h-[680px]"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {modules.map(module => {
          const isOpen = openModuleIds.includes(module.id);
          const completedCount = module.lessons.filter(l => l.completed).length;

          return (
            <div key={module.id} className="transition">
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                style={{ color: 'var(--text-primary)' }}
              >
                <div className="space-y-0.5 pr-2">
                  <p className="line-clamp-1">{module.title}</p>
                  <p className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>
                    {completedCount} / {module.lessons.length} completed
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform text-slate-400 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="space-y-1 p-2 pt-0" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  {module.lessons.map(lesson => {
                    const isActive = lesson.id === activeLessonId;

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        disabled={lesson.locked}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`w-full flex items-center justify-between gap-2.5 rounded-xl p-2.5 text-left text-xs transition ${
                          isActive
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : lesson.locked
                              ? 'opacity-40 cursor-not-allowed text-slate-500'
                              : 'hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {lesson.completed ? (
                            <CheckCircle2
                              className={`h-4 w-4 shrink-0 ${
                                isActive ? 'text-white' : 'text-emerald-500'
                              }`}
                            />
                          ) : lesson.locked ? (
                            <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          ) : (
                            <PlayCircle
                              className={`h-4 w-4 shrink-0 ${
                                isActive ? 'text-white' : 'text-blue-500'
                              }`}
                            />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>

                        <span
                          className={`text-[10px] shrink-0 ${
                            isActive ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
