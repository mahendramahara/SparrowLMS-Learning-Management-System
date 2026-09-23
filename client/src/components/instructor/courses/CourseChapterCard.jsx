import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Layers,
  ArrowUp,
  ArrowDown,
  BookOpen,
} from 'lucide-react';
import CourseVideoLessonItem from './CourseVideoLessonItem';

export default function CourseChapterCard({
  chapterIndex,
  totalChapters,
  chapter,
  onUpdateChapter,
  onRemoveChapter,
  onMoveChapter,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const lessons = chapter.lessons || [];

  const handleAddLesson = type => {
    const newLesson = {
      id: `l_${Date.now()}_${lessons.length + 1}`,
      title: `Lesson ${lessons.length + 1}: `,
      type: type || 'video',
      duration: '10:00',
      videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
      isFreePreview: lessons.length === 0,
    };
    onUpdateChapter({
      ...chapter,
      lessons: [...lessons, newLesson],
    });
  };

  const handleUpdateLesson = (lessonIndex, updatedLesson) => {
    const updatedLessons = [...lessons];
    updatedLessons[lessonIndex] = updatedLesson;
    onUpdateChapter({
      ...chapter,
      lessons: updatedLessons,
    });
  };

  const handleRemoveLesson = lessonIndex => {
    onUpdateChapter({
      ...chapter,
      lessons: lessons.filter((_, idx) => idx !== lessonIndex),
    });
  };

  return (
    <div
      className="rounded-3xl border transition-all shadow-sm"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div
        className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold shrink-0"
            style={{
              backgroundColor: 'rgba(37, 99, 235, 0.12)',
              color: 'var(--color-primary-600)',
            }}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Chapter {chapterIndex + 1}</span>
          </span>

          <input
            type="text"
            placeholder="Chapter title (e.g. Master Monorepos, Turborepo & Microfrontends)..."
            value={chapter.title || ''}
            onChange={e => onUpdateChapter({ ...chapter, title: e.target.value })}
            className="w-full bg-transparent text-sm font-bold outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs font-semibold text-slate-400 mr-2 hidden sm:inline">
            {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
          </span>

          {onMoveChapter && (
            <div className="flex items-center">
              <button
                type="button"
                disabled={chapterIndex === 0}
                onClick={() => onMoveChapter(chapterIndex, -1)}
                className="p-1.5 rounded-lg transition hover:bg-slate-500/10 text-slate-400 disabled:opacity-30"
                title="Move Chapter Up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled={chapterIndex === totalChapters - 1}
                onClick={() => onMoveChapter(chapterIndex, 1)}
                className="p-1.5 rounded-lg transition hover:bg-slate-500/10 text-slate-400 disabled:opacity-30"
                title="Move Chapter Down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1.5 rounded-lg border transition hover:opacity-80"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onRemoveChapter}
            className="p-1.5 rounded-lg transition hover:bg-rose-500/10 text-slate-400 hover:text-rose-500"
            title="Delete this chapter"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          <input
            type="text"
            placeholder="Chapter module objective or summary (e.g. Master routing architecture and secure token storage)..."
            value={chapter.description || ''}
            onChange={e => onUpdateChapter({ ...chapter, description: e.target.value })}
            className="w-full rounded-xl border px-3 py-2 text-xs outline-none"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />

          <div className="space-y-3 pt-1">
            {lessons.map((lesson, lIdx) => (
              <CourseVideoLessonItem
                key={lesson.id || lIdx}
                chapterIndex={chapterIndex}
                lessonIndex={lIdx}
                lesson={lesson}
                onChange={updated => handleUpdateLesson(lIdx, updated)}
                onRemove={() => handleRemoveLesson(lIdx)}
              />
            ))}

            {lessons.length === 0 && (
              <div
                className="rounded-2xl border border-dashed p-8 text-center text-xs"
                style={{
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                <BookOpen className="h-6 w-6 mx-auto mb-1.5 opacity-40 text-blue-500" />
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  No lessons in this chapter yet
                </p>
                <p className="text-[11px] mt-0.5">
                  Add video lectures or downloadable student resources below.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleAddLesson('video')}
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition hover:opacity-90 active:scale-95 shadow-sm text-white"
              style={{ backgroundColor: 'var(--color-primary-600, #2563eb)' }}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Video Lesson</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddLesson('resource')}
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold border transition hover:opacity-80 active:scale-95"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              <Plus className="h-3.5 w-3.5 text-emerald-500" />
              <span>Add File / Article Resource</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
