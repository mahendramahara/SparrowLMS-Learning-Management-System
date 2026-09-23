import { Video, Clock, CheckCircle2, Play } from 'lucide-react';

export default function InstructorPreviewCurriculumSidebar({
  chapters = [],
  activeLessonId,
  onSelectLesson,
}) {
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
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}
      >
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
          Course Syllabus &amp; Lessons
        </h3>
        <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
          {chapters.reduce((sum, ch) => sum + (ch.lessons ? ch.lessons.length : 0), 0)} Total Videos
        </span>
      </div>

      <div className="divide-y overflow-y-auto max-h-[600px]" style={{ borderColor: 'var(--border-subtle)' }}>
        {chapters.map((chapter, cIdx) => (
          <div key={chapter.id || cIdx} className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {chapter.title}
              </span>
              <span className="text-[10px] text-slate-400">
                {chapter.lessons ? chapter.lessons.length : 0} videos
              </span>
            </div>

            <div className="space-y-1">
              {(chapter.lessons || []).map((lesson, lIdx) => {
                const lessonId = lesson._id || lesson.id;
                const isActive = lessonId === activeLessonId;
                return (
                  <button
                    key={lessonId || lIdx}
                    type="button"
                    onClick={() => onSelectLesson(lesson, chapter)}
                    className="flex w-full items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs transition active:scale-98"
                    style={{
                      backgroundColor: isActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                      color: isActive ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                        style={{
                          backgroundColor: isActive ? 'var(--color-primary-600)' : 'var(--bg-subtle)',
                          color: isActive ? '#ffffff' : 'var(--text-muted)',
                        }}
                      >
                        {isActive ? <Play className="h-3 w-3 fill-current" /> : <Video className="h-3 w-3" />}
                      </div>
                      <span className="truncate font-semibold">{lesson.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      <Clock className="h-3 w-3" />
                      <span>{lesson.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
