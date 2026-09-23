import { useState, useMemo } from 'react';
import {
  X,
  Play,
  Clock,
  BookOpen,
  User,
  Star,
  Lock,
  ArrowRight,
} from 'lucide-react';
import UniversalVideoPlayer from '../common/UniversalVideoPlayer';

export default function StudentCoursePreviewModal({ course, onClose, onEnroll }) {
  const chapters = useMemo(
    () => course?.rawCourse?.chapters || course?.chapters || [],
    [course]
  );

  const previewLessons = useMemo(() => {
    const list = [];
    chapters.forEach((ch, chIdx) => {
      (ch.lessons || []).forEach((l, lIdx) => {
        list.push({
          ...l,
          chapterTitle: ch.title || `Chapter ${chIdx + 1}`,
          chapterIndex: chIdx + 1,
          lessonIndex: lIdx + 1,
          id: l._id || l.id || `ch-${chIdx}-l-${lIdx}`,
        });
      });
    });
    return list;
  }, [chapters]);

  const initialLesson = useMemo(() => {
    const freeLesson = previewLessons.find(l => l.isFreePreview && l.videoUrl);
    if (freeLesson) return freeLesson;
    const anyVideoLesson = previewLessons.find(l => l.videoUrl);
    return anyVideoLesson || previewLessons[0] || null;
  }, [previewLessons]);

  const [activeLesson, setActiveLesson] = useState(initialLesson);

  if (!course) return null;

  const activeVideoUrl = activeLesson?.videoUrl || course.rawCourse?.previewVideoUrl || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative flex flex-col w-full max-w-5xl max-h-[90vh] rounded-3xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div
          className="flex items-center justify-between p-4 px-6 border-b shrink-0"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shrink-0"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              Course Preview
            </span>
            <h2
              className="text-sm sm:text-base font-bold truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {course.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-200 dark:hover:bg-slate-800"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
          <div className="lg:col-span-2 p-5 space-y-4">
            <div
              className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border shadow-inner flex items-center justify-center"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <UniversalVideoPlayer
                videoUrl={activeVideoUrl}
                poster={course.thumbnail}
                title={activeLesson?.title || course.title}
              />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    {activeLesson?.chapterTitle || 'Course Overview'}
                  </span>
                  <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    {activeLesson?.title || course.title}
                  </h3>
                </div>

                {activeLesson?.isFreePreview && (
                  <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-500 border border-emerald-500/20">
                    Free Sample Lecture
                  </span>
                )}
              </div>

              {activeLesson?.content && (
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {activeLesson.content}
                </p>
              )}

              <div
                className="flex flex-wrap items-center gap-4 pt-3 border-t text-xs"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-blue-500" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                  <span>{course.lessonsCount} Total Lectures</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-amber-500">{course.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/30">
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                  Course Syllabus
                </h4>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Click a lecture to preview video
                </p>
              </div>
              <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-500">
                {previewLessons.length} lessons
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {chapters.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No syllabus chapters defined.
                </div>
              ) : (
                chapters.map((ch, chIdx) => (
                  <div key={ch._id || chIdx} className="p-3 space-y-1.5">
                    <span className="text-[11px] font-bold tracking-tight block" style={{ color: 'var(--text-primary)' }}>
                      {ch.title || `Chapter ${chIdx + 1}`}
                    </span>

                    <div className="space-y-1">
                      {(ch.lessons || []).map((l, lIdx) => {
                        const lId = l._id || l.id || `ch-${chIdx}-l-${lIdx}`;
                        const isSelected = activeLesson?.id === lId || activeLesson?._id === lId;
                        const hasVideo = Boolean(l.videoUrl);

                        return (
                          <button
                            key={lId}
                            type="button"
                            onClick={() =>
                              setActiveLesson({
                                ...l,
                                chapterTitle: ch.title,
                                id: lId,
                              })
                            }
                            className="flex w-full items-center justify-between gap-2 rounded-xl p-2 text-left text-xs transition active:scale-98"
                            style={{
                              backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                              color: isSelected ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                            }}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                                style={{
                                  backgroundColor: isSelected ? 'var(--color-primary-600)' : 'var(--bg-subtle)',
                                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                                }}
                              >
                                {l.isFreePreview || hasVideo ? (
                                  <Play className="h-2.5 w-2.5 fill-current" />
                                ) : (
                                  <Lock className="h-2.5 w-2.5" />
                                )}
                              </div>
                              <span className="truncate text-[11px] font-medium">
                                {l.title || `Lesson ${lIdx + 1}`}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {l.isFreePreview && (
                                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
                                  Preview
                                </span>
                              )}
                              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                {l.duration || '5 min'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div
              className="p-4 border-t space-y-3 shrink-0"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                  Total Tuition
                </span>
                <span className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {course.price}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEnroll?.(course);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-95 active:scale-98"
                style={{ backgroundColor: 'var(--color-primary-600)' }}
              >
                <span>Enroll in Full Course</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
